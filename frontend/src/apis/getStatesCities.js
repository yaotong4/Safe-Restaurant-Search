const axios = require('axios');

async function getStatesCities() {
  try {
    const res = await axios.get('/getStatesCities');
    const data = res.data;
    const states = ["State"];
    const cities = {"State": ["City"]};
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      states.push(obj.state);
      cities[obj.state] = ["City", ...obj.city.split(',')];
    }
    return {states, cities};
  } catch (err) {
    console.log(err);
  }
}

export default getStatesCities;