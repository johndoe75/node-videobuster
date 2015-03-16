var Videobuster= require('../videobuster.js');

var videobuster= new Videobuster({
  username: '{your username goes here}'
  , password: '{your password goes here}'
});

videobuster.login(function(err, res) {
  console.log(err, res);
  videobuster.getActive(function(err, res) {
    console.log(err, res);
    videobuster.getUpcoming(function(err, res) {
      console.log(err, res);
    });
  });
});
