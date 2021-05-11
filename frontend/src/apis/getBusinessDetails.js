const axios = require('axios');

async function getBusinessDetails(id) {
  try {
    const res = await axios.get(`/getBusinessDetails/${id}`);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getBusinessDetails;