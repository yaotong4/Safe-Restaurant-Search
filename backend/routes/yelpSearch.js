const config = require('../config/yelp-config');
const yelp = require('yelp-fusion');
const client = yelp.client(config.API_KEY);

const getBusinessDetails = (req, res) => {
  console.log('Yelp API call');
  const id = req.params.businessId;
  client.business(id).then(response => {
    console.log(response.jsonBody.name);
    res.json({'data': response.jsonBody});
  }).catch(e => {
    console.log(e);
    res.json({Error: 'API call failed.'});
  });
}

module.exports = {
	getBusinessDetails: getBusinessDetails
};