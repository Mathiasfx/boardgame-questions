import jsPDF from "jspdf";
import { Board } from "../../../interfaces/iboard.model";

// Helper para convertir hex a RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

// Función para descargar PDF de trivia
const downloadTriviaPDF = (board: Board) => {
  const triviaQuestions = board.triviaQuestions || [];
  // Parámetros de la página
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Color primario para los títulos y bordes
  const [r, g, b] = board.colorPrimary
    ? hexToRgb(board.colorPrimary)
    : [83, 91, 242];

  // Título del documento
  doc.setFillColor(r, g, b);
  doc.rect(0, 0, 210, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${board.title} - Preguntas de Trivia`, 105, 12, { align: "center" });

  let yPos = 30;
  const pageHeight = 297;
  const margin = 15;
  const questionSpacing = 10;

  // Imprimir cada pregunta con sus opciones
  triviaQuestions.forEach((question, index) => {
    // Verificar si necesitamos una nueva página
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }

    // Número y texto de la pregunta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(r, g, b);
    doc.text(`Pregunta ${index + 1}:`, margin, yPos);
    yPos += 6;

    // Texto de la pregunta
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const questionLines = doc.splitTextToSize(question.question, 210 - (2 * margin));
    doc.text(questionLines, margin, yPos);
    yPos += questionLines.length * 6 + 5;

    // Opciones
    question.options.forEach((option: string, optIndex: number) => {
      const isCorrect = optIndex === question.correctOptionIndex;
      
      // Círculo para la opción
      if (isCorrect) {
        doc.setDrawColor(0, 150, 0);
        doc.setFillColor(200, 255, 200);
      } else {
        doc.setDrawColor(100, 100, 100);
        doc.setFillColor(240, 240, 240);
      }
      
      doc.circle(margin + 3, yPos - 2, 3, 'FD');
      
      // Texto de la opción
      doc.setFont("helvetica", isCorrect ? "bold" : "normal");
      doc.setTextColor(0, 0, 0);
      const optionLines = doc.splitTextToSize(option, 210 - (2 * margin) - 10);
      doc.text(optionLines, margin + 8, yPos);
      yPos += optionLines.length * 6 + 3;
    });

    // Separador entre preguntas
    yPos += questionSpacing;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos - questionSpacing/2, 210 - margin, yPos - questionSpacing/2);
  });

  // Finalmente, descargar
  doc.save(`${board.title}_trivia.pdf`);
};

export default downloadTriviaPDF;
