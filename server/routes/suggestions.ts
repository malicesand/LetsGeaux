const express = require("express");
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import pThrottle from 'p-throttle';
import {getSuggestionsFromFoursquare} from '../api/foursquare.ts';
import interestCodes from '../api/interestCodes.ts';
const suggestionRouter = express.Router();
const prisma = new PrismaClient();
const API_KEY = process.env.TRAVEL_ADVISOR_API_KEY;



/**
 *
 *  NEW PLACE API FOURSQUARE FUNCTION
 *    fsqDevelopers.placeSearch()
   .then(({ data }) => console.log(data))
   .catch(err => console.error(err));
 *
 *  NEW PICTURE API FOURSQUARE FUNCTION
 *  fsqDevelopers.placePhotos({fsq_id: 'fsq_id'})
   .then(({ data }) => console.log(data))
   .catch(err => console.error(err));


 */





//This one queries tripadvisor to get the location ids needed for detailed information. these ids are returned in an array.
// const getTripadvisorLocationIds = async (
//   query: string = "restaurants",
//   latLong: string = "30.001667%2C-90.092781"
// ) => {
  // try {
    //  https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=42.3455%2C-71.10767&key={API_KEY}&category=${query}&language=en;

    // const list = await axios.get(
    //   `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${latLong}&language=en&category=${query}&key=${API_KEY}`
    // );
  //   let locations = [];
  //   const attractionList = list.data.data;
  //   for (let attraction of attractionList) {
  //     locations.push(attraction.location_id);
  //   }
  //   return locations;
  // } catch (err) {
  //   console.error("failed to get ids", err);
  // }
// };


// const throttled = pThrottle({
//   limit: 1,
//   interval: 1000
// });

// const throttledTripAdvisorDetailedEntries = throttled(async (location: number) => {
//   const detailedEntry = await axios.get(
//     `https://api.content.tripadvisor.com/api/v1/location/${location}/details?language=en&currency=USD&key=${API_KEY}`
//   );
//   const {
//     name,
//     description,
//     // hours,
//     phone,
//     address_obj,
//     latitude,
//     longitude,
//     // price_level,
//   } = detailedEntry.data;
//   const locationQueryDetailedEntry = {
//     title: name,
//     description,
//     // hours: hours.weekday_text,
//     phoneNum: phone,
//     // address: address_obj.address_string || "new orleans",
//     latitude,
//     longitude,
//     address: address_obj.address_string,
//     image: null,
//   };
  // let's try and add the picture now

  // const tripAdvisorImage = await  axios.get(
    // `https://api.content.tripadvisor.com/api/v1/location/${location}/photos?language=en&key=${API_KEY}`
  // )
  // .then((setOfImages) => {
  //   if (setOfImages.data.data[0]) {
  //     locationQueryDetailedEntry.image = setOfImages.data.data[0].images.thumbnail.url
  //   } else {
  //     // locationQueryDetailedEntry.image = "https://media-cdn.tripadvisor.com/media/photo-t/22/3f/ab/1b/interesting-and-confusing.jpg"
  //   }
  //   console.log('sending object:', locationQueryDetailedEntry)
  // })
  // return locationQueryDetailedEntry;
// })


// async function getAllEntries(locations) {
//   try {
//     const detailedEntries = await Promise.all((locations.map((location) => throttledTripAdvisorDetailedEntries(location))))
//     return detailedEntries;
//   } catch (err) {
//     console.error(err);
//   }
// }

