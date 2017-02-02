var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var mongoose = require('mongoose');
var Beer = require('./models/beer');
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/beerdb');

router.get('/', function(req,res) {
  res.json({message: 'You are running dangerously low on beer!'});
})

var beersRoute = router.route('/beers');

beersRoute.post(function(req, res) {
  var beer = new Beer();
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  beer.save(function(err) {
    if (err)
      res.send(err);

      res.json({ message: 'Beer added to the locker!', data: beer });
    });
  });

beersRoute.get(function(req, res) {
  Beer.find(function(err, beers){
    if(err) res.send(err);
    res.json(beers);

  });
});

var beerRoute = router.route('/beers/:beer_id');

beerRoute.get(function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer) {
    if(err) res.send(err);
    res.json(beer);
  });
});

beerRoute.put(function(req, res) {
  // Use the Beer model to find a specific beer
  Beer.findById(req.params.beer_id, function(err, beer) {
    if (err)
      res.send(err);

    // Update the existing beer quantity
    beer.quantity = req.body.quantity;

    // Save the beer and check for errors
    beer.save(function(err) {
      if (err)
        res.send(err);

      res.json(beer);
    });
  });
});

beerRoute.delete(function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  Beer.findByIdAndRemove(req.params.beer_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Beer removed from the locker!' });
  });
});


app.use('/api', router);

app.listen(port, () => console.log('Insert beer on port ' + port));
