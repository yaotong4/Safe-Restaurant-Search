const axios = require('axios');

async function getRandRestaurant(id) {
  try {
    const res = await axios.get('/getRandRestaurant');
    return res.data[0];
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getRandRestaurant;