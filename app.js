var http = require('http');
var fs = require('fs');
var db = require('./data/db.json');
var router = require('./data/routes.json');
var port = 13689;
var mdns;

try {
  var mdns = require('mdns');
} catch (e) {
  console.log('not found mdns: npm install mdns');
  process.exit(1);
}

http.createServer(function (req, res) {
  res.setTimeout(0);

  for (var k in router) {
    if (req.url.indexOf(k) === 0) {
        fs.readFile(router[k], function(e, d) {
              res.writeHead(200, {
                'DAAP-Server': 'daap/1.0',
                'Content-Encoding': 'gzip',
                'Content-Type': 'application/x-dmap-tagged',
                'Content-Length': d.length
              });
            res.end(d);
        });
        return;
    }
  }

  var item = req.url.match(/\/items\/(\d+)(.)/);
  if (item && db[item[1]]) {
    var url = db[item[1]].au;
    if(item[2] == '.') url = db[item[1]].mu;
    res.writeHead(303, {'Location': url});
    return res.end();
  }
}).listen(port);

mdns.createAdvertisement(mdns.tcp('daap'), port, {name: "netease"}).start();
console.log('Server running at port ' + port + ', check your itunes shared library');
