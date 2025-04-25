const axios = require('axios').default;
// import dotenv from 'dotenv';

// dotenv.config();
// searchId: process.env.FOURSQUARE_API_KEY;


const getSuggestionsFromFoursquare = (queryStack) => {


  const options = {
    method: 'GET',
    url: `https://api.foursquare.com/v3/places/search?categories=${queryStack}`,
    headers: {
      accept: 'application/json',
      Authorization: `fsq3D3XNN4a4DIU+mQ1CP0O9KxGNHYaE0ewrG+RC3Bq5cxY=`,
    },
  };

  return axios(options)
  // .then(res => res.json())
  .then(res => {
    console.log(res.data);
    return res.data;
  })
  .catch(err => {
    console.error(err)
  })
}


  export {getSuggestionsFromFoursquare};
