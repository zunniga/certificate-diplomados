import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

interface RequestBody {
  excelFolderPath: string;
}

export async function POST(req: { json: () => Promise<RequestBody> }) {
  try {
    const { excelFolderPath } = await req.json();
    if (!excelFolderPath) {
      throw new Error('La ruta de la carpeta no está definida.');
    }

    // Lógica para generar y guardar los PDFs en la ruta de la carpeta
    try {
      const pdfContent = 'Contenido del PDF...'; // Aquí iría el contenido de tus PDFs
      const pdfFileName = 'documento.pdf'; // Nombre del PDF
      const pdfFilePath = path.join(excelFolderPath, pdfFileName); // Ruta completa del PDF

      // Guardar el PDF en la ruta de la carpeta
      fs.writeFileSync(pdfFilePath, pdfContent);

      // Devolver una respuesta exitosa
      return NextResponse.json(
        { message: 'PDFs guardados exitosamente.' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error al guardar los PDFs:', error);
      // Devolver un error en caso de fallo en el proceso
      return NextResponse.json(
        { error: 'Ocurrió un error al guardar los PDFs.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en el procesamiento de la solicitud:', error);
    // Devolver un error en caso de fallo en el proceso
    return NextResponse.json(
      { error: 'Ocurrió un error en el procesamiento de la solicitud.' },
      { status: 500 }
    );
  }
}
