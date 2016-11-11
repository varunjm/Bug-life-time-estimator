var predictor = require('./bot.js').predictor;
    issue = {
        body: "Priority - P3 Severity - minor OS - Solaris Bug Dependency List - None",
        assignee: ['a', 'a', 'a', 'a', 'a']
    }
    console.log(predictor(issue));
