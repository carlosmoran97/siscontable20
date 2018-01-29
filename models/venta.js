const mongoose = require('mongoose');

var Venta = mongoose.model('Venta', {
  numero: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },fecha: {
    type: Date,
    required: true
  },
  lineasDeVenta: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});
module.exports = {Venta};
