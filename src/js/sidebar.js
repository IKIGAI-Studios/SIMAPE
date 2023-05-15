// DROPDOWN
const dropdown = document.querySelector('.dropdown');

dropdown.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});


// CAMBIAR CONTENIDO CON LA SIDEBAR

// Items de la sidebar
const sidebarItems = document.querySelectorAll('.sidebar-item', '.sidebar-item sub');
// Contenido
const contenidos = document.querySelectorAll('.contenido');
// Título
const hint = document.querySelector('.texto-hint');

const titulos = ['DATOS DEL USUARIO', 'CONSULTA DE EXPEDIENTE A PARTIR DE NSS', 'CONTROL DE EXPEDIENTE - ALTA', 
'CONTROL DE EXPEDIENTE - BAJA', 'CONTROL DE EXPEDIENTE - TRANSFERENCIA', 'GESTIÓN DE USUARIOS DEL SISTEMA',
'GENERACIÓN DE REPORTES', 'PETICIONES DE TRANSFERENCIAS DE USUARIOS OPERATIVOS'];

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // Oculta todos los contenidos
    contenidos.forEach((contenido) => {
      contenido.classList.remove("activo");
    });

    // Muestra el contenido correspondiente
    contenidos[index].classList.add("activo");
    hint.innerText = titulos[index];
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
