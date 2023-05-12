// DROPDOWN
const dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});




// CAMBIAR CONTENIDO CON LA SIDEBAR
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

    // Quita clase activo a sidebar item
    sidebarItems.forEach((item) => {
      item.classList.remove("activo");

    });

    if(item.classList == 'sidebar-item sub'){
      dropdown.classList.toggle('active');
    }
    // Agrega la clase activo solo al elemento que corresponda
    item.classList.add("activo");

  });
});

function mostrarContenido(contenido) {
    contenidos.forEach(function(elemento) {
        elemento.classList.remove('activo');
    });

    sidebarItems.forEach(function(elemento) {
      elemento.classList.remove('activo');
  });
  
    var contenidoActual = document.querySelector('#' + contenido);
    contenidoActual.classList.add('activo');

    
    var itemActual = document.querySelector('#' + sidebar-item);
    itemActual.classList.add('activo');
}
