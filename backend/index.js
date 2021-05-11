const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var exploreSearchRoutes = require("./routes/exploreSearch")
var restaurantProfileRoutes = require("./routes/restaurantProfile");
var restaurantSearchRoutes = require("./routes/restaurantSearch");
const yelpSearchRoutes = require('./routes/yelpSearch');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});

//explore search routes
//get all states and cities
app.get('/getStatesCities', exploreSearchRoutes.getStatesCities);

//get rank of restaurants by state or city, stars or review counts
app.get('/getRankByLocation/:state/:city/:orderBy', exploreSearchRoutes.getRankByLocation);

//get ranked resutls by single category
app.get('/getCategoryRank/:category/:orderBy', exploreSearchRoutes.getCategoryRank);

//get random restaurant
app.get('/getRandRestaurant', exploreSearchRoutes.getRandRestaurant);


// restaurant search routes ------------------------------

// get restaurant by name for restaurant name search
app.get('/restaurantNameSearch/:name', restaurantSearchRoutes.restaurantNameSearch);


// get restaurant without any filter, with only name
app.get('/generalizedSearch/:name', restaurantSearchRoutes.generalizedSearch);


// get restaurant by searching multiple keywords in reviews
app.get('/restaurantReviewSearchAdvanced/:review1/:review2/:review3', restaurantSearchRoutes.restaurantReviewSearchAdvanced);

// get restaurant by searching 1 keyword in reviews
app.get('/restaurantReviewSearch/:name', restaurantSearchRoutes.restaurantReviewSearch);

// get restaurant by searching rating and locations
app.get('/restaurantRatingLocationSearch/:cityName/:reviewCount/:ratingStar', restaurantSearchRoutes.restaurantRatingLocationSearch);


// get recommended restaurant by input a restraunt name
app.get('/restaurantRecommendationSearch/:restaurantId', restaurantSearchRoutes.restaurantRecommendationSearch);

// get restaurant by searching rating and locations
app.get('/getSafestRestaurants/:state?/:city?', restaurantSearchRoutes.getSafestRestaurants);

// get restaurant by searching rating and locations
app.get('/restaurantReivewKeywordListSearch/:keywords/:order', restaurantSearchRoutes.restaurantReivewKeywordListSearch);

// general search
app.get('/restaurantGeneralSearch/:searchWord/:state/:city/:zipcode/:rating/:covidSafe/:categoryList', restaurantSearchRoutes.restaurantGeneralSearch);



// restaurant profile routes ------------------------------

// get restaurant information by business id

// get restaurant reviews by business id
app.get('/reviewsByBusinessId/:businessId', restaurantProfileRoutes.reviewsByBusinessId);

// get restaurant tips by business id
app.get('/tipsByBusinessId/:businessId', restaurantProfileRoutes.tipsByBusinessId);

app.get('/getTop100Categories', restaurantProfileRoutes.getTop100Categories);

// get the top5 safetest states based on covid cases (update to restaurants in those states)
app.get('/getTop5SafetestStates', restaurantProfileRoutes.getTop5SafetestStates);

// get business details from Yelp API
app.get('/getBusinessDetails/:businessId', yelpSearchRoutes.getBusinessDetails);

// get restaurant tips by business id
app.get('/covidInfoByBusinessId/:businessId', restaurantProfileRoutes.covidInfoByBusinessId);



