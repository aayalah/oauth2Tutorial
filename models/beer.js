var mongoose = require('mongoose');
var BeerSchema = mongoose.Schema({
  name: String,
  type: String,
  quantity: Number
})

module.exports = mongoose.model('Beer', BeerSchema);
