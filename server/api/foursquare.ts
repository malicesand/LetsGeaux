const axios = require('axios').default;
import dotenv from 'dotenv';

dotenv.config();
const searchId = process.env.FOURSQUARE_API_KEY;


const getSuggestionsFromFoursquare = (queryStack) => {

console.log('ON THE STACK', queryStack)
  const options = {
    method: 'GET',
    url: `https://api.foursquare.com/v3/places/search?ll=29.95465%2C-90.07507&categories=${queryStack}`,
    headers: {
      accept: 'application/json',
      Authorization: searchId,
    },
  };

  return axios(options)
  // .then(res => res.json())
  .then(res => {
    console.log('res data', res.data);
    const entrySet = res.data.results.map((entry) => {
      // still need the contact link to replace the phoneNum.
      const { name, description, link } = entry;
      const { formatted_address } = entry.location;
      const { latitude, longitude } = entry.geocodes.main;

        const returnObj ={
          title: name,
          description,
          link,
          latitude: String(latitude),
          longitude: String(longitude),
          address: formatted_address,
          image: null,
        }
        return returnObj;
    });

    return entrySet;
  })
  .catch(err => {
    console.error(err)
  })
}


  export {getSuggestionsFromFoursquare};
