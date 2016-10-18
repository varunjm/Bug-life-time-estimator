var express = require('express');
var router = express.Router();
var bot = {
    examine_issue: function(issue) {
        if(issue.labels.some(function(label) {
            return label.name === 'bug';
        })) {
            console.log('Comment Expected life-time');
            // insert github issue_comment api call, delete the above line
        }
    }
};
/* GET home page. */
router.post('/predict-bug-lifetime', function(req, res, next) {
    if(req.body.hasOwnProperty('issue')) {
        bot.examine_issue(req.body.issue);
    }
    res.status(200);
});

module.exports = router;
