var request = require('request'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function isBug(issue) {
    return issue.labels.some(function(label) {
        return label.name === 'bug';
    });
}

function predictor(issue) {
    console.log('test');
    if(body_parser(issue.body)){
         return '10 days';
    }
    // insert bot predictor logic
    return '10 days (by taking default values for missing data)';
}
function body_parser(body){
	pi=body.indexOf("Priority");
	si=body.indexOf("Severity");
	oi=body.indexOf("OS");
	bi=body.indexOf("Bug Dependency List");
	newi=body.indexOf("\n");
	if(pi==-1 || si==-1 || oi==-1 || bi==-1){
		return false; 
	}
	console.log(pi+" : "+si+" : "+oi+" : "+newi);
	//var attr=[body.substring(pi+11,si-1) , body.substring(si+11,oi-1) , body.substring(oi+5,bi-1) , body.substring(bi+21)];
	return true;
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
            body: 'This bug is expected to take ' + life_time
        }
    };
	console.log(options)
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
