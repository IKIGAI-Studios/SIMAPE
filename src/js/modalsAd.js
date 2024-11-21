import Modal from "./componentes/modal.js";

/**
 * Modal Agregar Usuario
 */
export const ModalAgregarUsuario = new Modal(
  document.querySelector('#modalAgregarUsuario'),
  document.querySelector('#modalAgregarUsuarioClose')
);

/**
 * Modal Editar Usuario
 */
export const ModalEditarUsuario = new Modal(
  document.querySelector('#modalEditarUsuario'),
  document.querySelector('#modalEditarUsuarioClose')
);

/**
 * Modal Reporte
 */
export const ModalReporte = new Modal(
  document.querySelector('#modalReporte'),
  document.querySelector('#modalReporteClose')
);

// * Generar eventos para que al dar clic fuera se desactiven
window.onclick = function(event) {
  if (event.target === ModalAgregarUsuario.HTMLmodal || event.target === ModalEditarUsuario.HTMLmodal) {
    ModalAgregarUsuario.disable();
    ModalEditarUsuario.disable();
  }
}
