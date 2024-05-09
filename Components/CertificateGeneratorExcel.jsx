import React, { useState, useEffect } from 'react';
import { ImageDatabase } from './ImageUploaderDB';
import { participantDB } from './ReadExcelParticipants';

const imageDB = new ImageDatabase();

const CertificateGeneratorExcel = ({ onCertificateGenerated, onDeleteData }) => {
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [participantsExist, setParticipantsExist] = useState(false); // Estado para rastrear si existen participantes en la tabla
  const [dataExists, setDataExists] = useState(false);

  const handleDelete = async () => {
    try {
      await Promise.all([
        imageDB.certificates.clear(),
        participantDB.participants.clear()
      ]);
      alert("Datos limpiados correctamente.");
      const participants = await participantDB.participants.toArray();
      setParticipantsExist(participants.length > 0);
      onDeleteData();
    } catch (error) {
      console.error("Error al limpiar las tablas:", error);
    }
  };

  useEffect(() => {
    const checkDataExists = async () => {
      try {
        const certificates = await imageDB.certificates.toArray();
        const participants = await participantDB.participants.toArray();
        setDataExists(certificates.length > 0 || participants.length > 0);
      } catch (error) {
        console.error("Error al verificar la existencia de datos:", error);
      }
    };
    
    checkDataExists();
  }, []);


  useEffect(() => {
    // Verificar si hay participantes en la tabla al montar el componente
    const checkParticipantsExistence = async () => {
      const participants = await participantDB.participants.toArray();
      setParticipantsExist(participants.length > 0);
    };
    checkParticipantsExistence();
  }, []);

  const generateCertificates = async () => {
    try {
      setGeneratingCertificates(true);
      console.log('Limpiando la base de datos de certificados...');
      await imageDB.certificates.clear();

      const participants = await participantDB.participants.toArray();

      if (participants.length === 0) {
        console.warn('No hay participantes en la base de datos.');
        return;
      }

      console.log('Lista de participantes:');
      participants.forEach(participant => {
        console.log(participant);
      });

      // Cargar todas las imágenes desde imageDB
      const images = await imageDB.images.toArray();
      const imageData = {};
      images.forEach(image => {
        imageData[image.name] = image.imageDataURL;
      });

      // Obtener el array selectedCertificates del localStorage
      const selectedCertificates = JSON.parse(localStorage.getItem('selectedCertificates'));
      console.log('Tipos de certificados seleccionados:', selectedCertificates);

      for (const participant of participants) {
        try {
          if (participant.estadoPago === 'Pagado') {
            console.log('Datos de las imágenes:', imageData); // Agrega este console.log para imprimir datos de las imágenes
            if (selectedCertificates.includes('certificadoDigital')) {
              const certificateDataURLDigital = await generateCertificate(participant, imageData.imgCertiDigital);
              await imageDB.certificates.add({ certificateDataURL: certificateDataURLDigital, type: 'certificadoDigital', ownerName: participant.nombreParticipante }); // Agrega ownerName al certificado
              console.log(`Certificado digital generado para ${participant.nombreParticipante}`);
            }
            if (selectedCertificates.includes('certificadoFisico')) {
              const certificateDataURLPhisyc = await generateCertificate(participant, imageData.imgCertiPhisyc);
              await imageDB.certificates.add({ certificateDataURL: certificateDataURLPhisyc, type: 'certificadoFisico', ownerName: participant.nombreParticipante }); // Agrega ownerName al certificado
              console.log(`Certificado físico generado para ${participant.nombreParticipante}`);
            }
          } else if (participant.estadoPago === 'NoPagado' && selectedCertificates.includes('certificadoOnly')) {
            const certificateDataURLOnly = await generateCertificate(participant, imageData.imgCertiOnly);
            await imageDB.certificates.add({ certificateDataURL: certificateDataURLOnly, type: 'certificadoOnly', ownerName: participant.nombreParticipante }); // Agrega ownerName al certificado
            console.log(`Certificado only generado para ${participant.nombreParticipante}`);
          }
        } catch (error) {
          console.error(`Error al generar el certificado para ${participant.nombreParticipante}:`, error);
        }
      }
      
      alert("Certificados generados exitosamente para todos los participantes.");
      // Llamar a la función onCertificateGenerated al completar la generación de certificados
      onCertificateGenerated();


    } catch (error) {
      console.error('Error al generar los certificados:', error);
      console.error('Error al generar los certificados. Por favor, inténtalo de nuevo.');
    } finally {
      setGeneratingCertificates(false);
    }
  };

  const generateCertificate = async (participant, imageDataURL) => {
    // Verificar si todos los campos necesarios están disponibles
    if (imageDataURL) {

      // Crear un lienzo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 2000; // Ancho de tu imagen
      canvas.height = 1413; // Alto de tu imagen

      // Cargar la imagen en el lienzo
      const img = new Image();
      img.src = imageDataURL;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      ctx.textAlign = 'justify';
      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = '#000000'; // Color del texto
      ctx.textBaseline = 'top';

      ctx.textAlign = "center";
      ctx.font = 'bold 50px  Arial';
      ctx.fillText(participant.CursoName, 1300, 670);

      ctx.textAlign = "center";
      ctx.font = 'bold 65px Arial'; // 
      ctx.fillText(participant.nombreParticipante, 1300, 540);

      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = 'bold 25px Arial'; // 
      ctx.fillText(participant.Ponente, 300, 370);

      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = 'bold 30px Arial  ';
      ctx.fillText(participant.codigoParticipante, 308, 1198);

      //TEXTO DE ORGANIZACION, FECHAS Y HORAS
      var tamanoFuente = 35; // Tamaño de fuente en píxeles
      var textoCompleto = 'Curso oganizado por la Corporación ECOMÁS, llevado a cabo desde el ' + participant.FechaInicio + ' hasta el ' + participant.FechaFin + ' con una duración de ' + participant.HorasAcademicas + ' horas académicas.';
      // Ancho máximo deseado para el texto
      var anchoMaximo = 700;
      // Función para dividir el texto en líneas según el ancho máximo
      function dividirTextoEnLineas(texto, anchoMaximo) {
        var palabras = texto.split(' ');
        var lineas = [];
        var lineaActual = palabras[0];
        for (var i = 1; i < palabras.length; i++) {
          var palabra = palabras[i];
          var medida = ctx.measureText(lineaActual + ' ' + palabra);
          if (medida.width < anchoMaximo) {
            lineaActual += ' ' + palabra;
          } else {
            lineas.push(lineaActual);
            lineaActual = palabra;
          }
        }
        lineas.push(lineaActual);
        return lineas;
      }

      // Obtener las líneas divididas
      var lineas = dividirTextoEnLineas(textoCompleto, anchoMaximo);
      var y = 800;
      // Dibujar cada línea en el canvas
      for (var i = 0; i < lineas.length; i++) {
        ctx.textAlign = "center";
        ctx.font = '40px Arial bold'; // 
        ctx.fillStyle = "black";

        ctx.fillText(lineas[i], 1300, y);
        y += tamanoFuente + 5; // Espacio vertical entre líneas
      }
      //TEMARIO -----------------------------------------------------------------------
      // Ancho máximo permitido para el texto
      var anchoMaximo = 400;

      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = '25px bold Arial';
      var palabras = participant.Temario.split("\n");

      var x = 110; // Posición x inicial
      var y = 489; // Posición y inicial

      palabras.forEach(function (palabra, index) {
        if (index !== 0) { // Evita dibujar la primera palabra
          // Dividir la línea en palabras
          var palabrasLinea = palabra.split(' ');
          var lineaActual = '';
          palabrasLinea.forEach(function (palabra, index) {
            // Medir el ancho de la línea actual con la palabra actual agregada
            var anchoLinea = ctx.measureText(lineaActual + palabra).width;
            // Si la línea actual excede el ancho máximo permitido, dibujar la línea actual y pasar a la siguiente línea
            if (anchoLinea > anchoMaximo) {
              ctx.fillText(lineaActual, x, y);
              y += 40; // Incrementar la posición y para el salto de línea
              // Reiniciar la línea actual con la palabra actual
              lineaActual = palabra + ' ';
            } else {
              // Agregar la palabra actual a la línea actual
              lineaActual += palabra + ' ';
            }
          });
          // Dibujar la última línea actual
          ctx.fillText(lineaActual, x, y);
          y += 40; // Incrementar la posición y para el salto de línea
        }
      });

      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL('image/jpeg');

      return certificateDataURL; // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error('Faltan campos necesarios para generar el certificado.');
    }
  };

  return (
    <>
      <button className="w-full btn  bg-sky-700 text-white hover:bg-gray-200 mt-2" onClick={generateCertificates} disabled={generatingCertificates || !participantsExist}>
        {generatingCertificates ? 'Generando Certificados...' : 'Generar certificados para todos los participantes'}
      </button>
      <button className="w-full btn  bg-sky-700 text-white hover:bg-red-400  mt-2" onClick={handleDelete} >
        Limpiar todos los Datos
      </button>
    </>
  );
};

export default CertificateGeneratorExcel;
