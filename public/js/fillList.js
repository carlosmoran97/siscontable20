axios.get('/get-all-products').then((response) => {
  let array = response.data.productos;
  let length = array.length;
  let lista = document.getElementById('lista-productos');
  lista.length = length;
  for (var i = 0; i < array.length; i++) {
    lista.options[i] = new Option(array[i].nombre, array[i]._id);
  }
}).catch((e) => {
  alert('Error al obtener los productos')
});
