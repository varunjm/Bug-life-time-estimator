var request = require('request'),
    fs = require('fs'),
    bug_id_max = 15000,
    result,
    os = {},
    first = true,
    count  = 0,
    bug_id_list = Array.apply(null, {length: bug_id_max}).map(Number.call, Number);

function valid_bug(bug) {
    if(['VERIFIED', 'CLOSED'].indexOf(bug.status) == -1) {
        return false;
    }

    if((bug.hasOwnProperty('priority') && bug.hasOwnProperty('severity') &&
        bug.hasOwnProperty('depends_on') && bug.hasOwnProperty('cc') &&
        bug.hasOwnProperty('cf_last_resolved') && bug.hasOwnProperty('creation_time'))) {
        var bug_fields = [bug.priority, bug.severity, bug.depends_on, bug.creation_time, bug.cf_last_resolved, bug.cc];
        if( bug_fields.indexOf(null) != -1 ) {
            return false;
        }
    } else {
        return false;
    }
    return true;
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

function check_completion() {
    if(count === bug_id_max) {
        fs.writeFileSync('os_list.json', JSON.stringify(os, null, 2), 'utf8');
    }
}

function get_bug(bug_id) {
    var bug_fields = '?include_fields=priority,severity,depends_on,op_sys,creation_time,cf_last_resolved,cc,status',
        options = {
            uri: 'https://bugzilla.mozilla.org/rest/bug/' + bug_id + bug_fields,
            method: 'GET',
            api_key: 'gLdRJXrsBxCrQkhk0q7fS5GpJzvadI0oYZBRFZBd'
        },
        bug_data = {};
    request(options, function(err, response, x) {
        var temp,
            body,
            bug,
            start_time,
            end_time;

        count += 1;
        if(err) {
            // console.log(err);
        } else {
            body = JSON.parse(response.body);
            if ( body.hasOwnProperty('bugs') ) {
                bug = body.bugs[0];
                if( valid_bug(bug) ) {
                    bug_data.id = bug_id;
                    bug_data.priority = bug.priority;
                    bug_data.severity = bug.severity;
                    bug_data.dep_count = bug.depends_on.length;
                    bug_data.os = bug.op_sys;
                    start_time = new Date(bug.creation_time);
                    end_time = new Date(bug.cf_last_resolved);
                    bug_data.life_time = Math.abs(end_time - start_time)/86400000;
                    bug_data.assignee_count = bug.cc.length + 1;  //+1 for Bug Resolver Assignee

                    if(!os[bug.op_sys]) {
                        os[bug.op_sys] = Object.keys(os).length + 1;
                    }
                    bug[bug_id] = bug_data;
                    fs.appendFileSync('data.txt', bug_data.life_time + ', ' + get_pri(bug_data.priority) + ', ' + get_sev(bug_data.severity) + ', ' + os[bug.op_sys] + ', ' + bug_data.dep_count + ', ' + bug_data.assignee_count + '\n');
                    fs.appendFileSync('time.txt', bug_data.life_time + '\n');
                    check_completion();
                }
            }
            else {
                // console.log('Invalid bug id');
            }
        }
    });
}

fs.writeFileSync('data.txt','', 'utf8');
fs.writeFileSync('time.txt','', 'utf8');
bug_id_list.map(get_bug);
