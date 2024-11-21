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
  'HISTORIAL DE MOVIMIENTOS', 
  'CONSULTA DE EXPEDIENTE A PARTIR DE NSS', 
  'CONTROL DE EXPEDIENTE - ALTA', 
  'CONTROL DE EXPEDIENTE - BAJA', 
  'CONTROL DE EXPEDIENTE - TRANSFERENCIA', 
  'CONTROL DE EXPEDIENTE - SUPERVISIONES', 
  'GESTIÓN DE USUARIOS DEL SISTEMA',
  'GENERACIÓN DE REPORTES', 
  'MOVIMIENTOS DE USUARIOS OPERATIVOS',
  
];

const sidebar = new Sidebar(hint, DropdownCtrlExp);
sidebar.createFromNodeList(titulos, sidebarItems, contenidos, hint);