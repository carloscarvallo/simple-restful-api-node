var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var db = require('../../config/db');

var databaseConnect = function( url, callback ) {
  mongo.connect(url, function( err, db ) {
          if (err) throw err
          console.log("Conectado correctamente");
          callback( db );
  });
};

exports.insert = function( articuloName, res ) {
  databaseConnect(db.url, function( db ) {

    var collection = db.collection('articulos');
    collection.insert(articuloName, function( err, data ){
      if (err) res.send(err);
      console.log(JSON.stringify(articuloName));
      db.close();
    })
    res.json({ message: 'Articulo creado!' });

  })
};

exports.findAll = function( res ) {
  databaseConnect(db.url, function( db ) {

    var collection = db.collection('articulos');
    collection.find({}).toArray(function( err, data ){
      if (err) res.send(err);
      res.json(data);
      db.close();
    })

  })
};

exports.findById = function( articuloId, res ) {
  databaseConnect(db.url, function (db) {

    var collection = db.collection('articulos');
    collection.find( { _id: ObjectId( articuloId ) } ).toArray(function(err, data){
      if (err) res.send(err);
      res.json(data);
      db.close();
    })

  })
};

exports.update = function( id, nombre, res ) {
  databaseConnect(db.url, function (db) {

    var collection = db.collection('articulos');
    collection.update( { _id: ObjectId( id ) }, { $set: { title : nombre } },
    function( err ){
      if (err) throw err;
      db.close();
    })
    res.json({ message: 'Articulo actualizado!' });
  })
};

exports.remove = function( id, res ) {
  databaseConnect(db.url, function (db) {

    var collection = db.collection('articulos');
    collection.remove( { _id: ObjectId( id ) }, function( err ){
      if (err) throw err;
      db.close();
    })
    res.json({ message: 'Articulo Borrado!' });
  })
};
