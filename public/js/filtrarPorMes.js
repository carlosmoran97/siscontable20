var filtrarPorMes = () => {
  let socket = io.connect('/');
  let month = document.getElementById('month').value;
  let year = document.getElementById('year').value;
  socket.emit('obtener-ventas', {
    month,
    year
  });
  socket.on('obtener-ventas', (data) => {
    let tabla = document.getElementById('tabla-ventas');
    tabla.innerHTML = `<thead>
    <tr>
      <td>No.de factura</td>
      <td>Fecha</td>
      <td>Total</td>
    </tr>
  </thead>`;
    let html = tabla.innerHTML;
    for(var i = 0; i < data.ventasF.length; i++){
      html += `<tr>
                <td>${data.ventasF[i].venta.numero}</td>
                <td>${data.ventasF[i].venta.fecha}</td>
                <td>${data.totales[i]}</td>        
      `;
    }
    tabla.innerHTML = html;
  });
};