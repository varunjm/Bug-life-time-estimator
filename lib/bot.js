var request = require('request'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function isBug(issue) {
    return issue.labels.some(function(label) {
        return label.name === 'bug';
    });
}

function predictor(issue) {
    // insert bot predictor logic
    return 10;
}

function post_life_time(repo, owner, access_token, number, life_time) {
    var options = {
        uri: config.github_api_url + '/repos/' + owner + '/' + repo + '/issues/' + number + '/comments',
        method: 'POST',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": access_token
        },
        json: true,
        body: {
            body: 'This bug is expected to take ' + life_time + ' days'
        }
    };

    request(options, function(err, response) {
        if(err) {
            console.log('Comment unsuccessful');
        } else {
            console.log('Comment successful');
        }
    });
}

function process_event(event) {
    if(event.hasOwnProperty('issue') && isBug(event.issue) && event.action === 'opened') {
        var event_repository,
            owner,
            number,
            access_token;

        config.repositories.some(function (repository) {
            if(event.repository.owner.login === repository.owner && event.repository.name === repository.name) {
                event_repository = repository.name;
                owner = repository.owner;
                access_token = repository.access_token;
                number = event.issue.number;
                return true;
            }
            return false;
        });

        life_time_in_days = predictor(event.issue);
        post_life_time(event_repository, owner, access_token, number, life_time_in_days);
    }
}

module.exports = {
    process_event: process_event
}
