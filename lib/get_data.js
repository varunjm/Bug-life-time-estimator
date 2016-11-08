var request = require('request'),
    fs = require('fs');
    // config = JSON.parse(fs.readFileSync('bug.json', 'utf8'));

function get_bug(bug_id) {
    var options = {
        uri: 'https://bugzilla.mozilla.org/rest/bug/' + bug_id,
        method: 'GET'
    },
    bug_data = {},
    start_time, 
    end_time,
    bug;
    request(options, function(err, response) {
        if(err) {
            console.log(err);
        } else {
            bug = JSON.parse(response.body).bugs[0];
            if ( ["VERIFIED", "CLOSED"].indexOf(bug.status) != -1 ) {
                bug_data.priority = bug.priority;
                bug_data.severity = bug.severity;
                bug_data.dep_count = bug.depends_on.length;
                bug_data.os = bug.op_sys;
                start_time = new Date(bug.creation_time);
                end_time = new Date(bug.cf_last_resolved);                
                bug_data.life_time = Math.abs(end_time - start_time)/86400000;
                bug_data.assignee_count = bug.cc.length + 1;  //+1 for Bug Resolver Assignee
                console.log(bug_data);
                return bug_data;
            }
            else {
                return null;
            }
        }
    });
}

console.log(get_bug(200));