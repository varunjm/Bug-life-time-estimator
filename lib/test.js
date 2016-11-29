var predictor = require('./bot.js').predictor;
    issue = {
        body: JSON.stringify({
        }, null, 2),
        assignees: ['a', 'a', 'a', 'a', 'a']
    }
    console.log(predictor(issue));
