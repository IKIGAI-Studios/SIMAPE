import Modal from "./componentes/modal.js";

// * Exportar modals para usarlos en cualquier sitio
export const ModalPass = new Modal(
  document.getElementById('modalPass'), 
  document.getElementById('btnPass'),
  document.getElementById('modalPassClose')
);

export const ModalIngresarExpediente = new Modal(
  document.getElementById('modalIngresarExpediente'),
  document.getElementById('btnIngresarExpediente'),
  document.getElementById('modalIngresarExpedienteClose')
);

export const ModalExtraerExpediente = new Modal(
  document.getElementById('modalExtraerExpediente'),
  document.getElementById('btnExtraerExpediente'),
  document.getElementById('modalExtraerExpedienteClose')
);

export const ModalPrestarExpediente = new Modal(
  document.getElementById('modalPrestarExpediente'),
  document.getElementById('btnPrestarExpediente'),
  document.getElementById('modalPrestarExpedienteClose')
);


// * Generar eventos para que al dar clic fuera se desactiven
window.onclick = function(event) {
  if (event.target === ModalPass.HTMLmodal || event.target === ModalIngresarExpediente.HTMLmodal || event.target === ModalExtraerExpediente.HTMLmodal
    || event.target === ModalPrestarExpediente.HTMLmodal) {
    ModalPass.disable();
    ModalIngresarExpediente.disable();
    ModalExtraerExpediente.disable();
    ModalPrestarExpediente.disable();
  }
}
