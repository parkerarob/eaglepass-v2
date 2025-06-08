const fs = require('fs');
module.exports = JSON.parse(fs.readFileSync('./.eslintrc.json', 'utf8'));
