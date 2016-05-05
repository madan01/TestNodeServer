var express = require('express');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');

var redis = require('redis');
var redis_client = redis.createClient();

var jsonString = 'customer: {phone: 99999999,name: test_user_%s,email_id: test_%s@test.com,customer_type: repeat}';


app.use(bodyParser.json()); // for parsing application/json

// Default root path response
app.get('/', function (req, res) {
  
    res.setHeader('Content-Type', 'application/json');
    res.send("Hello! My Home Page");
  
});

//***********************************************
// Performance Testing
//***********************************************

// Generate Random Response, useful for perf testing
app.get('/user/:id', function (req, res) {
  
    	res.setHeader('Content-Type', 'application/json');
	
	var jsonResponse = { customer: { name: "test_user_"+req.params.id,phone: 99999999,email : "test_"+req.params.id+"@test.com",customer_type: "repeat"}}
        res.send(jsonResponse);	
  
});

// Do Nothing on Post, useful for perf testing
app.post('/user/:id', function (req, res) {
	res.status(201).send();
});

// Do Nothing on Post, useful for perf testing
app.put('/user/:id', function (req, res) {
	res.status(201).send();
});

//***********************************************
// Functional Testing
//***********************************************

// POST - Persist the json request to redis
app.post('/functional/user/:id', function (req, res) {
	var key = Number(req.params.id);
	var post_json = JSON.stringify(req.body);
	console.log(post_json);
	redis_client.set(post_json, function(err, reply) {
    	console.log(reply);
	res.status(201).send();
	});
	
});

// GET - Search for the user in redis and revert
app.get('/functional/user/:id', function (req, res) {
  
    	res.setHeader('Content-Type', 'application/json');
	redis_client.get(Number(req.params.id), function(err, reply) {
    		console.log(reply);
		res.status(200).send(reply);
	});
});



// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

