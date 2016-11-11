var fs = require('fs'),
    input = JSON.parse(fs.readFileSync('data_old.txt')).data,
    matrix = [];

for(var i = 0; i < input.length; i++) {
    row = input[i];
    if(row[0] > 0.5) {
        fs.appendFileSync('./other/time.txt', row[0] + '\n', 'utf8');
        fs.appendFileSync('./other/data.txt', row[1] + ', ' + row[2] + ', ' + row[3] + ', ' + row[4] + ', ' + row[5] + '\n' , 'utf8');
    }
}
