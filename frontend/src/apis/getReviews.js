const axios = require('axios');

async function getReviews(id) {
  try {
    const res = await axios.get(`/reviewsByBusinessId/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getReviews;