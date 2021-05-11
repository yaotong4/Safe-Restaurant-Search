const axios = require('axios');

async function getRankByCategory(category, orderBy) {
  try {
    const res = await axios.get(`/getCategoryRank/${category}/${orderBy}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRankByCategory;