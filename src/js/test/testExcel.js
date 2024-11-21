/**
 * Clase para columnas
 */
class Col {
    /**
     * Función para realizar una operación sobre una columna
     * @param {String} col Columna a operar
     * @param {Function} fn Función para operar 
     * @returns {String} Columna operada
     */
    static operate(col, fn) {
        const res = fn(col.toUpperCase().charCodeAt(col.length - 1));
        
        if (res > 'Z'.charCodeAt(0)) {
            return `A${String.fromCharCode(res - 26)}`;
        }

        if (col.length > 1) {
            return `A${String.fromCharCode(res)}`;
        }

        return String.fromCharCode(res);
    }
}

/**
 * Función que transforma una tabla HTML para insertarla en excel
 * @param {Object} ws Hoja de trabajo de excel
 * @param {String} name Nombre de la tabla
 * @param {String} ref Celda de inicio de la tabla
 * @param {HTMLElement} HTMLtable Tabla para insertar
 * @returns {Object} Objeto con información de la última tabla
 */
function addHtmlTable(ws, col, row, HTMLtable) {

    const HTMLcolumns = HTMLtable.getElementsByTagName('th');
    const HTMLrows = HTMLtable.getElementsByTagName('tr');

    // Obtener un array con el nombre de las filas
    const columns = Array.from(HTMLcolumns).map((th) => {
        return {name: th.innerText};
    });

    // Obtener un array de arrays con los datos de cada celda
    const rows = Array.from(HTMLrows).map((tr, index) => {
        if (index === 0) return;

        const HTMLcell = tr.getElementsByTagName('td');
        
        return Array.from(HTMLcell).map((td) => {
            return td.innerText;
        });
    }).filter(Boolean);

    // Añadir el título
    const titleCell = ws.getCell(`${col}${row}`);
    titleCell.value = HTMLtable.getAttribute('nombre');
    titleCell.font = {
        name: 'Arial',
        size: 14,
        bold: true
    };

    // Combinar celdas
    const endCol = Col.operate(col, (col) => {
        return col + columns.length - 1;
    });

    console.log(`${col}${row}:${endCol}${row}`);
    ws.mergeCells(`${col}${row}:${endCol}${row}`);
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };


    // Añadir datos a la hoja de trabajo
    ws.addTable({
        name: HTMLtable.getAttribute('nombre'),
        ref: `${col}${row+1}`,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleMedium3',
          showRowStripes: true
        },
        columns,
        rows
    });

    return {
        firstCellCol: col,
        firstCellRow: row,
        endCellCol: endCol,
        endCellRow: row
    }
}

/**
 * Función para generar excel a partir del cuerpo de un elemento
 * @param {HTMLElement} body Cuerpo del elemento para generar excel
 * @returns {Promise} Se generó el archivo
 */
export async function generarExcel(body) {
    return new Promise((resolve) => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Reporte');

        // Título y plantilla
        ws.getCell('A1').value = 'SIMAPE v1.0';
        ws.getCell('A2').value = 'REPORTE DE EXPEDIENTE';
        ws.getCell('A2').font = {
            name: 'Arial',
            size: 16,
            bold: true
        };
        ws.getRow(2).height = 30;

        // Añadir datos
        const datos = body.getElementsByTagName('p');
        let ultimoDato = {
            row: 3
        }
        Array.from(datos).forEach((dato) => {
            const cell = ws.getCell(`A${ultimoDato.row++}`);
            cell.value = dato.innerText;
            cell.font = {
                name: 'Calibri',
                size: 11,
            };
            ultimoDato = {
                row: ultimoDato.row++
            }
        });

        // Añadir tablas
        const tablas = body.getElementsByTagName('table');

        let ultimaTabla = {
            endCellCol: 'A',
            endCellRow: ultimoDato.row++
        };

        Array.from(tablas).forEach((tabla) => {
            ultimaTabla = addHtmlTable(
                ws, 
                Col.operate(ultimaTabla.endCellCol, (col) => { return col + 2 }), 
                ultimaTabla.endCellRow, 
                document.querySelector(`#${tabla.id}`)
            );
        });

        // Negritas en títulos
        const titlesRow = ws.getRow(ultimaTabla.endCellRow + 1);

        titlesRow.eachCell((cell, colNumber) => {
            cell.font = {
                name: 'Calibri',
                size: 11,
                bold: true
            };
        });
        
        // const addHtmlTable(ws, 'prueba', 'A', 4, document.querySelector('#tablaAltaReporte'));
        // addHtmlTable(ws, 'prueba2', 'I', 3, document.querySelector('#tablaExtraccionesReporte'));
        
        // Guardar el archivo
        wb.xlsx.writeBuffer()
        .then((buffer) => {
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
        
            saveAs(blob, 'Reporte_SIMAPE.xlsx');
            resolve();
        })
    });
};


