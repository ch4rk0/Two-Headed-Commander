var fs = require('fs');
var content = fs.readFileSync('C:/Users/Admin/Desktop/files/banned-cards.js', 'utf8');
// Find all name+cat pairs
var lines = content.split('\n');
lines.forEach(function(line, i) {
  var nameMatch = line.match(/name:\s*"([^"]+)"/);
  var catMatch = line.match(/cat:\s*"([^"]+)"/);
  if (nameMatch && catMatch) {
    console.log((catMatch[1]).padEnd(15) + ' | ' + nameMatch[1]);
  }
});
