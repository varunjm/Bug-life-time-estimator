var express = require('express'),
    router = express.Router(),
    bot = require('../lib/bot.js');

/* GET home page. */
router.post('/predict-bug-lifetime', function(req, res, next) {
    bot.process_event(req.body);
    res.status(200);
});

module.exports = router;
