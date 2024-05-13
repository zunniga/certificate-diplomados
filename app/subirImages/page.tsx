<<<<<<< HEAD
"use client"
=======
'use client';
>>>>>>> a23dc18a51769d71f0646a6fab698f7bc82dcc2e
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useImageUploader } from "@/Components/ImageUploaderDB";
import { IoIosExit } from "react-icons/io";

export default function Home() {
    const { guardarImagenes } = useImageUploader();
    const [enabledInputs, setEnabledInputs] = useState<boolean[]>([true, true, true]); // Cambiado a true
    const [files, setFiles] = useState<Array<File | null>>([null, null, null]);

    useEffect(() => {
        // Verificar si el usuario está autenticado
       
    }, []);

    

    const handleCheckboxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnabledInputs = [...enabledInputs];
        newEnabledInputs[index] = e.target.checked;
        setEnabledInputs(newEnabledInputs);
    };

    const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = [...files];
            newFiles[index] = e.target.files[0];
            setFiles(newFiles);
        }
    };

    const isGuardarButtonEnabled = enabledInputs.filter((enabled, index) => enabled).length === files.filter((file, index) => file !== null && enabledInputs[index]).length && enabledInputs.some(enabled => enabled);

    const handleGuardarImagenes = () => {
        const filesToSave = files.map((file, index) => {
            if (enabledInputs[index] && file) {
                let nombre;
                if (index === 0) {
                    nombre = 'imgCertiDigital';
                } else if (index === 1) {
                    nombre = 'imgCertiPhisyc';
                } else if (index === 2) {
                    nombre = 'imgCertiOnly';
                }
                return { file, nombre };
            }
            return null;
        }).filter(Boolean);

        console.log("Imágenes seleccionadas para guardar:", filesToSave);
        guardarImagenes(filesToSave);
    };

    return (

        <main className="bg-cyan-600 flex flex-col items-center justify-center h-screen">
            {/* Botón del icono en la esquina superior derecha */}
            <Link href="/" >

            <IoIosExit color="#ef4444" className="w-12 h-12 absolute top-0 right-0 m-4 cursor-pointer text-gray-500" size={24} />

            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl md:text-6xl p-6 mb-8">
                <span className="block">
                    Modelo de diplomado para modificar


                </span>
            </h1>
            <div className="flex flex-row">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="mr-10 flex">
                        <div className="flex items-end">
                            <input
                                className="checkbox checkbox-info checkbox-lg mb-2 mr-1"
                                type="checkbox"
                                checked={enabledInputs[index]}
                                onChange={handleCheckboxChange(index)}
                            />
                        </div>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Carga el reverso y anverso del diplomado</span>
                            </div>
                            <input
                                className="file-input file-input-bordered w-full max-w-xs file-input-info"
                                type="file"
                                onChange={handleFileChange(index)}
                                accept="image/*"
                                disabled={!enabledInputs[index]}
                            />
                            {files[index] && (
                                <img src={URL.createObjectURL(files[index])} alt={`Preview ${index}`} className="w-max" />
                            )}
                        </label>

                    </div>
                ))}
            </div>
            <Link href="/" passHref legacyBehavior>
                <button
                    className={`btn btn-info btn-lg mt-8  ${!isGuardarButtonEnabled ? 'cursor-not-allowed opacity-90' : ''}`}
                    onClick={handleGuardarImagenes}
                    disabled={!isGuardarButtonEnabled}
                >
                    Guardar Imágenes
                </button>
            </Link>
        </main>


    );

}