// modulos de los que depende el proyecto
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
//modulos propios
const {mongoose} = require('./db/mongoose');
const {Producto} = require('./models/producto');
const {Venta} = require('./models/venta');
// servidor http
const app = express();
const server = require('http').Server(app);
//sockets
const io = require('socket.io')(server);

// puerto en el que escuchará el servidor
const PORT = process.env.PORT || 3000;

// configuraciones
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('year', new Date().getFullYear());

// api
app.get('/get-all-products', (req, res) => {
  Producto.find().then((productos) => {
    res.send({productos});
  }).catch((e) => {
    res.status(404).send(e);
  });
});
app.post('/productos', (req, res) => {
  let producto = new Producto({
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precioUnitario: req.body.precioUnitario
  });
  let accion = req.body.accion;
  if(accion === 'guardar'){
    producto.save().then((producto) => {
      res.status(200).render('productos.hbs', {
        message: 'Producto guardado exitosamente'
      })
    })
    .catch((e) => {
      res.status(400).render('productos.hbs', {
        message: 'Error al guardar el producto. Por favor contacte con el administrador del sistema'
      });
    });
  }
  else{
    if(accion === 'eliminar'){
      Producto.findOneAndRemove({codigo: req.body.codigo}).then((producto) => {
          res.status(200).render('productos.hbs', {
            message: 'Producto eliminado'
          });

      }).catch((e) => {
        res.status(400).render('productos.hbs', {
          message: 'Error al eliminar. Por favor contacte al administrador'
        });
      });
    }// fin accion eliminar
    else{
      if(accion === 'actualizar'){
        Producto.findOneAndUpdate(
          {
            codigo: req.body.codigo
          }, {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precioUnitario: req.body.precioUnitario
          }).then((doc) => {
            res.status(200).render('productos.hbs', {
              message: 'Producto actualizado'
            });
          }).catch((err) => {
            res.status(400).render('productos.hbs', {
              message: 'Error al actualizar. Por favor contacte al administrador'
            });
          });
      }
    }
  }
});
app.post('/ventas', (req, res) => {
  let accion = req.body.accion;
  let venta = new Venta({
    numero: req.body.num,
    fecha: req.body.fecha,
    lineasDeVenta: req.body.lineasDeVenta
  });
  switch (accion) {
    case 'guardar':
        venta.save().then((venta) => {
          res.status(200).render('ventas.hbs', {
            message: 'Venta registrada'
          });
        })
        .catch((e) => {
          res.status(400).render('ventas.hbs', {
            message: 'Error al registrar la venta. Contacte con el administrador'
          });
        });
      break;
    // case 'actualizar':
    //   Venta.findOneAndUpdate({numero: venta.numero}).then((venta) => {
    //     res.status(200).render('ventas.hbs', {
    //       message: 'Venta actualizada'
    //     });
    //   })
    //   .catch((e) => {
    //     res.status(400).render('ventas.hbs', {
    //       message: 'Error al actualizar la venta. Contacte con el administrador'
    //     });
    //   });
    // break;
    // case 'eliminar':
    //   Venta.findOneAndRemove({})
    break;
    default:

  }
});
//sockets
io.on('connection', (socket) => {
  // evento obtener productos
  socket.on('obtener-producto', (data) => {
    Producto.findById(data.idProducto).then((producto) =>{
      socket.emit('obtener-producto', producto);
    });
  });
  // evento obtener Ventas
  socket.on('obtener-ventas', (data) => {
    let month = data.month;
    let year = data.year;
    var ventasF = [];
    Venta.find().then((ventas) => {
      for (var i = 0; i < ventas.length; i++) {
        let fecha = new Date(ventas[i].fecha);
        let m = fecha.getUTCMonth();
        let y = fecha.getUTCFullYear();
        if(m == month && y == year){
          ventasF.push({
            venta: ventas[i]
          });
        }
      }// fin del recorrido del array
      return Producto.find();
    }).then((productos) => {
      var totales = [];
      for(var i = 0; i < ventasF.length; i++){
        var subtotal = 0;
        var ldvs = JSON.parse(ventasF[i].venta.lineasDeVenta);
        for(var j = 0; j < ldvs.length; j++){
          for(var k = 0; k < productos.length; k++){
            if(new ObjectID(ldvs[j].idProducto).toString() === productos[k]._id.toString()){
              subtotal += productos[k].precioUnitario * ldvs[j].cantidad;
            }
          }
        }
        totales.push(subtotal);
      }
      socket.emit('obtener-ventas', {ventasF,totales});
    });
  });
});
//páginas para mostrar en el navegador
app.get('/', (req, res) => {
  res.render('home.hbs');
});
app.get('/productos', (req, res) => {
  res.render('productos.hbs');
});
app.get('/ventas', (req, res) => {
  res.render('ventas.hbs');
});
app.get('/registro', (req, res) => {
  res.render('registro.hbs');
});
server.listen(PORT, () => {
  console.log(`Listen on port: ${PORT}`);
});
