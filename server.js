var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./app/models/articles');
var articulo = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next){
  console.log('Algo esta pasando');
  next();
});

router.get('/', function(req, res) {
  res.json({ mensaje: 'bienvenido a mi API!' });
});

router.route('/articulos')

  .post(function(req, res) {
    articulo.nombre = req.body;
    db.insert( articulo.nombre, res );
  })

  .get(function(req, res) {
    db.findAll( res );
  });

router.route('/articulos/:articulo_id')

  .get(function(req, res) {
    articulo.id = req.params.articulo_id;
    db.findById( articulo.id, res );
  })

  .put(function(req, res) {
    articulo.id = req.params.articulo_id;
    articulo.nombre = req.body.title;
    db.update( articulo.id, articulo.nombre, res );
  })

  .delete(function(req, res) {
    articulo.id = req.params.articulo_id;
    db.remove( articulo.id, res );
  });

app.use('/api', router);

app.listen(port);
console.log('La magia occure en el puerto: ' + port);
