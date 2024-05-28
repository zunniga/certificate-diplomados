"use client"
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Dexie } from 'dexie';

// Agrega el import de 'useClient' si es necesario

class ParticipantDatabase extends Dexie {
  participants;
  constructor() {
    super("ParticipantDatabase");
    this.version(1).stores({
      participants: "++id, nombreParticipante, codigoParticipante, CursoName, FechaInicio, Modulos, Resolucion, NotaParcial, NotaFinal, Promedio, FechaFin, estadoPago",
    });
    this.participants = this.table("participants");
  }
}

const participantDB = new ParticipantDatabase();
const ReadExcelParticipants = () => {
  const [excelFile, setExcelFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setExcelFile(file);

      // Almacenar la ruta del archivo en sessionStorage
      const filePath = event.target.files[0].path;
      sessionStorage.setItem('excelFilePath', filePath);
      console.log('Ruta del archivo almacenada en sessionStorage:', filePath);
    }
  };

  const generateCertificates = async () => {
    if (!excelFile) {
      console.error("Debes seleccionar un archivo de Excel.");
      return;
    }

    try {
      const bufferArray = await readFileAsArrayBuffer(excelFile);
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      const CursoName = ws['C1'] ? ws['C1'].v : '';
      const FechaInicio = ws['C2'] ? ws['C2'].v : '';
      const FechaFin = ws['C3'] ? ws['C3'].v : '';
      const Modulos = ws['C4'] ? ws['C4'].v : '';
      const ResoDirectoral = ws['C5'] ? ws['C5'].v : '';

      const participantes = [];
      let rowIndex = 13;
      while (ws['B' + rowIndex]) {
        const participantName = ws['B' + rowIndex].v;
        const codigoParticipante = ws['P' + rowIndex].v;
        const NotaParcial = ws['M' + rowIndex].v;
        const NotaFinal = ws['N' + rowIndex].v;
        const Promedio = ws['O' + rowIndex].v;
        const estadoPago = ws['S' + rowIndex] ? ws['S' + rowIndex].v : '';

        const participanteData = {
          nombreParticipante: participantName,
          codigoParticipante: codigoParticipante,
          CursoName: CursoName,
          FechaInicio: FechaInicio,
          FechaFin: FechaFin,
          Modulos: Modulos,
          Resolucion: ResoDirectoral,
          NotaParcial: NotaParcial,
          NotaFinal: NotaFinal,
          Promedio: Promedio,
          estadoPago: estadoPago
        };
        participantes.push(participanteData);
        rowIndex++;
      }
      console.log(participantes);
      await participantDB.participants.clear();
      await participantDB.participants.bulkAdd(participantes);
      alert("Datos del Excel guardados correctamente.");
      window.location.href = '/cursos';
    } catch (error) {
      alert("Error al leer el archivo Excel:", error);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          resolve(fileReader.result);
        } else {
          reject(new Error("Error al leer el archivo."));
        }
      };
      fileReader.onerror = () => {
        reject(new Error("Error al leer el archivo."));
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  // Obtener la ruta del archivo seleccionado y almacenarla en sessionStorage
  useEffect(() => {
    const handleFileChangeForFolder = (event) => {
      if (event.target.files && event.target.files[0]) {
        const filePath = event.target.files[0].path;
        sessionStorage.setItem('excelFilePath', filePath);
        console.log('Ruta del archivo almacenada en sessionStorage:', filePath);
      }
    };

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileChangeForFolder);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener('change', handleFileChangeForFolder);
      }
    };
  }, []);

  return (
    <div>
      <form method="dialog">
        <label className="form-control w-full mb-4">Subir archivo de Excel:
          <input
            id="fileInput"
            className="file-input file-input-bordered w-full"
            type="file"
            accept=".xlsx, .xls, .xlsm"
            onChange={handleFileChange}
          />
        </label>

        <button className="btn" type="button" onClick={generateCertificates}>Agregar datos Excel</button>
      </form>
    </div>
  );
};

export { participantDB };

export default ReadExcelParticipants;
