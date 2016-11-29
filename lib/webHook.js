var request = require('request'),
    rp = require('request-promise'),
    fs = require('fs'),
    config = require('./loadConfig.js').get_config();

function reset_github_hook(url) {
    config.repositories.map(function (repository) {
        var options = {
            uri: config.github_api_url + '/repos/' + repository.owner + '/' + repository.name + '/hooks',
            method: 'GET',
            headers: {
                "User-Agent": "EnableIssues",
                "content-type": "application/json",
                "Authorization": repository.access_token
            }
        };

        request(options, function(err, response) {
            console.log(response.body);
            if(!err &&  !response.body.includes('Bad credentials')
                && !response.body.includes('Not Found')) {
                var hooks = JSON.parse(response.body),
                    post_obj = {
                        name: 'web',
                        active: true,
                        events: [
                            'issues'
                        ],
                        config: {
                            url: url + config.app_route,
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

                request(options, function(err, res) {
                    if(err) {
                        console.log(err);
                    }
                });
            } else {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Configuration invalid: config.json');
                    process.exit();
                }
            }
        });
    });
}

function get_ngrok_url() {
    var options = {
        uri: config.ngrok_api_url,
        proto: 'http',
        addr: config.app_port
    };

    return rp(options).then(function(response) {
        return JSON.parse(response).tunnels[0].public_url;
    }).catch(function(err) {
        return Promise.reject();
    });
}

function setup_webhook() {
    get_ngrok_url()
        .then(reset_github_hook)
        .catch(function(err){
            console.log('Ngrok proxy url not found');
        });
}

module.exports = {
    setup_webhook: setup_webhook
};
