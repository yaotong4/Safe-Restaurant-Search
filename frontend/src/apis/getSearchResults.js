const axios = require('axios');

// ref: https://gist.github.com/rogerallen/1583593
const stateMap = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'American Samoa': 'AS',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District of Columbia': 'DC',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Guam': 'GU',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Northern Mariana Islands':'MP',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Puerto Rico': 'PR',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virgin Islands': 'VI',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
}

async function getSearchResults(obj) {
  if (obj === null) {
    return [];
  }
  const keyword = (obj.keyword === '' ? 'null': obj.keyword)
  var state = 'null'
  var city = 'null'
  var zipcode = 'null'
  changeAddress: if (obj.near!== ''){
    if (!obj.near.includes(',')){
      break changeAddress;
    }
    else{
      var cityZip = obj.near.split(',')[1].trim();
      if (!cityZip.includes(' ')){
        break changeAddress;
      }
    }
    state = cityZip.split(' ')[0].trim();
    city = obj.near.split(',')[0].trim();
    zipcode = cityZip.split(' ')[1].trim();
  }
  const rating = obj.rating;
  const covidSafe = (obj.covidSafe ? 'true' : 'null');
  let categories = ""
  if (obj.categories.length===0){
    categories = "null";
  }
  else{
    for (let i=0; i<obj.categories.length; i++){
      obj.categories[i] = "'"+obj.categories[i]+"'";
    }
    categories = obj.categories.join(",");
  }

  try {
    const url = `/restaurantGeneralSearch/${keyword}/${state}/${city}/${zipcode}/${rating}/${covidSafe}/${categories}`;
    const res = await axios.get(url);
    const data = res.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].state && data[i].state.length !== 2) {
        if (stateMap.hasOwnProperty(data[i].state)) {
          data[i].state = stateMap[data[i].state];
        }
      }
    }
    return data;
    
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default getSearchResults;