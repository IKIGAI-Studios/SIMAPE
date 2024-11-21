import Modal from "./componentes/modal.js";

/**
 * Modal Cambiar Contraseña
 */
export const ModalCambiarPass = new Modal(
  document.querySelector('#modalPass'), 
  document.querySelector('#modalPassClose')
);

/**
 * Modal Ingresar Expediente
 */
export const ModalIngresarExpediente = new Modal(
  document.querySelector('#modalIngresarExpediente'),
  document.querySelector('#modalIngresarExpedienteClose')
);

/**
 * Modal Extraer Expediente
 */
export const ModalExtraerExpediente = new Modal(
  document.querySelector('#modalExtraerExpediente'),
  document.querySelector('#modalExtraerExpedienteClose')
);

/**
 * Modal Prestar Expediente
 */
export const ModalPrestarExpediente = new Modal(
  document.querySelector('#modalPrestarExpediente'),
  document.querySelector('#modalPrestarExpedienteClose')
);


// * Generar eventos para que al dar clic fuera se desactiven
window.addEventListener('click', (e) => {
  if (e.target === ModalCambiarPass.HTMLmodal || e.target === ModalIngresarExpediente.HTMLmodal || e.target === ModalExtraerExpediente.HTMLmodal
    || e.target === ModalPrestarExpediente.HTMLmodal) {
    ModalCambiarPass.disable();
    ModalIngresarExpediente.disable();
    ModalExtraerExpediente.disable();
    ModalPrestarExpediente.disable();
  }
});
