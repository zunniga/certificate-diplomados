"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import { ImageDatabase } from "@/Components/ImageUploaderDB";

const imageDB = new ImageDatabase();

interface Certificate {
  id: number;
  ownerName: string;
  type: string;
  certificateDataURL: string;
  certificateUploaded: boolean;
}

type CertificatesList = Certificate[];

const CertificatesTable: React.FC<{ certificates: CertificatesList, title: string }> = ({ certificates, title }) => {
  return (
    <div>
      <h2 className="text-lg mb-2">{title}</h2>
      <table className="rounded-xl table table-xs table-auto table-pin-rows mb-4">
        <thead>
          <tr>
            <th>Nombre del Participante</th>
            <th>Verificado</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate, index) => (
            <tr key={index}>
              <td>{certificate.ownerName}</td>
              <td>
                {certificate.certificateUploaded ? (
                  <span className="text-green-500">&#10004;</span>
                ) : (
                  <span className="text-red-500">&#10008;</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Home() {
  const [digitalCertificates, setDigitalCertificates] = useState<CertificatesList>([]);
  const [physicalCertificates, setPhysicalCertificates] = useState<CertificatesList>([]);
  const [excelFolderPath, setExcelFolderPath] = useState<string | null>(null);

  useEffect(() => {
    // Obtener la ruta del archivo Excel desde sessionStorage
    const storedExcelFilePath = sessionStorage.getItem('excelFilePath');
    if (storedExcelFilePath) {
      // Extraer la carpeta del path
      const folderPath = storedExcelFilePath.substring(0, storedExcelFilePath.lastIndexOf("\\") + 1);
      setExcelFolderPath(folderPath);
      console.log('Ruta de la carpeta del archivo Excel obtenida de sessionStorage:', folderPath);
    }

    const obtenerCertificados = async () => {
      try {
        const certificates: CertificatesList = await imageDB.certificates.toArray();
        
        const digitalCerts = certificates
          .filter((cert) => cert.type === "certificadoDigital")
          .map((cert) => ({ ...cert, certificateUploaded: true }));

        const physicalCerts = certificates
          .filter((cert) => cert.type === "certificadoFisico")
          .map((cert) => ({ ...cert, certificateUploaded: true }));

        setDigitalCertificates(digitalCerts);
        setPhysicalCertificates(physicalCerts);
      } catch (error) {
        console.error("Error al obtener los certificados:", error);
      }
    };

    obtenerCertificados();
  }, []);

  const exportarPDF = () => {
    // Si no se ha seleccionado un archivo Excel, salir de la función
    if (!excelFolderPath) {
      console.error("No se ha seleccionado ningún archivo de Excel.");
      return;
    }

    // Realizar una solicitud HTTP para enviar la ruta de la carpeta al servidor
    fetch('../api/apiPdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ excelFolderPath }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al enviar la ruta de la carpeta al servidor.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Procesar la respuesta del servidor si es necesario
    })
    .catch(error => {
      console.error('Error:', error);
    });

    // Resto de tu lógica para generar los PDFs...
  };

  // Obtener la ruta del archivo Excel del almacenamiento local
  let routeExcel;
  const excelFilePath = sessionStorage.getItem('excelFilePath');
  if (excelFilePath !== null) {
    routeExcel = excelFilePath.replace(/\\/g, '/').replace(/\/[^/]*$/, "");
    console.log(routeExcel);
  } else {
    console.log("La ruta del archivo Excel no está definida en el almacenamiento local.");
    return; // Salir de la función si no se encuentra la ruta del archivo Excel
  }
  console.log("rutaaaaaaaa", routeExcel);

  return (
    <div className="bg-gray-500 h-screen overflow-hidden">
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          <li className="step step-info ">
            <Link href="/cursos/">Inserción de Participantes</Link>
          </li>
          <li className="step step-info">
            <Link href="/cursos/cert_phisyc/">Anverso del Diplomado</Link>
          </li>
          <li className="step step-info">
            <Link href="/cursos/cert_soloemp" passHref>
              Exportar en PDF
            </Link>
          </li>
        </ul>
      </header>
      <div className="bg-gray-500 flex h-full">
        {/* Contenedor Principal */}
        <div className=" flex w-full ">
          {/* Sidebar */}
          <div className="w-1/4 p-4  text-white mt-4 h-full rounded-r-xl">
            <ul>
              <li>
                <button
                  className="w-full btn bg-blue-500 text-white hover:bg-slate-200 mt-2"
                  onClick={exportarPDF}
                >
                  Exportar en PDF
                </button>
              </li>
              <li>
                <div className="join grid grid-cols-2 mt-3 ">
                  <Link href="/cursos/cert_phisyc" passHref legacyBehavior>
                    <button className="join-item bg-slate-200 btn btn-outline text-gray-900">
                      Retroceder
                    </button>
                  </Link>
                  <Link href="/cursos/cert_export" passHref legacyBehavior>
                    <button className="join-item bg-slate-200 text-gray-900 btn">
                      Avanzar
                    </button>
                  </Link>
                </div>
              </li>
              <li></li>
            </ul>
          </div>
          <div className="overflow-x-auto h-96 mt-4 ml-3 rounded-lg">
            <CertificatesTable certificates={digitalCertificates} title="Diplomados(ANVERSO)" />
            <CertificatesTable certificates={physicalCertificates} title="Diplomados(REVERSO)" />
          </div>
        </div>
      </div>
    </div>
  );
}
