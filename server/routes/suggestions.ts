const express = require('express');
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const suggestionRouter = express.Router();
const prisma = new PrismaClient();
// .env api authorization information
const API_KEY = process.env.TRAVEL_ADVISOR_API_KEY;
// Api url options
// const options = {
//   method: 'GET',
//   url: `https://api.content.tripadvisor.com/api/v1/location/search?language=en&searchQuery=${query}&key=${API_KEY}`,
//   descriptionUrl: `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?language=en&currency=USD&key=${API_KEY}`,
//   imageUrl: `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?language=en&key=${API_KEY}`,
//   headers: {accept: 'application/json'}
// };

//  HELPERS //

//This one queries tripadvisor to get the location ids needed for detailed information. these ids are returned in an array.
const getTripadvisorLocationIds = async (query: string = "new-orleans-attraction") => {
  try {

    const list = await axios.get(`https://api.content.tripadvisor.com/api/v1/location/search?language=en&searchQuery=${query}&key=${API_KEY}`)
      let locations = [];
      const attractionList = list.data.data;
      for (attraction of attractionList) {
        locations.push(attraction.location_id);
      }
      return locations;
    } catch (err) {

      console.error('failed to get ids', err);
    }
}

// This one queries trip advisor with an array of location ids and moves wanted info from the result to an object
const getTripadvisorDetailedEntries = async (locations) => {
  try {

    const detailedEntries = await locations.map((location) => {
      axios.get(`https://api.content.tripadvisor.com/api/v1/location/${location}/details?language=en&currency=USD&key=${API_KEY}`)
      .then((locationQueryProperties) => {
        console.log('entry query Properties from the inside');
        console.log('yo');
        const {
          name,
          description,
          // hours,
          phone,
          address_obj,
          latitude,
          longitude,
          // price_level,
        } = locationQueryProperties;

        const product = {
          title: name,
          description,
          // timeAvailable: hours.weekday_text,
          phoneNum: phone,
          // address: address_obj.address_string || "new orleans",
          latitude,
          longitude,
          // cost: price_level.length,
        }
      })
    })
  } catch(err) {console.error(err)}
}
// and finally, this one grabs the image url
const getTripAdvisorImage = (locationId) => {
  axios.get(`https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?language=en&key=${API_KEY}`)
  .then((setOfImages) => {
    const { thumbnail } = setOfImages.data[0].images;
    return thumbnail;
  })

}


// SEARCH flavored GET handling
suggestionRouter.get('/search', (req:any, res:any) => {
//  try {
   getTripadvisorLocationIds().then(locations => {
    getTripadvisorDetailedEntries(locations).then((entries) => {

      console.log('after 2nd return')
      console.log('no yo');
    })
    })

   // .then((locations) => {
    // res.status(200).send(locations);
    // console.log("locations");
    //   getTripadvisorDetailedEntries().then((detailedEntries) => {
      //     console.log(detailedEntries);
      // })
      // }).catch((err) => {
      // } catch(err) {
      //     console.error('failed to get suggestions', err);
      //       res.sendStatus(500);

      // }
  // })
})


// GET request handling
suggestionRouter.get('/', async (req: any, res: any) => {

  const allSugg = await prisma.suggestion.findMany().then(()=> {
    res.status(200).send('looks Like we Made it!!!');
  }).catch((err:any) => {
    console.error("FAIL!!", err);
    res.sendStatus(500);
  });
})

export default suggestionRouter;
