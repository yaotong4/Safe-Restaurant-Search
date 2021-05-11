const axios = require('axios');

async function getTips(id) {
  try {
    const res = await axios.get(`/tipsByBusinessId/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getTips;