
require('dotenv').config();
var myAPI = process.env.MONGOAPI
const mongoose = require('mongoose');
mongoose.connect(''+myAPI, 
{useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We are connected");
});