const express = require("express");
// import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { getSuggestionsFromFoursquare } from "../api/foursquare.ts";
import interestCodes from "../api/interestCodes.ts";
const suggestionRouter = express.Router();
const prisma = new PrismaClient();

// SEARCH flavored GET handling
suggestionRouter.get(`/search/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  try {
    // Pull in current list of saved suggestions. Why do I need saved suggestions in a search function?
    // const savedSuggestions = await prisma.suggestion.findMany();
    // pull the interest name from this user. Keep this in REFACTOR
    const chosenUserInterest: object =
      /*[{name: 'Adult:'}]*/
      await prisma.$queryRaw`SELECT name FROM interest WHERE id IN (SELECT interestId FROM userInterest WHERE userId = ${id})`;
    // let query;
    console.log("before it all comes down:", chosenUserInterest);
    // this is what comes out of the log above: before it all comes down: [ { name: 'Attractions' } ]
    if (chosenUserInterest[0]) {
      let returnString = "";
      // set an empty string that will eventually be what goes into the api search function
      // REFACTOR: query will now = a function that:
      const { name } = chosenUserInterest[0];
      // 1. takes the name from userInterest. Use it to access the corresponding array
      const queryStack: string[] = interestCodes[name]; //for testing, we can replace this line with hardcode.
      // 2. sets a math randomizer that runs up to the length of said array
      if (queryStack) {
        // 3. Set a function that takes 3 or all number sets
        let chosenQueries: string[] = [];
        if (queryStack.length > 2) {
          while (chosenQueries.length < 3) {
            let randomNum: number = Math.floor(
              Math.random() * queryStack.length
            );
            let numString: string = queryStack[randomNum];
            if (!chosenQueries.includes(numString)) {
              chosenQueries[chosenQueries.length] = numString;
            }
          }
        } else if (queryStack.length > 1) {
          queryStack.forEach((query: string) => {
            chosenQueries.push(query);
          });
        } else {
          returnString += queryStack[0];
        }
        // At this point, either chosenQueries has the values it needs, or returnString is populated instead
        // 4. concat the number sets into a string separated by '%2C'
        if (chosenQueries.length) {
          console.log("QUERIES GOT LENGTH", chosenQueries);
          chosenQueries.forEach((chosenQuery: string) => {
            // 5. This string will be the query.
            returnString += chosenQuery + ",";
          });
        }
      }
      getSuggestionsFromFoursquare(returnString)
        .then((data) => {
          if (data) {
            // console.log('we did it, dammit', data);
            res.status(200).send(data);
          } else {
            res.status(404).send("No suggestions found");
          }
        })
        .catch((err) => {
          console.error("had a hard time", err);
          res.sendStatus(500);
        });
    }
  } catch (err) {
    throw err;
  }
});

// function to get all matching itineraryId's matching the given user id
suggestionRouter.get("/check/:id", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const listOfPartyItineraries =
      await prisma.$queryRaw`SELECT * FROM itinerary WHERE partyId IN (SELECT partyId FROM userParty WHERE userId = ${id})`;

    const listOfCreatorItineraries = await prisma.itinerary.findMany({
      where: {
        creatorId: +id,
      },
    });
    const fullListOfItineraries = [];

    // make a function that feeds non-duplicate itineraries into the above array
    const siftItineraries = (itinArray) => {
      itinArray.forEach((itin: object) => {
        if (
          fullListOfItineraries.every(
            (listedItinerary: object) => listedItinerary.id != itin.id
          )
        )
          fullListOfItineraries.push(itin);
      });
    };
    siftItineraries(listOfCreatorItineraries);
    siftItineraries(listOfPartyItineraries);

    res.status(200).send(fullListOfItineraries);
  } catch (err) {
    console.error("could not search for list", err);
    res.sendStatus(500);
  }
});

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
