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
    // Obtener la ruta de la carpeta del archivo Excel desde sessionStorage
    const storedExcelFilePath = sessionStorage.getItem('excelFilePath');
    if (storedExcelFilePath) {
      // Extraer la carpeta del path
      const folderPath = storedExcelFilePath.substring(0, storedExcelFilePath.lastIndexOf("\\") + 1);
      setExcelFolderPath(folderPath);
      console.log('Ruta del archivo Excel obtenida de sessionStorage:', folderPath);
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

  const exportarPDF = async () => {
    if (!excelFolderPath) {
      alert("Por favor, primero seleccione un archivo de Excel.");
      return;
    }

    const groupedCertificates: { [key: string]: Certificate[] } = {};

    digitalCertificates.concat(physicalCertificates).forEach(certificate => {
      if (!groupedCertificates[certificate.ownerName]) {
        groupedCertificates[certificate.ownerName] = [];
      }
      groupedCertificates[certificate.ownerName].push(certificate);
    });

    try {
      for (const ownerName in groupedCertificates) {
        const certificates = groupedCertificates[ownerName];
        const pdf = new jsPDF("landscape");

        certificates.forEach((certificate, index) => {
          if (index > 0) {
            pdf.addPage();
          }
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(
            certificate.certificateDataURL,
            "JPEG",
            0,
            0,
            width,
            height,
            "",
            "SLOW"
          );
        });

        const pdfBase64 = pdf.output('datauristring');

        const requestBody = {
          groupName: ownerName, // Nombre del grupo
          index: 0, // Índice (puedes cambiar según necesites)
          pdfBase64: pdfBase64,
          routeExcel: excelFolderPath
        };

        // Enviar los datos a la API
        const response = await fetch("../api/apiPdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Error al enviar los datos a la API.');
        }
      }

      alert("Datos Guardados Correctamente!");
    } catch (error) {
      console.error("Error al enviar los datos a la API:", error);
      alert("Error al enviar los datos.");
    }
  };

  const exportarPDFManual = () => {
    const pdf = new jsPDF("landscape");
    const certificates = digitalCertificates.concat(physicalCertificates);
  
    certificates.forEach((certificate, index) => {
      if (index > 0) {
        pdf.addPage();
      }
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(
        certificate.certificateDataURL,
        "JPEG",
        0,
        0,
        width,
        height,
        "",
        "SLOW"
      );
    });
  
    // Guardar el archivo PDF y abrir la ventana de descarga
    pdf.save("Diplomado.pdf");
  };
  
  return (
    <div className="bg-gray-500 h-screen overflow-hidden">
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          <li className="step step-info ">
            <Link href="/cursos/">Insercion de Participantes</Link>
          </li>
          <li className="step step-info">
            <Link href="/cursos/cert_phisyc/">Anverso del Diplomado</Link>
          </li>
          <li className="step step-info">
            <Link href="/cursos/cert_soloemp" passHref>
              Exportar en PDF
            </Link>
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
                  Exportar en PDF (Excel)
                </button>
                <button
                  className="w-full btn bg-blue-500 text-white hover:bg-slate-200 mt-2"
                  onClick={exportarPDFManual}
                >
                  Exportar en PDF (Manual)
                </button>
              </li>
              <li>
                <div className="join grid grid-cols-2 mt-3 ">
                  <Link href="/cursos/graduate_reverso" passHref legacyBehavior>
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
            <CertificatesTable certificates={physicalCertificates} title="Diplomados(REVERSO" />

          </div>
        </div>
      </div>
    </div>
  );
}
