"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface HomeProps {}

export default function Home({}: HomeProps) {
  // Estado local para almacenar los tipos de certificados seleccionados
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([
    "certificadoDigital",
    "certificadoFisico",
  ]);

  // Cargar el estado inicial desde el localStorage al inicio
  useEffect(() => {
    const storedCertificates = sessionStorage.getItem("selectedCertificates");
    if (storedCertificates) {
      setSelectedCertificates(JSON.parse(storedCertificates));
    }
  }, []);

  // Función para manejar el cambio de estado cuando se selecciona un certificado
  const handleCheckboxChange = (type: string) => {
    setSelectedCertificates((prevCertificates) => {
      // Si el certificado ya está seleccionado, lo eliminamos
      if (prevCertificates.includes(type)) {
        return prevCertificates.filter((cert) => cert !== type);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prevCertificates, type];
      }
    });
  };

  // Actualizar el localStorage cuando selectedCertificates cambia
  useEffect(() => {
    sessionStorage.setItem(
      "selectedCertificates",
      JSON.stringify(selectedCertificates)
    );
  }, [selectedCertificates]);

  // Función para manejar el clic en el botón
  const handleButtonClick = () => {
    console.log(selectedCertificates);
  };

  // Verificar si algún checkbox está seleccionado
  const isAnyCheckboxSelected = selectedCertificates.length > 0;

  return (
    <main className="relative flex flex-col items-center justify-center h-screen bg-[#001d51]">
      {/* Botón del icono en la esquina superior derecha */}
      <Link href="/subirImages">
        <div className="w-48 bg-[#178617] h-12 text-center text-xl text-slate-200 font-futura-bkbt flex justify-center items-center absolute top-0 left-0 m-9 cursor-pointer rounded-xl ">
          Modelo Actual
        </div>
      </Link>
      <h1 className="text-4xl font-extralight tracking-tight text-white sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">EMISIÓN DE DIPLOMADOS</span>
      </h1>
      <div className="flex justify-center mb-8">
        <img
          src="/images/logos/ecomas_logo1.png"
          alt="logo_ecomas"
          className=" object-cover " style={{ height: "150px" }}
        />
      </div>

      <div className="flex flex-row">
        {[0, 1].map((index) => (
          <div
            key={index}
            className="flex items-center bg-gradient-to-l from-[#006fee] to-[#001d51] text-white font-semibold mr-4 p-4 rounded-xl"
          >
            <div className="mr-2 ">
              {" "}
              {/* Div para el texto indicativo */}
              {index === 0
                ? "Modelo Cargado correctamente(anverso)"
                : "Modelo Cargado Correctamente(reverso)"}
            </div>
            <div className="flex items-end">
              <input
                className="checkbox checkbox-warning checkbox-lg  mr-1"
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    index === 0 ? "certificadoDigital" : "certificadoFisico"
                  )
                }
                checked={selectedCertificates.includes(
                  index === 0 ? "certificadoDigital" : "certificadoFisico"
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <Link href="/cursos" passHref legacyBehavior>
        <button
          className={`btn bg-gradient-to-b from-[#006fee] to-[#09327c] text-slate-200 btn-lg mt-8 ${
            !isAnyCheckboxSelected
              ? "disabled:opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleButtonClick}
          disabled={!isAnyCheckboxSelected}
        >
          Ir a generar Diplomados
        </button>
      </Link>
    </main>
  );
}
