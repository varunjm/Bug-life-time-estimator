var request = require('request'),
    fs = require('fs'),
    R = require('r-script');
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function isBug(issue) {
    return issue.labels.some(function(label) {
        return label.name === 'bug';
    });
}

function get_os(os_name) {
    var os_list = JSON.parse(fs.readFileSync('./data/os_list.json'));
    if(os_list.hasOwnProperty(os_name)) {
        return os_list[os_name];
    } else {
        return os_list.Other;
    }
}

function get_pri(val) {
    var values = ['P1', 'P2', 'P3', 'P4', 'P5'];

    for(var i = 0; i < values.length; i++) {
        if(val === values[i]) {
            return i+1;
        }
    }
    return 0;
}

function get_sev(val) {
    var values = ['blocker', 'critical', 'major', 'normal', 'minor', 'trivial', 'enhancement'];

    for(var i = 0; i < values.length; i++) {
        if(val === values[i]) {
            return i+1;
        }
    }
    return 0;
}

function get_dep_count(dep) {
    if(dep === 'None') {
        return 0;
    } else {
        return dep.split(',').length + 1;
    }
}
function predictor(issue) {
    var attr = body_parser(issue.body),
        bug_lifetime,
        csv_writer = '';

    if(issue.assignee === null) {
        attr.push(0);
    } else {
        attr.push(issue.assignee.length);
    }

    csv_writer = 'P,S,O,D,A' + '\n' + get_pri(attr[0]) + ', ' + get_sev(attr[1]) + ', ' + get_os(attr[2]) + ', ' + get_dep_count(attr[3]) + ', ' + attr[4] + '\n';
    fs.writeFileSync('./data/test.csv', csv_writer, 'utf8');

    bug_lifetime = R('./lib/predict.R').callSync();
    return bug_lifetime + ' days';
}

function body_parser(body){
	var pi = body.indexOf("Priority"),
        si = body.indexOf("Severity"),
        oi = body.indexOf("OS"),
        bi = body.indexOf("Bug Dependency List"),
        pval,
        sval,
        oval,
        bval;

	if(pi!=-1)
		pval=body.substring(pi+11,si-1);
	if(si!=-1)
		sval=body.substring(si+11,oi-1);
	if(oi!=-1)
		oval=body.substring(oi+5,bi-1);
	if(bi!=-1)
		bval=body.substring(bi+21);
	return [pval,sval,oval,bval];
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
    process_event: process_event,
    predictor: predictor
}
