const express = require('express')
import { PrismaClient } from '@prisma/client';

const commentsRouter = express.Router();
const prisma = new PrismaClient;


// GET: called when the 'make a comment' section is clicked. Pulls all comments that share a comment id
// (or post id, for the original thread) with the thread. shows top to bottom chrono.
// Will most of the time be called from post component, but should be passed down to comment component.

commentsRouter.get(/*Id from the post*/'/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {

    const allComments = await prisma.comment.findMany({
      where: {
        postId: +id,
      }
    })
    res.status(200).send(allComments.reverse())
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
  });

  // get request specifically for checking whether or not this user is allowed to edit this comment
  commentsRouter.get(`/:id/:userId`, async (req: any, res: any) => {
    const { id, userId } = req.params;
    try {
      const credentials = await prisma.comment.findFirst({
        where: {
          id: +id,
          userId: +userId,
        },
      });
      if (credentials) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (err) {
      console.error('failed to check credentials', err);
      res.sendStatus(500);
    }
  });
// POST: Comment must connect to the Post or comment[so these need a postId&&commentId]
// Also must connect with the user that sent the comment

commentsRouter.post('/', async (req: any, res: any) => {
try {

  const newComment = await prisma.comment.create(req.body)
  res.status(201).send('posted!');
} catch (err) {
  console.error('unable to post comment', err);
  res.sendStatus(500);
}
})

// PATCH to add/remove numbers from likes count:
commentsRouter.patch('/likes/:id', async (req:any, res:any) => {
  const { id } = req.params;
  const { direction } = req.body.data;
  let addNum;
  if (direction === "up") {
    addNum = 1;
  } else {
    addNum = -1;
  }
  try {
    const setLikes = await prisma.comment.update({
      where: {
        id: +id,
      },
      data: {
        likes: {
          increment: addNum,
        },
      },
    });
  } catch (err) {
    console.error("unable to change likes", err);
    res.sendStatus(500);
  }
});

// genuine patch function to change the body of a comment
commentsRouter.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { body } = req.body;
  try {
    const newPost = await prisma.comment.update({
      where: {
        id: +id
      },
      data: {
        body,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    console.error("failed to change comment", err);
    res.sendStatus(500);
  }
});


// DELETE will destroy a singular comment from the database. BOTH the user that made the post
// and the user that wrote the post have delete access.

commentsRouter.delete('/:id/:userId', async (req:any, res:any) => {
  const { id, userId } = req.params;
  try {
    // maybe I check id's on the client's side?
    const checkCredentials = await prisma.comment.findFirst({
      where: {
        userId: +userId,
        id: +id,
      }
    })
    if(checkCredentials) {
      const killComment = await prisma.comment.delete({
        where: {id: +id}
      })
      res.status(200).send('comment deleted!');
    } else {
      res.status(403).send('you cannot delete this comment');
    }

    } catch (err){
    console.error('unable to delete comment', err);
    res.sendStatus(500);
  }
});


export default commentsRouter;






/**
 * {
  "results": [
    {
      "fsq_id": "55231ad2498e16ad086d66b0",

      // Categories is an array that holds each "category" by id(no need), NAME, and SHORT_NAME properties
      "categories": [
        ------------------------------------------------------------- 1 --------------------------------------------
        {
          "id": 13009,
          "name": "Cocktail Bar",
          "short_name": "Cocktail",
          "plural_name": "Cocktail Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_",
            "suffix": ".png"
          }
        },
        {
        "id": 13065,
          "name": "Restaurant",
          "short_name": "Restaurant",
          "plural_name": "Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],

      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 338,
      "geocodes": {
        "main": {
        //  LATITUDE-LONGITUDE are inside of MAIN (RESULTS[].GEOCODES.MAIN.ETC)
          "latitude": 29.952663,
          "longitude": -90.072565
        },
        LOOK UP WHAT ROOF IS(looks like the same as the regular latlong in most cases)
        "roof": {
          "latitude": 29.952663,
          "longitude": -90.072565
        }
      },
      "link": "/v3/places/55231ad2498e16ad086d66b0",
  
        LOOKS LIKE RESULTS[].LOCATION.FORMATTED_ADDRESS

      "location": {
        "address": "225 Baronne St",
        "census_block": "220710134001006",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "225 Baronne St, New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },

      SEEMS LIKE JUST RESULTS[].LOCATION.NAME



      "name": "W XYZ Bar", ---------------------------------------------------------
       RELATED PLACES SEEMS TO REFER TO A PLACE OUR PLACE IS WITHIN. MAYBE NO WORRIES ON THAT
      "related_places": {
        "parent": {
          "fsq_id": "5501a6a3498e1d83354342b0",

          IF IT GETS IMPORTANT, THOUGH, IT'S RESULTS[].RELATED_PLACES.CATEGORIES[].SHORT_NAME
          AND RESULTS[].RELATED_PLACES.NAME
          "categories": [
            {
              "id": 19014,
              "name": "Hotel",
              "short_name": "Hotel",
              "plural_name": "Hotels",
              "icon": {
                "prefix": "https://ss3.4sqi.net/img/categories_v2/travel/hotel_",
                "suffix": ".png"
              }
            }
          ],
          "name": "Aloft"
        }
      },
      "timezone": "America/Chicago"
    },
    ------------------------------------------------------------------------ 2 --------------------------------------
    {
      "fsq_id": "51ba3d52498ed12a6a9fb5d8",
      "categories": [
        {
          "id": 13003,
          "name": "Bar",
          "short_name": "Bar",
          "plural_name": "Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 497,
      "geocodes": {
        "drop_off": {
          "latitude": 29.956778,
          "longitude": -90.07036
        },
        "main": {
          "latitude": 29.956654,
          "longitude": -90.070443
        },
        "roof": {
          "latitude": 29.956654,
          "longitude": -90.070443
        }
      },
      "link": "/v3/places/51ba3d52498ed12a6a9fb5d8",
      "location": {
        "address": "1000 Bienville St",
        "census_block": "220710135011023",
        "country": "US",
        "cross_street": "Burgundy",
        "dma": "New Orleans",
        "formatted_address": "1000 Bienville St (Burgundy), New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "The Upper Quarter", --------------------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    ---------------------------------------------------------- 3 -----------------------------------------
    {
      "fsq_id": "592903219deb7d7d29ae6dff",
      "categories": [
        {
          "id": 13003,
          "name": "Bar",
          "short_name": "Bar",
          "plural_name": "Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
            "suffix": ".png"
          }
        },
        {
          "id": 13068,
          "name": "American Restaurant",
          "short_name": "American",
          "plural_name": "American Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "Unsure",
      "distance": 596,
      "geocodes": {
        "drop_off": {
          "latitude": 29.955046,
          "longitude": -90.068844
        },
        "main": {
          "latitude": 29.955173,
          "longitude": -90.068985
        },
        "roof": {
          "latitude": 29.955173,
          "longitude": -90.068985
        }
      },
      "link": "/v3/places/592903219deb7d7d29ae6dff",
      "location": {
        "address": "217 Bourbon St",
        "census_block": "220710135011027",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "217 Bourbon St, New Orleans, LA 70130",
        "locality": "New Orleans",
        "postcode": "70130",
        "region": "LA"
      },
      "name": "Bourbon Street Drinkery", ------------------------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    ------------------------------------------------ 4 ---------------------------------------
    {
      "fsq_id": "4ad4c04cf964a5201df320e3",
      "categories": [
        {
          "id": 13003,
          "name": "Bar",
          "short_name": "Bar",
          "plural_name": "Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
            "suffix": ".png"
          }
        },
        {
          "id": 13000,
          "name": "Dining and Drinking",
          "short_name": "Dining and Drinking",
          "plural_name": "Dining and Drinking",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "Unsure",
      "distance": 541,
      "geocodes": {
        "drop_off": {
          "latitude": 29.95487,
          "longitude": -90.069387
        },
        "main": {
          "latitude": 29.955026,
          "longitude": -90.069281
        },
        "roof": {
          "latitude": 29.955026,
          "longitude": -90.069281
        }
      },
      "link": "/v3/places/4ad4c04cf964a5201df320e3",
      "location": {
        "address": "811 Iberville St",
        "census_block": "220710135011027",
        "country": "US",
        "dma": "New Orleans",
        "formatted_address": "811 Iberville St, New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "The Alibi", ---------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    ---------------------------------------------------- 5 -------------------------------------------------
    {
      "fsq_id": "5204623d498ea152dc5d17fc",
      "categories": [
        {
          "id": 13003,
          "name": "Bar",
          "short_name": "Bar",
          "plural_name": "Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 524,
      "geocodes": {
        "main": {
          "latitude": 29.951252,
          "longitude": -90.07129
        },
        "roof": {
          "latitude": 29.951252,
          "longitude": -90.07129
        }
      },
      "link": "/v3/places/5204623d498ea152dc5d17fc",
      "location": {
        "address": "718 N Rampart St, New Orleans, LA 70116",
        "census_block": "220710134001023",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "718 N Rampart St, New Orleans, LA 70116, New Orleans, LA 70130",
        "locality": "New Orleans",
        "postcode": "70130",
        "region": "LA"
      },
      "name": "VooDoo Lounge", -------------------------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    --------------------------------------------------------- 6 ---------------------------------------
    {
      "fsq_id": "41326e00f964a520871a1fe3",
      "categories": [
        {
          "id": 13009,
          "name": "Cocktail Bar",
          "short_name": "Cocktail",
          "plural_name": "Cocktail Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_",
            "suffix": ".png"
          }
        },
        {
          "id": 13065,
          "name": "Restaurant",
          "short_name": "Restaurant",
          "plural_name": "Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 543,
      "geocodes": {
        "main": {
          "latitude": 29.951097,
          "longitude": -90.071192
        },
        "roof": {
          "latitude": 29.951097,
          "longitude": -90.071192
        }
      },
      "link": "/v3/places/41326e00f964a520871a1fe3",
      "location": {
        "address": "330 Carondelet St",
        "census_block": "220710134001023",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "330 Carondelet St, New Orleans, LA 70130",
        "locality": "New Orleans",
        "postcode": "70130",
        "region": "LA"
      },
      "name": "Voodoo Two", ---------------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    --------------------------------------------- 7 --------------------------------------
    {
      "fsq_id": "4b3c4185f964a5206c8325e3",
      "categories": [
        {
          "id": 13022,
          "name": "Sports Bar",
          "short_name": "Sports Bar",
          "plural_name": "Sports Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/sportsbar_",
            "suffix": ".png"
          }
        },
        {
          "id": 13064,
          "name": "Pizzeria",
          "short_name": "Pizza",
          "plural_name": "Pizzerias",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/pizza_",
            "suffix": ".png"
          }
        },
        {
          "id": 13068,
          "name": "American Restaurant",
          "short_name": "American",
          "plural_name": "American Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 621,
      "geocodes": {
        "drop_off": {
          "latitude": 29.957608,
          "longitude": -90.06942
        },
        "main": {
          "latitude": 29.957529,
          "longitude": -90.06933
        },
        "roof": {
          "latitude": 29.957529,
          "longitude": -90.06933
        }
      },
      "link": "/v3/places/4b3c4185f964a5206c8325e3",
      "location": {
        "address": "400 Burgundy St",
        "census_block": "220710135011018",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "400 Burgundy St, New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "Three Legged Dog", -----------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    ------------------------------------------------------ 8 ----------------------------------
    {
      "fsq_id": "54d7b6a1498e8e0674d9ac10",
      "categories": [
        {
          "id": 13003,
          "name": "Bar",
          "short_name": "Bar",
          "plural_name": "Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/pub_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 796,
      "geocodes": {
        "drop_off": {
          "latitude": 29.957286,
          "longitude": -90.067466
        },
        "main": {
          "latitude": 29.95742,
          "longitude": -90.067375
        },
        "roof": {
          "latitude": 29.95742,
          "longitude": -90.067375
        }
      },
      "link": "/v3/places/54d7b6a1498e8e0674d9ac10",
      "location": {
        "address": "819 Saint Louis St",
        "census_block": "220710135011006",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "819 Saint Louis St, New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "B Mac's", ----------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    ----------------------------------------------- 9 ---------------------------------
    {
      "fsq_id": "5840daf88ae36321db523d6b",
      "categories": [
        {
          "id": 13009,
          "name": "Cocktail Bar",
          "short_name": "Cocktail",
          "plural_name": "Cocktail Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_",
            "suffix": ".png"
          }
        },
        {
          "id": 13050,
          "name": "Distillery",
          "short_name": "Distillery",
          "plural_name": "Distilleries",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/brewery_",
            "suffix": ".png"
          }
        },
        {
          "id": 13065,
          "name": "Restaurant",
          "short_name": "Restaurant",
          "plural_name": "Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/default_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "LikelyOpen",
      "distance": 737,
      "geocodes": {
        "main": {
          "latitude": 29.961436,
          "longitude": -90.076392
        },
        "roof": {
          "latitude": 29.961436,
          "longitude": -90.076392
        }
      },
      "link": "/v3/places/5840daf88ae36321db523d6b",
      "location": {
        "address": "301 N Claiborne Ave",
        "census_block": "220710049001040",
        "country": "US",
        "cross_street": "at Bienville Ave",
        "dma": "New Orleans",
        "formatted_address": "301 N Claiborne Ave (at Bienville Ave), New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "Seven Three Distilling Co.", --------------------------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    },
    -------------------------------------------------------- 10 --------------------------------------
    {
      "fsq_id": "59c58f886a8d86734d3ae47b",
      "categories": [
        {
          "id": 13009,
          "name": "Cocktail Bar",
          "short_name": "Cocktail",
          "plural_name": "Cocktail Bars",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_",
            "suffix": ".png"
          }
        },
        {
          "id": 13128,
          "name": "Taiwanese Restaurant",
          "short_name": "Taiwanese",
          "plural_name": "Taiwanese Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/asian_",
            "suffix": ".png"
          }
        },
        {
          "id": 13377,
          "name": "Vegan and Vegetarian Restaurant",
          "short_name": "Vegan and Vegetarian Restaurant",
          "plural_name": "Vegan and Vegetarian Restaurants",
          "icon": {
            "prefix": "https://ss3.4sqi.net/img/categories_v2/food/vegetarian_",
            "suffix": ".png"
          }
        }
      ],
      "chains": [],
      "closed_bucket": "Unsure",
      "distance": 358,
      "geocodes": {
        "drop_off": {
          "latitude": 29.951936,
          "longitude": -90.073094
        },
        "main": {
          "latitude": 29.951754,
          "longitude": -90.073159
        },
        "roof": {
          "latitude": 29.951754,
          "longitude": -90.073159
        }
      },
      "link": "/v3/places/59c58f886a8d86734d3ae47b",
      "location": {
        "address": "914 Union St",
        "census_block": "220710134001017",
        "country": "US",
        "cross_street": "",
        "dma": "New Orleans",
        "formatted_address": "914 Union St, New Orleans, LA 70112",
        "locality": "New Orleans",
        "postcode": "70112",
        "region": "LA"
      },
      "name": "Piscobar", -----------------------------------------------
      "related_places": {},
      "timezone": "America/Chicago"
    }
  ],
  "context": {
    "geo_bounds": {
      "circle": {
        "center": {
          "latitude": 29.95465,
          "longitude": -90.07507
        },
        "radius": 3000
      }
    }
  }
}
 */