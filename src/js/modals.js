import Modal from "./componentes/modal.js";

// * Exportar modals para usarlos en cualquier sitio
export const ModalPass = new Modal(
  document.getElementById('modalPass'), 
  document.getElementById('btnPass'),
  document.getElementById('modalPassClose')
);

export const ModalAgregarUsuario = new Modal(
  document.getElementById('modalAgregarUsuario'),
  document.getElementById('btnAgregarUsuario'),
  document.getElementById('modalAgregarUsuarioClose')
);

// * Generar eventos para que al dar clic fuera se desactiven
window.onclick = function(event) {
  if (event.target === ModalPass.HTMLmodal || event.target === ModalAgregarUsuario.HTMLmodal) {
    ModalPass.disable();
    ModalAgregarUsuario.disable();
  }
}
