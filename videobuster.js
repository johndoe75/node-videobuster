var querystring= require('querystring')
      , cheerio= require('cheerio')
        , utils= require('./lib/utils')
            , _= require('lodash')
         , Curl= require('node-libcurl').Curl,
         iconv = require('iconv');

// This is requied.  Otherwise we don't get a session and can't authenticate.
var useragent= 'Mozilla/5.0 '
    +'(Windows NT 5.1; rv:6.0.2)'
    +'Gecko/20100101 Firefox/6.0.2';

var url= 'https://www.videobuster.de';
var loginurl= url+'/member_login.php';
var activeWishlistUrl= url+'/queue.php?tab=wishlist';
var upcomingWishlistUrl= url+'/queue.php?tab=upcoming'

var Videobuster= function(args, callback) {
  if(!(this instanceof Videobuster)) {
    return new Videobuster(args);
  };

  var self= this;
  defaults= {
     username: null
    ,password: null
    ,cookies: null
  }
  self.opt= utils.merge(defaults, args);
  if(self.opt.username === null || self.opt.password === null) {
    throw new Error('Missing login credentials');
  }
}

/*
 * Authenticate at Videobuster.  Required for fetching the wishlists.
 */
Videobuster.prototype.login= function(callback) {
  var self= this;
  var curl= new Curl();

  curl.setOpt('USERAGENT', useragent);
  // Save cookies to a 'cookies.txt' file.
  curl.setOpt('COOKIEFILE', 'cookies.txt');
  curl.setOpt('COOKIEJAR', 'cookies.txt');
  curl.setOpt('FOLLOWLOCATION', true);
  curl.setOpt(Curl.option.URL, loginurl);
  // curl.setOpt('VERBOSE', true)
  curl.setOpt('POST', true);
  curl.setOpt(Curl.option.POSTFIELDS, querystring.stringify({
      'member_name' : self.opt.username
    , 'member_password': self.opt.password
  }));

  curl
    .on('end', function(status, body, headers) {
      curl.close();
      if(status === 200 || status === 304) {
        err= null;
      }
      else {
        err= 'Login failed';
      }
      callback(err, status)
    })
    .on('error', function(err) {
      curl.close();
      callback('Unable to open connection to '+loginurl, null);
    });


  curl.perform();
}

/*
 * Fetch specified URL from Videobuster and return body on success
 */
Videobuster.prototype.get= function(url, callback) {
  var curl= new Curl();
  curl.setOpt('USERAGENT', useragent);
  // Use the stored cookies.
  curl.setOpt('COOKIEFILE', 'cookies.txt');
  curl.setOpt('COOKIEJAR', 'cookies.txt');
  curl.setOpt('FOLLOWLOCATION', true);
  curl.setOpt(Curl.option.URL, url);
  curl.setOpt('TRANSFER_ENCODING', 'binary');

  curl
    .on('end', function(status, body, headers) {
      curl.close();
      if(status === 200 || status === 304) {
        ic = new iconv.Iconv('ISO-8859-15', 'UTF-8//TRANSLIT//IGNORE');
        html = ic.convert(new Buffer(body, 'binary')).toString('UTF-8');
        err= null; response= html;
      } else {
        err= 'Failed fetching URL ' + url + ' (status '+ status +')';
        response= null;
      }
      callback(err, response);
    })
    .on('error', function(error) {
      curl.close();
      err= 'Unable to open connection to '+ url +' ('+ error +')';
      callback(err, null);
    });

  curl.perform();
}

/*
 * Fetch active wishlist and return as JSON
 */
Videobuster.prototype.getActive= function(callback) {
  var self= this;
  var list= [];
  self.get(activeWishlistUrl, function(err, response) {
    if(err) { callback(err, null); return; }
    var $= cheerio.load(response);
    _.forEach($('table.queue_title_construct'), function(e) {
      var entry= $(e).find($('td.left>a'));
      list.push({
          status: 'active'
        , title: entry.text()
        , link: entry.attr('href')
      });
    });
    callback(null, list);
  });
};

/*
 * Fetch upcoing wishlist and return as JSON
 */

Videobuster.prototype.getUpcoming= function(callback) {
  var self= this;
  var list= [];
  self.get(upcomingWishlistUrl, function(err, response) {
    if(err) { callback(err, null); return; }
    var $= cheerio.load(response);
    _.forEach($('table.queue_title_construct'), function(e) {
      var entry= $(e).find($('td.left>a'));
      list.push({
          status: 'upcoming'
        , title: entry.text()
        , link: entry.attr('href')
      });
    });
    callback(null, list);
  });
};

module.exports= Videobuster;
