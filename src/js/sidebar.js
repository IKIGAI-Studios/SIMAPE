// DROPDOWN
const dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});


// CAMBIAR CONTENIDO CON LA SIDEBAR
const sidebarItems = document.querySelectorAll('.sidebar-item', '.sidebar-item sub');
const contenidos = document.querySelectorAll('.contenido');

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Oculta todos los contenidos
    contenidos.forEach((contenido) => {
      contenido.classList.remove("activo");
    });

    // Muestra el contenido correspondiente
    contenidos[index].classList.add("activo");
    console.log(index)

    // Quita clase activo a sidebar item
    sidebarItems.forEach((item) => {
      item.classList.remove("activo");
      console.log(index)

    });

    if(item.classList == 'sidebar-item sub'){
      dropdown.classList.toggle('active');
      contenidos[index].classList.add("activo");
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
