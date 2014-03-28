var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var Promise = require('bluebird');
var db2 = Promise.promisifyAll(require('../db/config'));

var db = require('../db/config');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  db.UrlModel.find({}, function(err, urls){
    res.send(200, urls);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  db.UrlModel.find({url: uri}, function(err, url){
    if (url.length){
      res.send(200, url[0]);
    } else {
      util.getUrlTitle(uri, function(err, title){
        if (err){
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var shasum = crypto.createHash('sha1').update(uri).digest('hex').slice(0,5);

        var link = new db.UrlModel({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          code : shasum
        });

        link.save(function(err, urls){
          res.send(200, urls);
        });

      });
    }
  });
};

exports.loginUser = function(req, res) {
  db.UserModel.find({ username: req.body.username }, function(err, user) {
    if (user.length === 0) {
      res.redirect('/login');
    } else {
      util.comparePassword(req.body.password, user[0].password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  db.UserModel.find({ username: req.body.username }, function(err, user) {
    if (user.length === 0) {
      var newUser = new db.UserModel({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password)
      });
      newUser.save(function(err, newUser) {
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  db.UrlModel.find({ code: req.params[0] }, function(err, urls) {
    if(urls.length){
      urls[0].visits += 1;
      urls[0].save();
      return res.redirect(urls[0].url);
    } else {
      res.redirect('/');
    }
  });
};