// SEARCH flavored GET handling
suggestionRouter.get(`/search/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  try {
    // Pull in current list of saved suggestions. Why do I need saved suggestions in a search function?
    // const savedSuggestions = await prisma.suggestion.findMany();
    // pull the interest name from this user. Keep this in REFACTOR
    const chosenUserInterest: object =/*[{name: 'Adult:'}]*/
      await prisma.$queryRaw`SELECT name FROM interest WHERE id IN (SELECT interestId FROM userInterest WHERE userId = ${id})`;
    // let query;
    // console.log('before it all comes down:', chosenUserInterest);
    // this is what comes out of the log above: before it all comes down: [ { name: 'Attractions' } ]
    if (chosenUserInterest[0]) {
      let returnString = '';
      // set an empty string that will eventually be what goes into the api search function
      // REFACTOR: query will now = a function that:
      const name/*{ name }*/ = /*chosenUserInterest[0]*/'Food';
      // 1. takes the name from userInterest. Use it to access the corresponding array
      const queryStack: string[] = interestCodes[name] //for testing, we can replace this line with hardcode.
      // 2. sets a math randomizer that runs up to the length of said array
      if (queryStack) {

        // 3. Set a function that takes 3 or all number sets
        let chosenQueries: string[] = [];
        if (queryStack.length > 2) {
          while (chosenQueries.length < 3) {
            let randomNum: number = Math.floor(Math.random() * queryStack.length)
            let numString: string = queryStack[randomNum]
            if (!chosenQueries.includes(numString)) {
              chosenQueries[chosenQueries.length] = numString;
            }
          }
        } else if (queryStack.length > 1) {
          queryStack.forEach((query: string) => {
          chosenQueries.push(query);
        })
      } else {
        returnString += queryStack[0];
      }
      // At this point, either chosenQueries has the values it needs, or returnString is populated instead
      // 4. concat the number sets into a string separated by '%2C'
      if (chosenQueries.length) {
        console.log('QUERIES GOT LENGTH', chosenQueries)
        chosenQueries.forEach((chosenQuery: string) => {
          // 5. This string will be the query.
          returnString += chosenQuery + ','
        })
      }
      }

      ////query = name.toLowerCase();
      // a separate location query doesn't seem to be needed in refactor
      // since the detailed entries seem to have the same information as the regular place search..
      // const locations: number[] = await getTripadvisorLocationIds(query)
      // .then((locationArray) => {
        // getAllEntries(locationArray).then((entries) => {
          // looks like I didn't need saved suggestions after all..
          // Object.values(savedSuggestions).map((sugg) => {
          // });
          // let newEntries = [];
          // entries.forEach((entry) => {
            // THIS LINE SORTS THEM CORRECTLY! ATTACH A FILTER TO IT, GIVE IT A VARIABLE AND SHIP IT OUT

            // if (
              // Oh WAIT! It's to check for duplicates.. I think I should keep this
              // NOTE: If we set  db suggs to a filter on the client, dupes won't matter and this should go.
              // Also: will forest it now, just for simplicity
              // Object.values(savedSuggestions).every((sugg) => {
                // title's been a crappy way to do this. Maybe I add a space in the suggestion
                // schema for the foursquare Id, and compare those in this case.
                // return sugg.title !== entry.title;
                // })
                // ) {
                  // newEntries.push(entry);
                  // }

                  // setting up the new api search function right here with old values

                  /**
                   * suggestionRouter.get('/test', (req: any, res: any) => {
                  getSuggestionsFromFoursquare('4bf58dd8d48988d16a941735').then((data) => {
                    if (data) {
                      console.log();
                      res.status(200).send(data);
                      } else {
                        res.status(404).send('failed the test, yo');
                    }
                    }).catch((err) => {
                      console.error('could not test', err);
                      res.sendStatus(500);
                      });

                      });
                      */
                     // calling the api function from its file, with the returning string of 
                     // category codes as the argument
                     getSuggestionsFromFoursquare(returnString).then((data) => {
                      if (data) {
                        console.log('we did it, dammit', data);
                        res.status(200).send(data);
                      } else {
                        res.status(404).send('failed the test, yo');
                      }
                     })

                    // });
                    // res.status(200).send(newEntries);
                  // });
                // })
                .catch((err) => {
                  console.error("had a hard time", err);
                  res.sendStatus(500);
                });
                // }
              }
              } catch (err) {
                throw err;
              }
            });


// function to test foursquare api in postman
// suggestionRouter.get('/test', (req: any, res: any) => {
//   getSuggestionsFromFoursquare('4bf58dd8d48988d16a941735').then((data) => {
//     if (data) {
//       console.log();
//       res.status(200).send(data);
//     } else {
//       res.status(404).send('failed the test, yo');
//     }
//   }).catch((err) => {
//     console.error('could not test', err);
//     res.sendStatus(500);
//   });

//     });




// adds to the vote upvote/downvote count of a suggestion
suggestionRouter.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const values = () => {
    for (let key of req.body.data) {
      return req.body.data[key];
    }
  };

  try {
    const polarity = req.body;
    const setVote = await prisma.suggestion.update({
      where: { id: +id },
      data: {
        [polarity]: {
          increment: 1,
        },
      },
    });
  } catch (err) {
    console.error("unable to add vote", err);
    res.sendStatus(500);
  }
});

// GET request handling
suggestionRouter.get("/", async (req: any, res: any) => {
  try {
    const allSuggs = await prisma.suggestion.findMany();

    res.status(200).send(allSuggs);
  } catch (err: any) {
    console.error("FAIL!!", err);
    res.sendStatus(500);
  }
});

// POST requests from suggestions page (suggestion component)
//--------------------------- REFACTOR for new API;-------------------------------
// Actually, it looks like this needs to be refactored in the client. req.body should do all the 
// heavy lifting..
suggestionRouter.post("/:userId", async (req: any, res: any) => {
  const { userId } = req.params;
  console.log('trying to post suggestions', req.body);
  try {
    const newSuggestion = await prisma.suggestion.create(req.body);
    const { id } = newSuggestion;
    const wishObj = {
      data: {
        userId: +userId,
        suggestionId: id,
      },
    };
    const wishlistUserSuggestion =
      await prisma.userOnsuggestion.create(wishObj);
    res.sendStatus(201);
  } catch (err) {
    console.error("failed to add Suggestion", err);
    res.sendStatus(500);
  }
});

export default suggestionRouter;
