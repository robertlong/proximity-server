var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var hbs = require('hbs');
var app = express();

app.use(express.logger());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

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
  res.render('index');
});

app.get('/beacons/create', function(req, res) {
  res.render('beacons/create');
});

app.listen(process.env.PORT || 3000);