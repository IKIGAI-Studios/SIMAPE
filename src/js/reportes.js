import { ModalReporte } from "./modalsAd.js";

const btnGenerarReporteExpediente = document.querySelector('#btnGenerarReporteExpediente');

btnGenerarReporteExpediente.addEventListener('click', async () => {
    ModalReporte.enable();
});