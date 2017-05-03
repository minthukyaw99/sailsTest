var redis = require('redis');
var async = require('async'); // handle asynchronous code more intuitively
var rk = require('rk'); // Concats strings together with a ":"
var items = require('../../items.json');
var keyRoot = 'redishop';
var client = redis.createClient();

module.exports = {
    index: function () {

        async.each(items, function (anItem, cb) {                     // Run the function for each item in the array
            sails.log.info("item slug : " + anItem.slug);                                 // Log the slug

            client                                                    // refer to the client object which represents a single connection
                    .multi()                                                // start a MULTI/EXEC block
                    .hmset(// HMSET to set multiple fields/values in one command call
                            rk(keyRoot, 'items', anItem.slug), // first argument is the key "redishop:items:[slug]"

                            'artist', // field
                            anItem.imageCredit.artist, // value

                            'name',
                            anItem.name,
                            'description',
                            anItem.description,
                            'manufacturer',
                            anItem.manufacturer,
                            'itemType',
                            anItem.itemType,
                            'productImg',
                            anItem.productImg,
                            'price',
                            anItem.price,
                            'imageUrl',
                            anItem.imageUrl
                            )
                    .sadd(// add to a set 
                            rk(keyRoot, 'all-items'), // at the key "redishop:all-items"
                            anItem.slug                                           // with the slug as the value
                            )
                    .zadd(// add to a sorted set
                            rk(keyRoot, 'priceIndex'), // at the key "redishop:priceIndex"
                            anItem.price, // the price is used as the score
                            anItem.slug                                           // with the slug as a member
                            )

                    .exec(function (err) {                                   // Run the queued commands
                        cb(err);                                              // Execute the callback function with just the error (which may or may not be null)
                    });
        }, function (err) {
            if (err) {
                throw err;
            }                                   // Throw an error if anything failed
            sails.log.info('Items added.');
            client.quit();                                            // Properly quit the client connection
        });
    }
};

