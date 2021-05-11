const axios = require('axios');

async function getCovidInfo(id) {
  try {
    const res = await axios.get(`/covidInfoByBusinessId/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getCovidInfo;