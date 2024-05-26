import React, { useState, useEffect } from "react";
import { ImageDatabase } from "./ImageUploaderDB";
import { participantDB } from "./ReadExcelParticipants";

const imageDB = new ImageDatabase();

const CertificateGeneratorExcel = ({
  onCertificateGenerated,
  onDeleteData,
}) => {
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [participantsExist, setParticipantsExist] = useState(false); // Estado para rastrear si existen participantes en la tabla
  const [dataExists, setDataExists] = useState(false);

  const handleDelete = async () => {
    try {
      await Promise.all([
        imageDB.certificates.clear(),
        participantDB.participants.clear(),
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
      console.log("Limpiando la base de datos de certificados...");
      await imageDB.certificates.clear();

      const participants = await participantDB.participants.toArray();

      if (participants.length === 0) {
        console.warn("No hay participantes en la base de datos.");
        return;
      }

      console.log("Lista de participantes:");
      participants.forEach((participant) => {
        console.log(participant);
      });

      // Cargar todas las imágenes desde imageDB
      const images = await imageDB.images.toArray();
      const imageData = {};
      images.forEach((image) => {
        imageData[image.name] = image.imageDataURL;
      });

      // Obtener el array selectedCertificates del localStorage
      const selectedCertificates = JSON.parse(
        localStorage.getItem("selectedCertificates")
      );
      console.log("Tipos de certificados seleccionados:", selectedCertificates);

      for (const participant of participants) {
        try {
          if (participant.estadoPago === "Aprobado") {
            console.log("Datos de las imágenes:", imageData); // Agrega este console.log para imprimir datos de las imágenes
            if (selectedCertificates.includes("certificadoDigital")) {
              const certificateDataURLDigital = await generateCertificate(
                participant,
                imageData.imgCertiDigital
              );
              await imageDB.certificates.add({
                certificateDataURL: certificateDataURLDigital,
                type: "certificadoDigital",
                ownerName: participant.nombreParticipante,
              }); // Agrega ownerName al certificado
              console.log(
                `Certificado digital generado para ${participant.nombreParticipante}`
              );
            }
            if (selectedCertificates.includes("certificadoFisico")) {
              const certificateDataURLPhisyc = await generateCertificateReverso(
                participant,
                imageData.imgCertiPhisyc
              );
              await imageDB.certificates.add({
                certificateDataURL: certificateDataURLPhisyc,
                type: "certificadoFisico",
                ownerName: participant.nombreParticipante,
              }); // Agrega ownerName al certificado
              console.log(
                `Certificado físico generado para ${participant.nombreParticipante}`
              );
            }
          } else {
            console.log(
              `El participante ${participant.nombreParticipante} no tiene el estado de pago aprobado. No se generará ningún certificado.`
            );
          }
        } catch (error) {
          console.error(
            `Error al generar el certificado para ${participant.nombreParticipante}:`,
            error
          );
        }
      }

      alert(
        "Certificados generados exitosamente para todos los participantes."
      );
      // Llamar a la función onCertificateGenerated al completar la generación de certificados
      onCertificateGenerated();
    } catch (error) {
      console.error("Error al generar los certificados:", error);
      console.error(
        "Error al generar los certificados. Por favor, inténtalo de nuevo."
      );
    } finally {
      setGeneratingCertificates(false);
    }
  };

  // IMAGEN DE ANVERSO
// IMAGEN DE ANVERSO
const generateCertificate = async (participant, imageDataURL) => {
  // Verificar si todos los campos necesarios están disponibles
  if (imageDataURL) {
    // Crear un lienzo
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 4677; // Ancho de tu imagen
    canvas.height = 3307; // Alto de tu imagen

    // Cargar la imagen en el lienzo
    const img = new Image();
    img.src = imageDataURL;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    ctx.textAlign = "justify";
    ctx.drawImage(img, 0, 0);

    ctx.fillStyle = "#000000"; // Color del texto
    ctx.textBaseline = "top";

    //ctx.textAlign = "center";
    //ctx.font = 'bold 50px  Arial';
    //ctx.fillText(participant.CursoName, 1528, 670);

    ctx.textAlign = "center";
    ctx.font = "bold 140px Century Gothic"; //
    ctx.fillText(participant.nombreParticipante, 2850, 1410);

    // Obtener la fecha actual
    var currentDate = new Date();

    // Array con los nombres de los meses en español
    var meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    // Obtener el nombre del mes actual
    var mesActual = meses[currentDate.getMonth()];

    // Texto a dibujar
    var texto = "Lima, " + mesActual + " del " + currentDate.getFullYear();

    // Dibujar el texto en el lienzo
    ctx.textAlign = "center";
    ctx.font = "65px Century Gothic";
    ctx.fillText(texto, 3650, 2480);

    ctx.textAlign = "center";
    ctx.font = " 65px Century Gothic"; //
    ctx.fillText(texto, 3650, 2480);

    //------------------------------------------------------------------------------------------------------------------
    ctx.textAlign = "center";
    ctx.fillStyle = "black ";
    ctx.font = "bold 55px Century Gothic  ";
    ctx.fillText(participant.codigoParticipante, 700, 2875);

    //TEXTO DE ORGANIZACION, FECHAS Y HORAS
    var tamanoFuente = 5; // Tamaño de fuente en píxeles+ participant.FechaFin + ' , con una duración de 420 hrs académicas, equivalente a ';
    // Ancho máximo deseado para el texto
    var textoCompleto =
      "Por haber culminado y aprobado satisfactoriamente el DIPLOMADO DE ESPECIALIZACIÓN " +
      participant.CursoName +
      " en su calidad de asistente, aprobado mediante la " +
      participant.Resolucion +
      " , llevado a cabo del " +
      participant.FechaInicio +
      " al " +
      participant.FechaFin +
      " con una duracion de 420 horas académicas, equivalente a 26 créditos" +
       
      ", de conformidad con la ley Universitaria vigente.";

    var anchoMaximo = 2500;

    // Función para dividir el texto en líneas según el ancho máximo
    function dividirTextoEnLineas(texto, anchoMaximo) {
      var palabras = texto.split(" ");
      var lineas = [];
      var lineaActual = palabras[0];
      for (var i = 1; i < palabras.length; i++) {
        var palabra = palabras[i];
        var medida = ctx.measureText(lineaActual + " " + palabra);
        if (medida.width < anchoMaximo) {
          lineaActual += " " + palabra;
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
    var y = 1680; // Posición vertical inicial

    // Dibujar cada línea en el canvas
    for (var i = 0; i < lineas.length; i++) {
      var linea = lineas[i];
      var partes = linea.split(
        new RegExp(
          `(${participant.CursoName}|420 horas académicas|26 créditos)`,
          "g"
        )
      );

      // Calcular el ancho total de la línea para centrarla
      var anchoTotal = partes.reduce((total, parte) => {
        var font =
          parte === participant.CursoName ||
          parte === "420 horas académicas" ||
          parte === "26 créditos"
            ? "bold 65px Century Gothic"
            : "65px Century Gothic";
        ctx.font = font;
        return total + ctx.measureText(parte).width;
      }, 0);

      var x = 2730 - anchoTotal / 2; // Centrar horizontalmente
      ctx.textAlign = "left"; // Alinear el texto a la izquierda para el dibujo manual
      ctx.fillStyle = "black";

      // Dibujar cada parte de la línea
      partes.forEach((parte) => {
        var font =
          parte === participant.CursoName ||
          parte === "420 horas académicas" ||
          parte === "26 créditos"
            ? "bold 65px Century Gothic"
            : "65px Century Gothic";
        ctx.font = font;

        // Si la parte es el CursoName, convertir a mayúsculas
        var textToDraw =
          parte === participant.CursoName ? parte.toUpperCase() : parte;

        ctx.fillText(textToDraw, x, y);
        x += ctx.measureText(textToDraw).width; // Incrementar la posición x para la siguiente parte
      });

      // Incrementar la posición y para la siguiente línea
      y += 55 + 55; // Espacio vertical entre líneas (tamaño de fuente + 50)
    
  
};


      //TEMARIO -----------------------------------------------------------------------
      // Ancho máximo permitido para el texto
      var anchoMaximo = 500;

      var x = 110; // Posición x inicial
      var y = 989; // Posición y inicial

      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL("image/jpeg");

      return certificateDataURL; // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error("Faltan campos necesarios para generar el diplomado.");
    }
  };

  // IMAGEN DE REVERSO
  const generateCertificateReverso = async (participant, imageDataURL) => {
    // Verificar si todos los campos necesarios están disponibles
    if (imageDataURL) {
      // Crear un lienzo
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 4677; // Ancho de tu imagen
      canvas.height = 3307; // Alto de tu imagen

      // Cargar la imagen en el lienzo
      const img = new Image();
      img.src = imageDataURL;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      ctx.textAlign = "justify";
      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "#000000"; // Color del texto
      ctx.textBaseline = "top";

      //ctx.textAlign = "center";
      //ctx.font = 'bold 50px  Arial';
      //ctx.fillText(participant.CursoName, 1528, 670);

      ctx.textAlign = "center";
      ctx.font = " 80px Futura Bk BT ";
      ctx.fillText(participant.CursoName, 3150, 1450);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Futura Bk BT ";
      ctx.fillText(participant.NotaParcial, 4220, 1830);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Futura Bk BT ";
      ctx.fillText(participant.NotaFinal, 4220, 2150);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Futura Bk BT ";
      ctx.fillText(participant.Promedio, 4190, 2980);

      ctx.textAlign = "center";
      ctx.fillStyle = "black ";
      ctx.font = " 100px Futura Bk BT ";
      ctx.fillText(participant.codigoParticipante, 1185, 2770);

      //TEXTO DE ORGANIZACION, FECHAS Y HORAS
      //TEXTO DE ORGANIZACION, FECHAS Y HORAS
      var tamanoFuente = 5; // Tamaño de fuente en píxeles+ participant.FechaFin + ' , con una duración de 420 hrs académicas, equivalente a ';
// Definición del texto completo y el ancho máximo

      // Definición del texto completo y el ancho máximo
var textoCompleto = participant.Modulos;
var anchoMaximo = 4700;
var tamanoFuente = 50; // Tamaño de la fuente en píxeles
var margenHorizontal = 450; // Margen horizontal entre el título del módulo y el texto del módulo
var margenIzquierdo = 1950; // Margen izquierdo para el texto
var margenSeparacion = -7; // Margen vertical entre el título y el texto

// Función para convertir un número a números romanos (hasta 15)
function convertirARomanos(num) {
  if (num < 1 || num > 15) return ""; // Asegurar que el número esté en el rango 1-15
  var romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
  return romanos[num - 1];
}

// Función para dividir el texto en módulos según el carácter de viñeta
function dividirTextoEnModulos(texto) {
  return texto.split("• ").filter(Boolean); // Divide el texto donde encuentra "• " y filtra entradas vacías
}

// Función para dividir cada módulo en líneas según el ancho máximo
function dividirTextoEnLineas(texto, anchoMaximo) {
  var palabras = texto.split(" ");
  var lineas = [];
  var lineaActual = palabras[0];
  for (var i = 1; i < palabras.length; i++) {
    var palabra = palabras[i];
    var medida = ctx.measureText(lineaActual + " " + palabra);
    if (medida.width < anchoMaximo) {
      lineaActual += " " + palabra;
    } else {
      lineas.push(lineaActual);
      lineaActual = palabra;
    }
  }
  lineas.push(lineaActual);
  return lineas;
}

var modulos = dividirTextoEnModulos(textoCompleto);
var cantidadModulos = Math.min(modulos.length, 15); // Obtener la cantidad de módulos (limitado a 15)

var yInicial = 1730; // Posición inicial en Y
var alturaCanvas = 2500; // Altura total del canvas (ejemplo)
var alturaDisponible = alturaCanvas - yInicial;
var alturaModulo = alturaDisponible / cantidadModulos; // Altura equitativa para cada módulo

// Dibujar cada módulo en el canvas
for (var i = 0; i < cantidadModulos; i++) {
  var tituloModulo = `Módulo ${convertirARomanos(i + 1)}`; // Convertir el número a romano
  var textoModulo = modulos[i].trim();

  // Calcular las posiciones horizontales para el título y el texto del módulo
  var xTitulo = margenIzquierdo;
  var xTexto = margenIzquierdo + margenHorizontal;

  // Posiciones verticales
  var yBase = yInicial + (i * alturaModulo); // Base del módulo
  var yTitulo = yBase + (alturaModulo / 4); // Título a 1/4 del módulo desde la base
  var yTexto = yBase + (alturaModulo / 4); // Texto a 1/2 del módulo desde la base
 
  // Establecer la fuente y el color del texto del título del módulo
  ctx.textAlign = "left";
  ctx.font = `${tamanoFuente}px Futura Bk BT`;
  ctx.fillStyle = "black";

  // Renderizar el título del módulo
  ctx.fillText(tituloModulo, xTitulo, yTitulo);

  // Renderizar el texto del módulo
  ctx.fillText(textoModulo, xTexto, yTexto);
}



      //TEMARIO -----------------------------------------------------------------------
      // Ancho máximo permitido para el texto

      var anchoMaximo = 500;

      var x = 110; // Posición x inicial
      var y = 989; // Posición y inicial

      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL("image/jpeg");

      return certificateDataURL; // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error("Faltan campos necesarios para generar el diplomado.");
    }
  };

  return (
    <>
      <button
        className="w-full btn  bg-sky-700 text-white hover:bg-gray-200 mt-2"
        onClick={generateCertificates}
        disabled={generatingCertificates || !participantsExist}
      >
        {generatingCertificates
          ? "Generando Certificados..."
          : "Generar certificados para todos los participantes"}
      </button>
      <button
        className="w-full btn  bg-sky-700 text-white hover:bg-red-400  mt-2"
        onClick={handleDelete}
      >
        Limpiar todos los Datos
      </button>
    </>
  );
};

export default CertificateGeneratorExcel;
