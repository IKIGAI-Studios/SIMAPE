import Dropdown from "./componentes/dropdown.js";
import Sidebar from "./componentes/sidebar.js";
// DROPDOWN
const DropdownCtrlExp = new Dropdown(document.getElementById('dropdown-expediente'));

// * CAMBIAR CONTENIDO CON LA SIDEBAR

// Items de la sidebar
const sidebarItems = document.querySelectorAll('.sidebar-item');
// Contenido
const contenidos = document.querySelectorAll('.contenido');
// Título
const hint = document.querySelector('.texto-hint');

const titulos = [
  'DATOS DEL USUARIO', 
  'CONSULTA DE EXPEDIENTE A PARTIR DE NSS', 
  'CONTROL DE EXPEDIENTE - ALTA', 
  'CONTROL DE EXPEDIENTE - BAJA', 
  'CONTROL DE EXPEDIENTE - TRANSFERENCIA', 
  'CONTROL DE EXPEDIENTE - SUPERVISIONES', 
  'GESTIÓN DE USUARIOS DEL SISTEMA',
  'GENERACIÓN DE REPORTES', 
  'PETICIONES DE TRANSFERENCIAS DE USUARIOS OPERATIVOS'
];

const sidebar = new Sidebar(hint, DropdownCtrlExp);
sidebar.createFromNodeList(titulos, sidebarItems, contenidos, hint);


// sidebarItems.forEach((item, index) => {
//   item.addEventListener('click', () => {
//     // Oculta todos los contenidos
//     contenidos.forEach((contenido) => {
//       contenido.classList.remove("activo");
//     });

//     // Muestra el contenido correspondiente
//     contenidos[index].classList.add("activo");
//     hint.innerText = titulos[index];
//     console.log(index)

//     // Quita clase activo a sidebar item
//     sidebarItems.forEach((item) => {
//       item.classList.remove("activo");
//       console.log(index)
//     });

    // if(item.classList == 'sidebar-item sub'){
    //   dropdown.classList.toggle('active');
    //   contenidos[index].classList.add("activo");
    // }
//     // Agrega la clase activo solo al elemento que corresponda
//     item.classList.add("activo");

//   });
// });