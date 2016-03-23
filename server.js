var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var db = require('./config/db');
var articulo = {};

var databaseConnect = function( url, callback ) {
  mongo.connect(url, function( err, db ) {
          if (err) throw err
          callback( db );
  });
};

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

    databaseConnect(db.url, function (db) {
      console.log("Conectado correctamente");

      var collection = db.collection('articulos');
      collection.insert(articulo.nombre, function(err, data){
       if (err) res.send(err);
       console.log(JSON.stringify(articulo.nombre));
       db.close();
      })

      res.json({ message: 'Articulo creado!' });
    });

  })

  .get(function(req, res) {

    databaseConnect(db.url, function (db) {
      console.log("Conectado correctamente");

      var collection = db.collection('articulos');
      collection.find({}).toArray(function(err, data){
        if (err) res.send(err);
        res.json(data);
        db.close();
      })

    });

  });

router.route('/articulos/:articulo_id')

  .get(function(req, res) {

    articulo.id = req.params.articulo_id;

    databaseConnect(db.url, function (db) {
      console.log("Conectado correctamente");

      var collection = db.collection('articulos');
      collection.find( { _id: ObjectId( articulo.id ) } ).toArray(function(err, data){
        if (err) res.send(err);
        res.json(data);
        db.close();
      })

    });

  })

  .put(function(req, res) {

    articulo.id = req.params.articulo_id;
    articulo.nombre = req.body.title;

    databaseConnect(db.url, function (db) {
      console.log("Conectado correctamente");

      var collection = db.collection('articulos');
      collection.update( { _id: ObjectId( articulo.id ) }, { $set: { title : articulo.nombre } },
      function( err ){
        if (err) throw err;
        db.close();
      })
      res.json({ message: 'Articulo actualizado!' });
    });

  })

  .delete(function(req, res) {

    articulo.id = req.params.articulo_id;

    databaseConnect(db.url, function (db) {
      console.log("Conectado correctamente");

      var collection = db.collection('articulos');
      collection.remove( { _id: ObjectId( articulo.id ) }, function( err ){
        if (err) throw err;
        db.close();
      })
      res.json({ message: 'Articulo Borrado!' });
    });

  });

app.use('/api', router);

app.listen(port);
console.log('La magia occure en el puerto: ' + port);
