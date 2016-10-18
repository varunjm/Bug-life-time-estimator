var request = require('request'),
    rp = require('request-promise'),
    ngrok_api_url = 'http://127.0.0.1:4040/api/tunnels/',
    github_api_url = 'https://github.ncsu.edu/api/v3',
    github_access_token = 'token ' + process.env.GITHUB_ACCESS_TOKEN,
    localhost = '3000',
    user_id = 'vjayath',
    repo = 'SE-test',
    app_route = '/predict-bug-lifetime';

function reset_github_hook(url) {
    var options = {
        uri: github_api_url + '/repos/' + user_id+ '/' + repo + '/hooks',
        method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": github_access_token
        }
    };
    request(options, function(err, response) {
        if(err) {

        } else {
            var hooks = JSON.parse(response.body),
                post_obj = {
                    name: 'web',
                    active: true,
                    events: [
                        'issues'
                    ],
                    config: {
                        url: url + app_route,
                        content_type: 'json'
                    }
                },
                id = '';

            options.method = 'POST'
            options.json = true;
            options.body = post_obj;

            if(hooks.length !== 0) {
                var hook_exists = hooks.some(function (hook) {
                    if(hook.name === 'web') {
                        id = hook.id;
                        return true;
                    }
                    return false;
                });

                if(hook_exists) {
                    options.uri = options.uri+'/'+id;
                };
            }

            rp(options)
                .catch(function (err) {
                    console.log(err);
                });
        }
    });
}

function get_ngrok_url(addr) {
    var options = {
        uri: ngrok_api_url,
        proto: 'http',
        addr: addr
    };

    return rp(options).then(function(response) {
        return JSON.parse(response).tunnels[0].public_url;
    }).catch(function(err) {
        return Promise.reject();
    });
}

function setup_webhook() {
    get_ngrok_url(localhost)
        .then(reset_github_hook)
        .catch(function(err){
            console.log('Ngrok proxy url not found');
        });
}

module.exports = {
    setup_webhook: setup_webhook
};
