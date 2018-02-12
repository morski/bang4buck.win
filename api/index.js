var restify = require('restify');
var fs = require('fs');

const alkoObj = JSON.parse(fs.readFileSync('../alkoparser/alko.json', 'utf8'));

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/products/:name', function (req, res, next) {
  var result = alkoObj.filter(x => x.Nimi.search(new RegExp(req.params.name, "i")) != -1);
  res.send(result);
  return next();
});

server.get('/products/alcohol/:percent', function (req, res, next) {
  var result = alkoObj.filter(x => x['Alkoholi-%'].search(new RegExp(req.params.percent, "i")) != -1);
  res.send(result);
  return next();
});

server.get('/products/:name', function (req, res, next) {
  var result = alkoObj.filter(x => x.Nimi.search(new RegExp(req.params.name, "i")) != -1);
  res.send(result);
  return next();
});

server.get('categories', function(req,res,next) {
  const unique = [...new Set(alkoObj.map(item => item.Tyyppi))];
  res.send(unique);
  return next();
});

server.get('b4b', function(req,res,next){
  //let newObj = Object.assign(...alkoObj.entries(obj).map(([k, v]) => ({[k]: v * v})));
  console.log(parseFloat(alkoObj[0].Pullokoko.slice(0, -2).replace(/,/i, '.')));
  console.log(parseInt(alkoObj[0]['Alkoholi-%']));
  console.log(parseInt(alkoObj[0].Hinta))
  var b4b = alkoObj.map(x => { x.b4b= parseFloat(x.Pullokoko.slice(0, -2).replace(/,/i, '.')) * parseFloat(x['Alkoholi-%']) / parseFloat(x.Hinta); return x;});
  b4b.sort(function(a,b) {return (a.b4b > b.b4b) ? 1 : ((b.b4b > a.b4b) ? -1 : 0);} );
  res.send(b4b);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});