const axios = require('axios');

async function getRankByLocation(state, city, orderBy) {
  try {
    const res = await axios.get(`/getRankByLocation/${state}/${city}/${orderBy}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRankByLocation;