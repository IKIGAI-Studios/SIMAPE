

const dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});

const sidebarItems = document.querySelectorAll('.sidebar-item');
const contenidos = document.querySelectorAll('.contenido');

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Oculta todos los contenidos
    contenidos.forEach((contenido) => {
      contenido.style.display = 'none';
    });

    // Muestra el contenido correspondiente
    contenidos[index].style.display = 'block';
  });
});

function mostrarContenido(contenido) {
    contenidos.forEach(function(elemento) {
        elemento.classList.remove('activo');
    });
    
    var contenidoActual = document.querySelector('#' + contenido);
    contenidoActual.classList.add('activo');
}
