"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import { ImageDatabase } from "@/Components/ImageUploaderDB";

const imageDB = new ImageDatabase(); // Asegúrate de crear la instancia de la base de datos

// Define la interfaz para el objeto de certificado
interface Certificate {
  id: number;
  ownerName: string;
  type: string;
  certificateDataURL: string;
}

// Define el tipo para la lista de certificados
type CertificatesList = Certificate[];

const CertificatesTable: React.FC<{ certificates: CertificatesList }> = ({
  certificates,
}) => {
  return (
    <table className="rounded-xl table table-xs table-auto table-pin-rows">
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" className="checkbox" />
            </label>
          </th>
          <th>Nombre del Participante</th>
        </tr>
      </thead>
      <tbody>
        {certificates.map((certificate, index) => (
          <tr key={index}>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>{certificate.ownerName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Home() {
  const [digitalCertificates, setDigitalCertificates] =
    useState<CertificatesList>([]);
  const [physicalCertificates, setPhysicalCertificates] =
    useState<CertificatesList>([]);
  const [companyCertificates, setCompanyCertificates] =
    useState<CertificatesList>([]);

  useEffect(() => {
    const obtenerCertificados = async () => {
      try {
        const certificates: CertificatesList =
          await imageDB.certificates.toArray();
        // Filtrar certificados por tipo
        const digitalCerts = certificates.filter(
          (cert) => cert.type === "certificadoDigital"
        );
        const physicalCerts = certificates.filter(
          (cert) => cert.type === "certificadoFisico"
        );
        const companyCerts = certificates.filter(
          (cert) => cert.type === "certificadoOnly"
        );
        setDigitalCertificates(digitalCerts);
        setPhysicalCertificates(physicalCerts);
        setCompanyCertificates(companyCerts);
      } catch (error) {
        console.error("Error al obtener los certificados:", error);
      }
    };

    obtenerCertificados();
  }, []);

  const exportarPDF = () => {
    const allCertificates: Certificate[] = [
      ...digitalCertificates,
      ...physicalCertificates,
      ...companyCertificates,
    ];

    allCertificates.forEach((certificate, index) => {
      const pdf = new jsPDF("landscape"); // Establece el formato horizontal del PDF
      const width = pdf.internal.pageSize.getWidth(); // Obtiene el ancho de la página
      const height = pdf.internal.pageSize.getHeight(); // Obtiene la altura de la página
      pdf.addImage(
        certificate.certificateDataURL,
        "JPEG",
        0,
        0,
        width,
        height,
        "",
        "SLOW"
      ); // Agrega la imagen al tamaño de la página con calidad rápida
      pdf.save(
        `certificado_${certificate.ownerName}_${certificate.type}_${
          index + 1
        }.pdf`
      ); // Guarda el PDF con un nombre único basado en el nombre del participante, su tipo y el índice
    });
  };

  return (
    <div className="bg-gray-500 h-screen overflow-hidden">
      {/* Encabezado fijo */}
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
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
        </ul>
      </header>
      {/* Sidebar */}
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
                  <Link href="/" passHref legacyBehavior>
                    <button className="join-item bg-slate-200 text-gray-900 btn">
                      Avanzar
                    </button>
                  </Link>
                </div>
              </li>
              <li></li>
            </ul>
          </div>
          <div className="overflow-x-auto h-96 mt-4 ml-3 rounded-lg ">
            {/* Tabla para Certificados Digitales */}
            <h2 className="text-lg ">Diplomados - Anverso </h2>
            <CertificatesTable certificates={digitalCertificates} />
          </div>
          <div className="overflow-x-auto h-96 mt-4 ml-3 rounded-lg ">
            {/* Tabla para Certificados Físicos */}
            <h2 className="text-lg ">Diplomados - Reverso</h2>
            <CertificatesTable certificates={physicalCertificates} />
          </div>
        </div>
      </div>
    </div>
  );
}
