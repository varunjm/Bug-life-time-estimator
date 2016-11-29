var config,
    fs = require('fs');

function get_config() {
    try {
        return JSON.parse(fs.readFileSync('./config.json'));
    } catch (e) {
        console.log('Invalid JSON format: config.json');
        process.exit();
    }
}

module.exports = {
    get_config: get_config,
};
