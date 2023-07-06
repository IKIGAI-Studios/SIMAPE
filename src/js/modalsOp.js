import Modal from "./componentes/modal.js";

// * Exportar modals para usarlos en cualquier sitio
export const ModalCambiarPass = new Modal(
  document.querySelector('#modalPass'), 
  //document.getElementById('btnPass'),
  document.querySelector('#modalPassClose')
);

export const ModalIngresarExpediente = new Modal(
  document.querySelector('#modalIngresarExpediente'),
  //document.getElementById('btnIngresarExpediente'),
  document.querySelector('#modalIngresarExpedienteClose')
);

export const ModalExtraerExpediente = new Modal(
  document.querySelector('#modalExtraerExpediente'),
  //document.getElementById('btnExtraerExpediente'),
  document.querySelector('#modalExtraerExpedienteClose')
);

export const ModalPrestarExpediente = new Modal(
  document.querySelector('#modalPrestarExpediente'),
  //document.getElementById('btnPrestarExpediente'),
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
