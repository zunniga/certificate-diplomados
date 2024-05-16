"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";


interface HomeProps { }

export default function Home({ }: HomeProps) {
  // Estado local para almacenar los tipos de certificados seleccionados
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(["certificadoDigital", "certificadoFisico"]);

  // Cargar el estado inicial desde el localStorage al inicio
  useEffect(() => {
    const storedCertificates = localStorage.getItem('selectedCertificates');
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
    localStorage.setItem('selectedCertificates', JSON.stringify(selectedCertificates));
  }, [selectedCertificates]);

  // Función para manejar el clic en el botón
  const handleButtonClick = () => {
    console.log(selectedCertificates);
  };

  // Verificar si algún checkbox está seleccionado
  const isAnyCheckboxSelected = selectedCertificates.length > 0;

  return (
    <main className="relative flex flex-col items-center justify-center h-screen bg-slate-400">
      {/* Botón del icono en la esquina superior derecha */}
      <Link href="/subirImages" >
        <div className="w-24 bg-cyan-600 h-12 text-center text-slate-200 flex justify-center items-center absolute top-0 left-0 m-9 cursor-pointer rounded-xl ">Modelo Actual</div>
      </Link>
      <h1 className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">
          EMISION DE DIPLOMADOS
        </span>
      </h1>
      <h2 className="text-xl mb-4">Suba los modelos con los que desee trabajar: </h2>
      <div className="flex flex-row">
        {[0, 1].map((index) => (
          <div key={index} className="flex items-center bg-gray-200 text-gray-800 font-semibold mr-4 p-4 rounded-xl">
            <div className="mr-2"> {/* Div para el texto indicativo */}
              {index === 0 ? "Modelo Cargado correctamente(anverso)" : "Modelo Cargado Correctamente(reverso)"}
            </div>
            <div className="flex items-end">
              <input
                className="checkbox checkbox-accent checkbox-lg  mr-1"
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    index === 0 ? "certificadoDigital" : "certificadoFisico"
                  )
                }
                checked={selectedCertificates.includes(index === 0 ? "certificadoDigital" : "certificadoFisico")}
              />
            </div>
          </div>
        ))}
      </div>
      <Link href="/cursos" passHref legacyBehavior>
        <button className={`btn bg-indigo-600 text-slate-200  btn-lg mt-8 ${!isAnyCheckboxSelected ? "disabled:opacity-50 cursor-not-allowed" : ""}`} onClick={handleButtonClick} disabled={!isAnyCheckboxSelected}>
          Ir a generar Diplomados
        </button>
      </Link>
    </main>
  );
}

