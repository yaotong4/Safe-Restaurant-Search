const axios = require('axios');

async function getRankBySafetyIndex(state, city) {
  try {
    let url;
    if (state === 'State' && city === 'City') {
      url = `/getSafestRestaurants`;
    } else if (city === 'City') {
      url = `/getSafestRestaurants/${state}`;
    } else {
      url = `/getSafestRestaurants/${state}/${city}`;
    }
    console.log(url);
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRankBySafetyIndex;