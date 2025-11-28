import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

// --- EXPORTAR PARA EXCEL ---
export const exportToExcel = (data, fileName = 'relatorio') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
  saveAs(dataBlob, `${fileName}_${dayjs().format('YYYY-MM-DD')}.xlsx`);
};

// --- EXPORTAR PARA PDF ---
export const exportToPDF = (title, columns, data, fileName = 'relatorio') => {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Gerado em: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 14, 30);
  doc.text('Fleet Vision System', 14, 36);

  // Tabela
  doc.autoTable({
    startY: 44,
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.field])),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 229, 255] }, // Cor Primária (#00e5ff)
  });

  doc.save(`${fileName}_${dayjs().format('YYYY-MM-DD')}.pdf`);
};