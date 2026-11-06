const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract raw text from a PDF file path
 * @param {string} filePath - Absolute path to PDF file
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file does not exist at path: ${filePath}`);
  }

  const dataBuffer = fs.readFileSync(filePath);

  try {
    const data = await pdfParse(dataBuffer);
    if (!data || !data.text) {
      return '';
    }
    // Clean up excessive whitespace
    return data.text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').trim();
  } catch (error) {
    console.error('[PDF Parser Error]:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Safely delete a temporary file
 * @param {string} filePath
 */
const deleteFileSafe = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`[File Cleanup] Could not delete file: ${filePath}`, err.message);
    }
  }
};

module.exports = {
  extractTextFromPDF,
  deleteFileSafe,
};
