const axios = require('axios');

async function getCategories() {
  try {
    const res = await axios.get('/getTop100Categories');
    const data = res.data;
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].single_category.trim();
    }
    return [...new Set(data)];
  } catch (err) {
    console.log(err);
  }
}

export default getCategories;