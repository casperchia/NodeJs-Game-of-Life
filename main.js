var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.render('layout', {title: 'The Game of Life!'})
})

var server = app.listen(8081, function () {
  var port = server.address().port
  console.log("Example app listening at localhost:%s", port)
})
