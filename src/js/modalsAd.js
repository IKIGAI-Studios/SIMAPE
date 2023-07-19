import Modal from "./componentes/modal.js";

// * Exportar modals para usarlos en cualquier sitio
export const ModalAgregarUsuario = new Modal(
  document.querySelector('#modalAgregarUsuario'),
  //document.getElementById('btnAgregarUsuario'),
  document.querySelector('#modalAgregarUsuarioClose')
);

export const ModalEditarUsuario = new Modal(
  document.querySelector('#modalEditarUsuario'),
  //document.getElementById('btnEditarUsuario'),
  document.querySelector('#modalEditarUsuarioClose')
);

export const ModalReporte = new Modal(
  document.querySelector('#modalReporte'),
  //document.getElementById('btnEditarUsuario'),
  document.querySelector('#modalReporteClose')
);

// * Generar eventos para que al dar clic fuera se desactiven
window.onclick = function(event) {
  if (event.target === ModalAgregarUsuario.HTMLmodal || event.target === ModalEditarUsuario.HTMLmodal) {
    ModalAgregarUsuario.disable();
    ModalEditarUsuario.disable();
  }
}
