import escpos from 'escpos';
import Device from './device.js';
import { TIPO_MOVIMIENTO } from './constants.js';

// * CAMBIAR CON CADA IMPRESORA
const device = new Device(10473, 649);




export async function imprimirTicket({ movimiento, folio, expedientes, nombreExpediente, matricula, nombreUsuario, fecha }) {
    await device.setDevice();

    const printer = new escpos.Printer(device);

    device.open(() => {
        printer
            .encode('cp437')
            .font('a')
            .align('ct')
            .size(2, 2)
            .text('SIMAPE')
            .newLine()
            .size(1, 1)
            .text(movimiento)
            .newLine()
            .newLine()
            .size(0.5, 0.5)
            .text(`------------------------`)
            .style('B')
            .text(`Folio: ${folio}`)
            .text(`Expediente: ${expediente}`)
            .text(`Nombre: ${nombreExpediente}`)
            .text(`------------------------`)
            .text(`Matricula: ${matricula}`)
            .text(`Responsable: ${nombreUsuario}`)
            .text(`Fecha: ${fecha}`)
            .text(`------------------------`)
            .newLine()
            .text('FAVOR DE CONSERVAR ESTE TICKET COMO EVIDENCIA DE SU OPERACION.');
            if (movimiento === TIPO_MOVIMIENTO.NORMAL.EXTRACCION) {
                printer.text(
                    `USTED ES RESPONSABLE DEL EXTRAVIO, MODIFICACION, DAÑO O CUALQUIER USO INDEBIDO DEL EXPEDIENTE MIENTRAS NO SE REGISTRE EL INGRESO.`
                );
            }
        printer
            .cut()
            .close();
    });
}