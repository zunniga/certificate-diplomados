"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import { ImageDatabase } from "@/Components/ImageUploaderDB";
import ParticipanteName from "@/Components/CertificateGenerator";
import { GrLinkNext } from "react-icons/gr";
import { GrLinkPrevious } from "react-icons/gr";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FaHand } from "react-icons/fa6";
import { LuCheckCircle } from "react-icons/lu";
import { BsCheckCircleFill } from "react-icons/bs";
import { BsXCircleFill } from "react-icons/bs";

const imageDB = new ImageDatabase();

interface Certificate {
  id: number;
  ownerName: string;
  type: string;
  certificateDataURL: string;
  certificateUploaded: boolean;
}

type CertificatesList = Certificate[];

const CertificatesTable: React.FC<{
  certificates: CertificatesList;
  title: string;
}> = ({ certificates, title }) => {
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
              <BsCheckCircleFill className="text-green-500" size={30} />
            ) : (
              <span>
                {certificate.ownerName} <BsXCircleFill className="text-red-700" size={30} />
              </span>
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
  const [digitalCertificates, setDigitalCertificates] =
    useState<CertificatesList>([]);
  const [physicalCertificates, setPhysicalCertificates] =
    useState<CertificatesList>([]);
  const [excelFolderPath, setExcelFolderPath] = useState<string | null>(null);

  useEffect(() => {
    // Obtener la ruta de la carpeta del archivo Excel desde sessionStorage
    const storedExcelFilePath = sessionStorage.getItem("excelFilePath");
    if (storedExcelFilePath) {
      // Extraer la carpeta del path
      const folderPath = storedExcelFilePath.substring(
        0,
        storedExcelFilePath.lastIndexOf("\\") + 1
      );
      setExcelFolderPath(folderPath);
      console.log(
        "Ruta del archivo Excel obtenida de sessionStorage:",
        folderPath
      );
    }

    const obtenerCertificados = async () => {
      try {
        const certificates: CertificatesList =
          await imageDB.certificates.toArray();

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

    digitalCertificates.concat(physicalCertificates).forEach((certificate) => {
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

        const pdfBase64 = pdf.output("datauristring");

        const requestBody = {
          groupName: ownerName, // Nombre del grupo
          index: 0, // Índice (puedes cambiar según necesites)
          pdfBase64: pdfBase64,
          routeExcel: excelFolderPath,
        };

        // Enviar los datos a la API
        const response = await fetch("../api/apiPdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Error al enviar los datos a la API.");
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

    if (certificates.length === 0) {
      alert("No realizaste ninguna inserción manual");
      return;
    }

    certificates.forEach((certificate, index) => {
      if (index > 0) {
        pdf.addPage(); // Agrega una nueva página para cada certificado, excepto el primero
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

    // Obtener el nombre del primer participante (si hay alguno)
    const primerParticipante = certificates[0].ownerName;
    const fileName = primerParticipante
      ? `Diplomado_${primerParticipante}.pdf`
      : "Diplomado.pdf";

    // Guardar el PDF una vez que se hayan agregado todas las imágenes
    pdf.save(fileName);
  };

  return (
    <div className="bg-[#001d51] h-screen overflow-hidden">
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl font-extralight">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
          <li className="step step-warning font-extralight text-xl ">
            <Link href="/cursos/">Insercion de Participantes </Link>
            <Link href="/cursos/graduate_reverso" passHref legacyBehavior>
              <button className=" bg-[#001d51] text-white btn btn-outline hover:bg-[#178617] hover:text-white mt-4">
                <GrLinkPrevious size={25} />
                Retroceder
              </button>
            </Link>
          </li>
          <li className="step step-warning font-extralight text-xl ">
            <Link href="/cursos/graduate_reverso/">Anverso del Diplomado</Link>
          </li>
          <li className="step step-warning font-extralight text-xl">
            <Link href="/" passHref>
              Exportar en PDF
            </Link>
            <Link href="/cursos/graduate_export" passHref legacyBehavior>
              <button className=" bg-[#001d51] text-white btn btn-outline hover:bg-[#178617] hover:text-white mt-4">
                Avanzar
                <GrLinkNext size={25} />
              </button>
            </Link>
          </li>
        </ul>
      </header>
      <div className="bg-[#001d51] flex h-full">
        {/* Contenedor Principal */}
        <div className=" flex w-full ">
          {/* Sidebar */}
          <div className="w-[400px]  text-white mt-24 ml-5  rounded-r-xl ">
            <ul className="p-4 border border-slate-200 rounded-xl">
              <li>
                <button
                  className="w-full  text-xl font-futura-bkbt btn bg-gradient-to-b from-[#039b03] to-[#06440f] text-[#fff] hover:bg-white mb-5"
                  onClick={exportarPDF}
                >
                  Exportar en PDF (Excel)
                  <RiFileExcel2Fill className="" size={25} color="#" />
                </button>
                <button
                  className="w-full text-xl font-futura-bkbt btn bg-gradient-to-b from-[#006fee] to-[#001d51] text-[#ffff] hover:bg-white mb-5"
                  onClick={exportarPDFManual}
                >
                  Exportar en PDF (Manual)
                  <FaHand size={25} />
                </button>
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg font-futura-bkbt flex items-center justify-center">
                Verifica que todos los participantes estén insertados.
                <LuCheckCircle className="ml-2" size={35} />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#001d51] border rounded-lg p-10 text-white">
                <h2 className="text-2xl font-futura-bkbt mb-6">
                  Diplomados (ANVERSO)
                </h2>
                <CertificatesTable
                  certificates={digitalCertificates}
                  title=""
                  
                />
              </div>
              <div className="bg-[#001d51] border rounded-lg p-10 text-white">
                <h2 className="text-2xl font-futura-bkbt mb-6">
                  Diplomados (REVERSO)
                </h2>
                <CertificatesTable
                  certificates={physicalCertificates}
                  title=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
