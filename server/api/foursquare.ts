const axios = require('axios').default;
import dotenv from 'dotenv';

dotenv.config();
const searchId = process.env.FOURSQUARE_API_KEY;


const getSuggestionsFromFoursquare = (queryStack) => {

// console.log('ON THE STACK', queryStack)
  const options = {
    method: 'GET',
    url: `https://api.foursquare.com/v3/places/search?ll=29.95465%2C-90.07507&categories=${queryStack}&fields=fsq_id%2Cname%2Cdescription%2Cwebsite%2Clocation%2Chours%2Cphotos`,
    headers: {
      accept: 'application/json',
      Authorization: searchId,
    },
  };

  return axios(options)
  .then(res => {
    const entrySet = res.data.results.map((entry) => {
      // console.log('ENTRY:', entry)
      // still need the contact link to replace the phoneNum.
      const { fsq_id, name, description, website } = entry;
      const { formatted_address } = entry.location;
      const { display } = entry.hours;
      const tempImage = entry.photos.length ? `${entry.photos[0].prefix}original${entry.photos[0].suffix}` : null
      // NOTE: ADD foursquare id to return object to use as the key for rendering.
      // Reflect this change client-side also
        const returnObj ={
          fsq_id,
          title: name,
          description,
          link: website,
          hours: display,
          address: formatted_address,
          image: tempImage,
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
