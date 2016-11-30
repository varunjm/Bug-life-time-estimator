var request = require('request'),
    fs = require('fs'),
    R = require('r-script'),
    config = require('./loadConfig.js').get_config();

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
    return 5;
}

function get_sev(val) {
    var values = ['blocker', 'critical', 'major', 'normal', 'minor', 'trivial', 'enhancement'];

    for(var i = 0; i < values.length; i++) {
        if(val === values[i]) {
            return i+1;
        }
    }
    return 4;
}

function get_dep_count(dep) {
    if(dep === 'None') {
        return 0;
    } else {
        return dep.split(',').length;
    }
}

function predictor(issue) {
    var attr = JSON.parse(issue.body),
        bug_lifetime,
        csv_writer = '',
        flag = false,
        def_values = '';

    if(!attr.hasOwnProperty('priority')) {
        attr.priority = 'P5';
        def_values = def_values + 'Priority - P5';
    }
    if(!attr.hasOwnProperty('severity')) {
        attr.severity = 'normal'
        def_values = def_values + ' Severity - normal ';
    }
    if(!attr.hasOwnProperty('dep_list') || typeof(attr.dep_list) !== typeof('')) {
        attr.dep_list = 'None'
        def_values = def_values + ' Dependency list size - 0';
    }
    if(!attr.hasOwnProperty('os')) {
        attr.os = 'Other'
        def_values = def_values + ' Operating system - Other';
    }
    if(issue.assignees.length === 0) {
        attr.assignees = 1;
        def_values = def_values + ' assignees count - 1';
    } else {
        attr.assignees = issue.assignees.length;
    }

    csv_writer = 'P,S,O,D,A' + '\n' + get_pri(attr.priority) + ', ' + get_sev(attr.severity) + ', ' + get_os(attr.os) + ', ' + get_dep_count(attr.dep_list) + ', ' + attr.assignees + '\n';
    fs.writeFileSync('./data/test.csv', csv_writer, 'utf8');

    bug_lifetime = Math.ceil(R('./lib/predict.R').callSync());
    response = bug_lifetime + ' days ';
    if(def_values !== '') {
        response = response + '(Assuming the following default values: ' + def_values + ')';
    }
    return response;
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
    request(options, function(err, response) {
        if(err) {
            console.log('Comment unsuccessful');
        } else {
            console.log('Comment successful');
        }
    });
}

function post_error(repo, owner, access_token, number, error) {
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
            body: error
        }
    };
    request(options, function(err, response) {
        if(err) {
            console.log('Error report unsuccessful');
        } else {
            console.log('Error report successful');
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
                number = event.issue.number;
                return true;
            }
            return false;
        });

        try {
            life_time_in_days = predictor(event.issue);
            post_life_time(event_repository, owner, config.github_access_token, number, life_time_in_days);
        } catch(e) {
            var error_text = 'Invalid JSON format. Sample format:\n\n{ "priority": "P4", "severity": "critical", "os": "Linux", "dep_list": "#3 , #5 , #7 " }';
            console.log(error_text);
            post_error(event_repository, owner, config.github_access_token, number, error_text);
        }
    }
}

module.exports = {
    process_event: process_event,
    predictor: predictor
}
