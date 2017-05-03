var redis = require('redis');
var client = redis.createClient();
var rk = require('rk'); // Concats strings together with a ":
var keyRoot = 'coupon';

module.exports = {

  index : function(req, res) {
    client.on('connect', function(){
          sails.log.info("Connected to redis");
    });
    processLogin(req,res);
  }
};

function processLogin(req, res)
{
    var email = req.param('email', '');
    var password = req.param('password', '');
    
    client.sismember(rk(keyRoot,'all_users'), email, function(err, reply){
      if(err) throw err;
      sails.log.info("checking if member reply:" + reply);
      if (!reply) {
          addNewUser(email, password, res);
      } else {
          logUserIn(email, password, res);
      }
    });
}

function addNewUser(email, password, res)
{
    client.
            multi()
            .hmset(
                rk(keyRoot,'users', email),
                'email', email,
                'password', password
            )
            .sadd(
                rk(keyRoot,'all_users'),
                email
            )
            .exec(function(err){
                if (err) {                   
                    return res.json({'success': 0, 'message' : err});
                } else {
                    return res.json({'success': 1, 'message': 'successfully create'});
                }
            });
}

function logUserIn(email,password, res)
{
    var user = rk(keyRoot,'users', email);
    client.hgetall(user,function(err, result){
      if (err) {
          throw err
      }  
      if (result.password === password) {
          res.json('success');
      } else {
          res.json('fail');
      }
    });
    
}



