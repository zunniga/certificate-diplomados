"use client";
import React, { useRef, useState, useEffect } from "react";
import ReadExcelParticipants from "@/Components/ReadExcelParticipants";
import CertificateGeneratorExcel from "@/Components/CertificateGeneratorExcel";
import CertificateGenerator from "@/Components/CertificateGenerator";
import Link from "next/link";
import { IoCloseCircle } from "react-icons/io5";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { ImageDatabase } from "@/Components/ImageUploaderDB";
import { ImageMagnifier } from "@/Components/imgMagnifier";

const imageDB = new ImageDatabase(); // Asegúrate de crear la instancia de la base de datos

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalRef = useRef<HTMLDialogElement>(null);
  const excelModalRef = useRef<HTMLDialogElement>(null);
  const [generatedCertificates, setGeneratedCertificates] = useState<string[]>(
    []
  );

  useEffect(() => {
    const obtenerCertificados = async () => {
      try {
        const certificates = await imageDB.certificates
          .where("type")
          .equals("certificadoDigital")
          .toArray();
        setGeneratedCertificates(
          certificates.map((certificate) => certificate.certificateDataURL)
        );
      } catch (error) {
        console.error("Error al obtener los certificados:", error);
      }
    };

    obtenerCertificados();
  }, []);
  // Función para abrir o cerrar la lista
  const [listaAbierta, setListaAbierta] = useState(false);

  // Función para abrir o cerrar la lista
  const toggleLista = () => {
    setListaAbierta(!listaAbierta);
  };

  const openModulares = () => {
    // Aquí puedes realizar las acciones necesarias al abrir el modal
    console.log("Abrir modal de Excel");
  };

  const actualizarCertificados = async () => {
    try {
      const certificates = await imageDB.certificates
        .where("type")
        .equals("certificadoDigital")
        .toArray();
      setGeneratedCertificates(
        certificates.map((certificate) => certificate.certificateDataURL)
      );
    } catch (error) {
      console.error("Error al obtener los certificados:", error);
    }
  };

  const updateButton = async () => {
    try {
      setGeneratedCertificates([]);
    } catch (error) {
      console.error("Error al limpiar las tablas:", error);
    }
  };

  const eliminarImagen = async () => {
    try {
      const certificateDataURL = generatedCertificates[currentImageIndex];
      const imageToDelete = await imageDB.certificates
        .where("certificateDataURL")
        .equals(certificateDataURL)
        .first();
      console.log(imageToDelete);
      if (imageToDelete) {
        await imageDB.certificates.delete(imageToDelete.id);
        await actualizarCertificados();
        goPrevious(); // Llamamos directamente a goPrevious después de eliminar la imagen
      } else {
        console.warn("La imagen no existe en la base de datos.");
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const goPrevious = () => {
    const lastIndex = generatedCertificates.length - 1;
    setCurrentImageIndex(
      currentImageIndex === 0 ? lastIndex : currentImageIndex - 1
    );
  };

  const goNext = () => {
    const lastIndex = generatedCertificates.length - 1;
    setCurrentImageIndex(
      currentImageIndex === lastIndex ? 0 : currentImageIndex + 1
    );
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const openExcelModal = () => {
    if (excelModalRef.current) {
      excelModalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  const closeExcelModal = () => {
    if (excelModalRef.current) {
      excelModalRef.current.close();
    }
  };

  return (
    <div className="bg-cyan-500 h-screen overflow-hidden">
      {/* Encabezado fijo */}
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
          <li className="step step-info ">
            <Link href="/cursos/">Insercion de Participantes</Link>
          </li>
          <li className="step">
            <Link href="/cursos/cert_phisyc/">Anverso del Diplomado</Link>
          </li>
          <li className="step">
            <Link href="/" passHref>
              Exportar en PDF
            </Link>
          </li>
        </ul>
      </header>
      {/* Sidebar */}
      <div className="bg-cyan-500 flex h-full">
        {/* Contenedor Principal */}
        <div className=" flex w-full ">
          {/* Sidebar */}
          <div className="w-1/3 p-4 bg-cyan-500 text-white mt-4 h-full rounded-r-xl">
            <ul>
              <li>
                <button
                  className="w-full btn bg-sky-700 text-white hover:bg-gray-200"
                  onClick={openModal}
                >
                  Agregar manualmente
                </button>
              </li>
              <li>
                <button
                  className="w-full btn  bg-sky-700 text-white hover:bg-gray-200 mt-2"
                  onClick={openExcelModal}
                >
                  Insertar por Excel
                </button>
              </li>
              <li className="">
                <CertificateGeneratorExcel
                  onCertificateGenerated={actualizarCertificados}
                  onDeleteData={updateButton}
                />
              </li>
              <li>
                <button
                  className="w-full btn bg-sky-700 text-white hover:bg-gray-200 mt-2"
                  onClick={toggleLista}
                >
                  Lista de Modulares
                </button>
                {listaAbierta && (
                  <ul>
                    <li>Opción 1</li>
                    <li>Opción 2</li>
                    <li>Opción 3</li>
                    {/* Puedes agregar más opciones aquí */}
                  </ul> 
                )}
              </li>

              <li className="join grid grid-cols-2 mt-3 ">
                <button
                  onClick={goPrevious}
                  className="btn bg-gray-800 text-white hover:bg-gray-600 mr-2"
                >
                  Anterior
                </button>
                <button
                  onClick={goNext}
                  className="btn bg-gray-800 text-white  hover:bg-gray-600 ml-2"
                >
                  Siguiente
                </button>
              </li>

              <li>
                <div className="join grid grid-cols-2 mt-3 ">
                  <Link href="/" passHref legacyBehavior>
                    <button className="join-item bg-slate-200 btn btn-outline text-gray-900">
                      Retroceder
                    </button>
                  </Link>
                  <Link href="/cursos/graduate_reverso" passHref legacyBehavior>
                    <button className="join-item bg-slate-200 text-gray-900 btn">
                      Avanzar
                    </button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="px-4 pt-3 flex flex-col items-center ">
            {/* Contador de imágenes */}
            <div className="mb-4 text-white flex items-center justify-between">
              {/* Botón Anterior */}

              {/* Contador de imágenes */}
              <div className="  text-white flex items-center justify-between w-full">
                <div className="join">
                  {generatedCertificates.map((_, index) => (
                    <button
                      key={index}
                      className={`join-item btn ${
                        index === currentImageIndex
                          ? "bg-cyan-500 text-white"
                          : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="carousel-container max-w-[80%] flex flex-col items-center mb-14" >
              {" "}
              {/* Ajustar max-w-lg según sea necesario */}
              {generatedCertificates.length > 0 ? (
                <ImageMagnifier
                  src={generatedCertificates[currentImageIndex]}
                  magnifierHeight={150}
                  magnifieWidth={300}
                  zoomLevel={1.5}
                  alt={`Generated Certificate ${currentImageIndex}`}
                />
              ) : (
                <div>Genera tus Diplomados</div>

              )}
              <button
                className="ml-20 btn bg-cyan-600 text-white hover:bg-red-400"
                onClick={eliminarImagen}
              >
                Eliminar Certificado
              </button>
            </div>
          </div>
        </div>
      </div>
     
      <div>
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box bg-sky-500">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg mb-4">Ingresa los datos del participante</h3>
              <button className="close-button" onClick={closeModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>

            <CertificateGenerator />
          </div>
        </dialog>

        <dialog id="excel_modal" className="modal" ref={excelModalRef}>
          <div className="modal-box">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg mb-4">Insertar por Excel</h3>
              <button className="close-button" onClick={closeExcelModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>

            <ReadExcelParticipants />
          </div>
        </dialog>
      </div>
    </div>
  );
}


