var lineasDeVenta = [];
var agregarLineaDeVenta = () =>{
  let idProducto = document.getElementById('lista-productos').value;
  let labelTotal = document.getElementById('total');
  let socket = io.connect('/');
  let totalDolar = labelTotal.innerHTML;
  let total = parseFloat(totalDolar.replace('$',''));
  let totalDeLinea = 0;
  let precioProducto = new Intl.NumberFormat("en-US",
                          {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 2,
                            maximunFractionDigits: 2
                          });
  socket.emit('obtener-producto', {idProducto});
  socket.on('obtener-producto', (data) => {
    let cantidad = document.getElementById('cantidad').value;
    let tabla = document.getElementById('tablaDeLineasDeVenta');
    let html = tabla.innerHTML;
    let ldv = {
      cantidad,
      idProducto
    };
    lineasDeVenta.push( ldv );
    totalDeLinea = cantidad * data.precioUnitario;
    html += `<tr>
              <td>${cantidad}</td>
              <td>${data.nombre}</td>
              <td>${precioProducto.format(data.precioUnitario)}</td>
              <td>${precioProducto.format(totalDeLinea)}</td>
             </tr>
    `;
    tabla.innerHTML = html;
    total += totalDeLinea;
    labelTotal.innerHTML = precioProducto.format(total);
    document.getElementById('lineasDeVenta').value = JSON.stringify(lineasDeVenta, undefined, 2);
  });
};

var limpiarFormulario = () => {

};
