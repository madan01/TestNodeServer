var express = require('express');
var url = require('url');
var app = express();

var jsonString = 'customer: {phone: 99999999,name: test_user_%s,email_id: test_%s@test.com,customer_type: repeat}'

app.get('/', function (req, res) {

    res.setHeader('Content-Type', 'application/json');
    res.send("Hello! My Home Page");

});

app.get('/user/:id', function (req, res) {

        res.setHeader('Content-Type', 'application/json');

        var jsonResponse = { customer: { name: "test_user_"+req.params.id,phone: 99999999,email : "test_"+req.params.id+"@test.com",customer_type: "repeat"}}
        res.send(jsonResponse);

});

app.post('/user', function (req, res) {

})


// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

