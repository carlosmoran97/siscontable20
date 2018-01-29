axios.get('/get-all-products').then((response) => {
  let array = response.data.productos;
  let length = array.length;
  let html = `<thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio unitario</th>
                </tr>
              <tbody>
            `;
  for (var i = 0; i < length; i++) {
    html += `<tr>
              <td>${array[i].codigo}</td>
              <td>${array[i].nombre}</td>
              <td>${array[i].descripcion}</td>
              <td>${array[i].precioUnitario}</td>
            </tr>
    `;
  }
  html += `</tbody>`;
  document.getElementById('tabla-productos')
  .innerHTML = html;
}).catch((e) => {
  alert('Error al obtener los productos')
});
