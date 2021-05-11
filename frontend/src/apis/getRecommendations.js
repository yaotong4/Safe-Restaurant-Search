const axios = require('axios');

async function getRecommendations(id) {
  try {
    const res = await axios.get(`/restaurantRecommendationSearch/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRecommendations;