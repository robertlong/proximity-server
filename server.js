var express = require('express');
var mongoose = require('mongoose');
var app = express();

app.use(express.logger());

mongoose.connect(process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL || "mongodb://localhost:27017/proximity");

var Trigger = mongoose.model('trigger', {
  uuid: 'string'
});



app.get('/api/triggers/:uuid', function(req, res){
  if (req.param("uuid")) {
    Trigger.findOne({ uuid: req.param("uuid")}, function(err, trigger) {
      if (err) {

        res.send(500, {status: 500, message: err.message});
      } else {

        if(trigger === null) {
          res.send(404, {status: 404, message: "Trigger not found"});
        } else {
          res.send(trigger);
        }

      }
    });
  } else {
    res.send(500, {status: 500, message: "Invalid UUID"});
  }

});

app.get('/', function(req, res) {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000);