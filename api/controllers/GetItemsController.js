var lodash = require('lodash'); // Use lodash for chunking the results
var redis = require('redis'); // node_redis module
var rk = require('rk'); // Concats strings together with a ":"
var client = redis.createClient(); // Client object for connection to the Redis server
var keyRoot = 'redishop'; // All keys start with this
var items = rk(keyRoot, 'items', '*');                    // the key `redishop:items:*` (the * will be replaced with the member in sort)
        
module.exports = {
    index: function (req, res) {
        sails.log.info("GET Items Controller");
        client.sort(// SORT command
            rk(keyRoot, 'all-items'), // with the key `redishop:all-items` (a set)
            'BY', items + '->price', // 'BY' then 'redishop:items:*->price' (these are two separate arguments to the client library)
            //'GET', '#', // 'GET' then '#' to get the slug (aka member from the set)
            'GET', items + '->price', // 'GET' then 'redishop:items:*->price' to get the price from the hash
            'GET', items + '->artist',
            'GET', items + '->description',
            'GET', items + '->productImg',
            'GET', items + '->itemType',
            'GET', items + '->name',
            'GET', items + '->manufacturer',
            'GET', items + '->imageUrl',
            'Limit', 0, 100,
            function (err, itemData) { 
                
                var newItem = lodash.chunk(itemData,8);                
                return res.json(newItem);                   
                client.quit();                                        
            }
        );                           
    },
    
    getByItemName: function(req, res){
        sails.log.info("GET Item Controller: GET Item By Name");
        var itemName = req.param('itemName', null);
        sails.log.info("item name: " + itemName);
        var hKey = rk(keyRoot,'items',itemName.trim());
        sails.log.info("hash key is :" + hKey);
        client.hgetall(hKey, function(err, result){
            if (err) {
                sails.log.info("Error is: " + err);
            }
            sails.log.info("getByItem Result: " + result);
            return res.json(result);
            client.quit();
        });
    }
}

