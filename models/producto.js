var mongoose = require('mongoose');

var Producto = mongoose.model('Producto', {
  codigo: {
    type: Number,
    require: true,
    unique: true,
    dropDrups: true
  },
  nombre: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  precioUnitario: {
    type: Number,
    required: true
  }
});

module.exports = {Producto};
