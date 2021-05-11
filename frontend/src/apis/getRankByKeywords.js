const axios = require('axios');

async function getRankByKeywords(keywords, orderBy) {
  try {
    const res = await axios.get(`/restaurantReivewKeywordListSearch/${keywords}/${orderBy}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRankByKeywords;