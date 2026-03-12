/* ════════════════════════════════════════════════════════════════
   TWO-HEADED COMMANDER — download-images.js
   Downloads all banned + watchlist card images from Scryfall
   and saves them to ./images/

   Run with: node download-images.js
   ════════════════════════════════════════════════════════════════ */

var fs   = require('fs');
var path = require('path');
var https = require('https');

// Load card data
var content = fs.readFileSync(path.join(__dirname, 'banned-cards.js'), 'utf8')
  .replace(/const /g, 'var ');
eval(content);

// Collect all unique card names
var seen = {};
var cards = [];
BANNED_CARDS.forEach(function(c) {
  if (!seen[c.name]) { seen[c.name] = true; cards.push(c.name); }
});
WATCHLIST_CARDS.forEach(function(c) {
  if (!seen[c.name]) { seen[c.name] = true; cards.push(c.name); }
});

console.log('Total cards to download: ' + cards.length);

// Create images directory
var imgDir = path.join(__dirname, 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir);

// Sanitize card name → safe filename
function toFilename(name) {
  return name.replace(/[^a-zA-Z0-9\-_' ]/g, '_').replace(/\s+/g, '_') + '.jpg';
}

// Download one image following up to 5 redirects
function downloadImage(url, destPath, redirectsLeft, callback) {
  if (redirectsLeft <= 0) return callback(new Error('Too many redirects'));

  https.get(url, { headers: { 'User-Agent': 'TwoHeadedCommander/1.0 (contact: local)', 'Accept': 'image/jpeg,image/png,image/*,*/*' } }, function(res) {
    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
      res.resume(); // consume response body
      return downloadImage(res.headers.location, destPath, redirectsLeft - 1, callback);
    }
    if (res.statusCode !== 200) {
      res.resume();
      return callback(new Error('HTTP ' + res.statusCode));
    }

    var file = fs.createWriteStream(destPath);
    res.pipe(file);
    file.on('finish', function() { file.close(callback); });
    file.on('error', function(err) {
      fs.unlink(destPath, function() {});
      callback(err);
    });
  }).on('error', callback);
}

// Process cards sequentially with 80ms delay (Scryfall rate limit)
var index = 0;
var ok = 0;
var failed = [];

function next() {
  if (index >= cards.length) {
    console.log('\nDone. ' + ok + ' downloaded, ' + failed.length + ' failed.');
    if (failed.length) {
      console.log('Failed:');
      failed.forEach(function(f) { console.log('  ' + f); });
    }
    return;
  }

  var name = cards[index++];
  var filename = toFilename(name);
  var destPath = path.join(imgDir, filename);

  // Skip if already downloaded
  if (fs.existsSync(destPath)) {
    process.stdout.write('\r[' + index + '/' + cards.length + '] SKIP  ' + name + '                    ');
    ok++;
    return setTimeout(next, 0);
  }

  var url = 'https://api.scryfall.com/cards/named?exact=' + encodeURIComponent(name) + '&format=image&version=normal';

  process.stdout.write('\r[' + index + '/' + cards.length + '] GET   ' + name + '                    ');

  downloadImage(url, destPath, 5, function(err) {
    if (err) {
      failed.push(name + ' (' + err.message + ')');
      process.stdout.write('\r[' + index + '/' + cards.length + '] FAIL  ' + name + ': ' + err.message + '\n');
    } else {
      ok++;
    }
    setTimeout(next, 80);
  });
}

next();
