console.log('app.js cargado');

// Si estamos en la página de selección (index.html)
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
  // Escuchar eventos en los botones de sucursal
  const branchButtons = document.querySelectorAll('.branch-btn');
  branchButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Se toma el texto del botón, que puede ser "Sucursal principal", "Sucursal Itaembé" o "B2B"
      const sucursal = button.textContent.trim();
      localStorage.setItem('sucursalSeleccionada', sucursal);
    });
  });

  // Evento para seleccionar un vendedor
  const botonesVendedor = document.querySelectorAll('.vendedor-btn');
  botonesVendedor.forEach(boton => {
    boton.addEventListener('click', () => {
      const vendedorId = boton.getAttribute('data-id');
      localStorage.setItem('vendedorSeleccionado', vendedorId); // Guardar vendedor en localStorage
      window.open('./calificar.html', '_blank'); // Abrir en una nueva ventana
    });
  });
}

// Si estamos en la página de calificación (calificar.html)
if (window.location.pathname.includes('./calificar.html')) {
  const ratingButtons = document.querySelectorAll('.rating-btn');
  const vendedorDisplay = document.getElementById('vendedor-display');
  const vendedorSeleccionado = localStorage.getItem('vendedorSeleccionado');
  const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada') || 'Sucursal No Seleccionada';

  // Mostrar el nombre del vendedor y la sucursal seleccionados
  if (vendedorSeleccionado) {
    vendedorDisplay.textContent = `Vendedor: ${vendedorSeleccionado} | Sucursal: ${sucursalSeleccionada}`;
  } else {
    vendedorDisplay.textContent = 'Error: No se seleccionó ningún vendedor.';
  }
}