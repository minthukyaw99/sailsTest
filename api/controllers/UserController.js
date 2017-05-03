var redis = require('redis');
var async = require('async'); // handle asynchronous code more intuitively
var rk = require('rk'); // Concats strings together with a ":
var keyRoot = 'coupon';
var client = redis.createClient();

module.exports = {
    
    addUser : function(req, res) {
        var email = req.param('email', '');
        var password = req.param('password', '');
        sails.log.info("Post Params:" + req.allParams());
        return res.json(true);
    }
    
};

