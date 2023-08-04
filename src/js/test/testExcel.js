/**
 * Función que transforma una tabla HTML para insertarla en excel
 * @param {Object} ws Hoja de trabajo de excel
 * @param {String} name Nombre de la tabla
 * @param {String} ref Celda de inicio de la tabla
 * @param {HTMLElement} HTMLtable Tabla para insertar
 */
function addHtmlTable(ws, name, ref, HTMLtable) {
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

    // Añadir datos a la hoja de trabajo
    ws.addTable({
        name,
        ref,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleDark3',
          showRowStripes: true,
        },
        columns,
        rows
    });
}


(function generarExcel() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Reporte');
    
    addHtmlTable(ws, 'prueba', 'C3', document.querySelector('#tablaExtraccionesReporte'));
    
    // Guardar el archivo
    wb.xlsx.writeBuffer()
    .then((buffer) => {
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    
        saveAs(blob, 'Reporte_SIMAPE.xlsx');
    })
});


