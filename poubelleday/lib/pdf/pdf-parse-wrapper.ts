// Wrapper for pdf-parse to avoid test file loading issue in production
export async function parsePDF(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  if (typeof window !== 'undefined') {
    // Client-side: return empty result (PDF parsing should only happen server-side)
    return { text: '', numpages: 0 };
  }
  
  try {
    // Dynamic import to avoid loading in client bundle
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      numpages: data.numpages
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}