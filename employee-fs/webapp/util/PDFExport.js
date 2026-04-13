sap.ui.define([], function () {
    "use strict";

    return {
        exportTableToPDF: function (columns, rows, title) {

            const doc = new jspdf.jsPDF('p', 'pt'); 

            doc.setFontSize(18);
            doc.text(title, 40, 40);

            // Convert UI5 table structures to AutoTable format
            const headers = [columns.map(col => col.label)];

            const data = rows.map(row => 
                columns.map(col => row[col.property])
            );

            doc.autoTable({
                head: headers,
                body: data,
                startY: 70,
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 128, 185] }
            });

            doc.save(title + ".pdf");
        }
    };
});