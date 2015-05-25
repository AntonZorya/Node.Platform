var mongoose   = require('mongoose');
mongoose.connect('mongodb://192.168.66.27/toxakz'); 

require('./cronScripts/privetCronJob');

