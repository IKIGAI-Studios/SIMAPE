import { ModalReporte } from "./modalsAd.js";


class Reporte {
    constructor(HTMLelement) {
        this.HTMLelement = HTMLelement;
    }

    addTitle(title) {
        this.HTMLelement.innerHTML += `<h2>${title}</h2>`;
    }

    addText(text) {
        this.HTMLelement.innerHTML += `<p>${text}</p>`;
    }

    /**
     * 
     * @param {String} id 
     * @param {Array<String>} columns 
     * @param {Array<Array<String>>} rows 
     */
    addTable(id, columns, rows) {
        this.HTMLelement.innerHTML += `
        <table class="tabla" id="${id}">
            <thead>
                ${
                    columns.map((column) => {
                        return `<th>${column}</th>` 
                    }).join('')
                }
            </thead>
            <tbody>
                ${
                    rows.map((row) => {
                        return `<tr>${
                            row.map((cell) => {
                                return `<td>${cell}</td>` 
                            }).join('')
                        }</tr>` 
                    }).join('')
                }
            </tbody>
        </table>
        `;
    }
}









const btnGenerarReporteExpediente = document.querySelector('#btnGenerarReporteExpediente');
const bodyModalReporte = document.querySelector('#modalReporte div.row');

btnGenerarReporteExpediente.addEventListener('click', async () => {
    ModalReporte.enable();
});



bodyModalReporte.innerHTML = '';

const reporte = new Reporte(bodyModalReporte);

reporte.addTitle('INFORMACIÓN GENERAL');
reporte.addText(`Numero de expediente: ${'11111111111'}`);
reporte.addText(`Nombre: ${'Juan Alberto Mendoza Ruiz'}`);
reporte.addText(`Año: ${'2010'}`);
reporte.addText(`Observaciones: ${'no'}`);
reporte.addText(`Ubicación: ${'Bodega'}`);

reporte.addTitle('ALTA');
reporte.addTable('nose', ['FOLIO', 'FECHA', 'REGISTRADO POR'], [['a', 'b', 'c']]);

reporte.addTitle('BAJA');
reporte.addTable('nose1', ['FOLIO', 'FECHA', 'DADO DE BAJA POR'], [['a', 'b', 'c']]);


