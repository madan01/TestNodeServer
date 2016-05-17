var express = require('express');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');

var redis = require('redis');

//***************************
// Setting Up the Redis Client
//****************************

var listen_port = process.env.NODE_SERVER_PORT;

if(process.env.REDIS_HOST && process.env.REDIS_PORT) { 
     	var redis_client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);
}
else { 
    	var redis_client = redis.createClient();
}

//var sleep = require('sleep');

var jsonString = 'customer: {phone: 99999999,name: test_user_%s,email_id: test_%s@test.com,customer_type: repeat}';


app.use(bodyParser.json()) // for parsing application/json

// Default root path response
app.get('/', function (req, res) {
  
    res.send("Hello! My Home Page");
  
});

//***********************************************
// Performance Testing
//***********************************************

// Generate Random Response, useful for perf testing
app.get('/user/:id', function (req, res) {
  	console.log(req.body)
	console.log(req.headers)
	
    	res.setHeader('Content-Type', 'application/json');
	var jsonResponse = { customer: { name: "test_user_"+req.params.id,phone: 99999999,email : "test_"+req.params.id+"@test.com",customer_type: "repeat"}}
        res.send(jsonResponse);	
  
});


// Do Nothing on Post, useful for perf testing
app.post('/user/:id', function (req, res) {
	console.log(req.body)
	console.log(req.headers)
	res.header("Content-Type", "application/json; charset=utf-8").status(201).send();
});


//***********************************************
// Functional Testing
//***********************************************


// GET - Search for the user in redis and revert
app.get('/user-functional/:id', function (req, res) {
  
    	res.setHeader('Content-Type', 'application/json');
	redis_client.get(Number(req.params.id), function(err, reply) {
    		console.log(reply);
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send(reply);
	});
});

// (PATH containing special characters) POST - Persist the json request to redis
app.post('/user-functional/:id', function (req, res) {
	var key = Number(req.params.id);
	var post_json = JSON.stringify(req.body);
	console.log(post_json);
	redis_client.set(key,post_json, function(err, reply) {
    	console.log(reply);
	console.log(err);
	res.status(201).send();
	});
	
});


// GET - get user for url with query parameters
app.get('/user-params/', function (req, res) {
	res.setHeader('Content-Type', 'application/json');
  	console.log(req.body)
	console.log(req.headers)
	res.status(200).send(req.query);
});



// Generate Random Response, useful for perf testing
app.get('/user-lag/:id', function (req, res) {
  	console.log(req.body)
	console.log(req.headers)
	//sleep.sleep(86400)
    	res.setHeader('Content-Type', 'application/json');
	var jsonResponse = { customer: { name: "test_user_"+req.params.id,phone: 99999999,email : "test_"+req.params.id+"@test.com",customer_type: "repeat"}}
        res.send(jsonResponse);	
  
});

// Generate Random Response, useful for perf testing
app.get('/user-async/:id', function (req, res) {
  	console.log(req.body)
	console.log(req.headers)
    	res.setHeader('Content-Type', 'application/json');
	var jsonResponse = { customer: { name: "test_user_"+req.params.id,phone: 99999999,email : "test_"+req.params.id+"@test.com",customer_type: "repeat"}}
        res.send(jsonResponse);	
  
});

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.listen(listen_port, function () {
  console.log('Example app listening on port: '+listen_port);
});

