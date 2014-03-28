var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var user = process.env.DBUSER || '';
var pword = process.env.DBPASSWORD || '';
var domain = process.env.DBDOMAIN || '127.0.0.1';
var port = process.env.DBPORT || '';
var database = process.env.DBDATABASE || 'shortlydb';

mongoose.connect('mongodb://'+user + ':' + pword + '@' + domain + ':' + port + '/' + database);

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Url = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

var User = new Schema({
  username: String,
  password: String
});

Url.plugin(timestamps);
User.plugin(timestamps);

exports.UrlModel = mongoose.model('Urls', Url);
exports.UserModel = mongoose.model('Users', User);
