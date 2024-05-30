import React, { useState, useEffect } from "react";
import { ImageDatabase } from "./ImageUploaderDB"; // Importa la clase ImageDatabase
import {
  IngenieriaCivil,
  IngenieriaPuentes,
} from "@/Components/utils/modulares";

const CertificateGenerator = () => {
  const [CursoName, setCursoName] = useState("");
  const [FechaInicio, setFechaInicio] = useState("");
  const [FechaFin, setFechaFin] = useState("");
  const [ParticipanteName, setParticipanteName] = useState("");
  const [Resolucion, setResolucion] = useState("");
  const [CodigoParticipante, setCodigoParticipante] = useState("");
  const [NotaParcial, setNotaParcial] = useState("");
  const [NotaFinal, setNotaFinal] = useState("");
  const [Promedio, setPromedio] = useState("");

  const [digitalImageDataURL, setDigitalImageDataURL] = useState(null);
  const [physicalImageDataURL, setPhysicalImageDataURL] = useState(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [selectedImageType, setSelectedImageType] = useState("");

  const imageDB = new ImageDatabase();

  const [selectedModular, setSelectedModular] = useState("");
  const [selectedModularContent, setSelectedModularContent] = useState("");

  const handleModularChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedModular(selectedValue);

    // Determinar el contenido correspondiente según la selección
    if (selectedValue === "Ingenieria Civil") {
      setSelectedModularContent(IngenieriaCivil.join("\n"));
    } else if (selectedValue === "Ingenieria Puentes") {
      setSelectedModularContent(IngenieriaPuentes.join("\n"));
    } else {
      setSelectedModularContent(""); // Si no hay selección válida, establecer el contenido como vacío
    }
  };

  const loadSelectedImages = async () => {
    try {
      const images = await imageDB.images.toArray();
      if (images.length > 0) {
        const digitalImage = images.find(
          (image) => image.name === "imgCertiDigital"
        );
        const physicalImage = images.find(
          (image) => image.name === "imgCertiPhisyc"
        );

        if (digitalImage) {
          setDigitalImageDataURL(digitalImage.imageDataURL);
          console.log(
            "Imagen digital obtenida de la base de datos:",
            digitalImage
          );
        } else {
          console.log("No se encontró una imagen digital.");
        }

        if (physicalImage) {
          setPhysicalImageDataURL(physicalImage.imageDataURL);
          console.log(
            "Imagen física obtenida de la base de datos:",
            physicalImage
          );
        } else {
          console.log("No se encontró una imagen física.");
        }
      } else {
        console.log("No se encontraron imágenes en la base de datos.");
      }
    } catch (error) {
      console.error(
        "Error al cargar las imágenes desde la Base de Datos:",
        error
      );
    }
  };

  useEffect(() => {
    loadSelectedImages();
  }, [selectedImageType]);

  const checkFields = () => {
    if (
      CursoName &&
      selectedModular &&
      FechaInicio &&
      FechaFin &&
      ParticipanteName &&
      Resolucion &&
      CodigoParticipante &&
      NotaParcial &&
      NotaFinal &&
      Promedio &&
      selectedImageType
    ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  useEffect(() => {
    checkFields();
  }, [
    CursoName,
    selectedModular,
    FechaInicio,
    FechaFin,
    ParticipanteName,
    Resolucion,
    CodigoParticipante,
    NotaParcial,
    NotaFinal,
    Promedio,
    digitalImageDataURL,
    physicalImageDataURL,
  ]);

  useEffect(() => {
    checkFields();
  }, [
    CursoName,
    selectedModular,
    FechaInicio,
    FechaFin,
    ParticipanteName,
    Resolucion,
    CodigoParticipante,
    NotaParcial,
    NotaFinal,
    Promedio,
    digitalImageDataURL,
    physicalImageDataURL,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      CursoName &&
      FechaInicio &&
      (digitalImageDataURL || physicalImageDataURL)
    ) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 4677;
      canvas.height = 3307;

      function formatearFechaInicio(fecha) {
        const meses = [
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
        const partes = fecha.split("-");
        const mes = meses[parseInt(partes[1], 10) - 1];
        const dia = partes[2];
        return dia + " de " + mes;
      }

      function formatearFechaFin(fecha) {
        const meses = [
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
        const partes = fecha.split("-");
        const mes = meses[parseInt(partes[1], 10) - 1];
        return `${partes[2]} de ${mes} del ${partes[0]}`;
      }

      const fechaInicioFormateada = formatearFechaInicio(FechaInicio);
      const fechaFinFormateada = formatearFechaFin(FechaFin);

      const generateCertificate = (imageDataURL, type) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = imageDataURL;

          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "#000000";
            ctx.font = "bold 65px Century Gothic"; // Cambio de fuente y tamaño
            ctx.textBaseline = "top";

            // Dibujar textos en el canvas
            if (type === "certificadoDigital") {
              ctx.textAlign = "center";
              ctx.font = "bold 140px Century Gothic"; // Cambio de fuente y tamaño
              ctx.fillText(ParticipanteName, 2850, 1410);

              var currentDate = new Date();
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
              var mesActual = meses[currentDate.getMonth()];
              var texto =
                "Lima, " + mesActual + " del " + currentDate.getFullYear();
              ctx.textAlign = "center";
              ctx.font = "65px Century Gothic"; // Cambio de fuente y tamaño
              ctx.fillText(texto, 3650, 2480);

              ctx.textAlign = "center";
              ctx.fillStyle = "black";
              ctx.font = "bold 55px Century Gothic"; // Cambio de fuente y tamaño
              ctx.fillText(CodigoParticipante, 700, 2875);

              var textoCompleto =
                "Por haber culminado y aprobado satisfactoriamente el DIPLOMADO DE ESPECIALIZACIÓN " +
                CursoName +
                " en su calidad de asistente, aprobado mediante la " +
                Resolucion +
                " , llevado a cabo del " +
                fechaInicioFormateada +
                " al " +
                fechaFinFormateada +
                " con una duración de 420 horas académicas, equivalente a 26 créditos" +
                ", de conformidad con la ley Universitaria vigente.";
              var anchoMaximo = 2500;

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

              var lineas = dividirTextoEnLineas(textoCompleto, anchoMaximo);
              var y = 1680;

              for (var i = 0; i < lineas.length; i++) {
                var linea = lineas[i];
                var partes = linea.split(
                  new RegExp(
                    `(${CursoName}|420 horas académicas|26 créditos)`,
                    "g"
                  )
                );

                var anchoTotal = partes.reduce((total, parte) => {
                  var font =
                    parte === CursoName ||
                    parte === "420 horas académicas" ||
                    parte === "26 créditos"
                      ? "bold 65px Century Gothic" // Cambio de fuente y tamaño
                      : "65px Century Gothic"; // Cambio de fuente y tamaño
                  ctx.font = font;
                  return total + ctx.measureText(parte).width;
                }, 0);

                var x = 2730 - anchoTotal / 2;
                ctx.textAlign = "left";
                ctx.fillStyle = "black";

                partes.forEach((parte) => {
                  var font =
                    parte === CursoName ||
                    parte === "420 horas académicas" ||
                    parte === "26 créditos"
                      ? "bold 65px Century Gothic" // Cambio de fuente y tamaño
                      : "65px Century Gothic"; // Cambio de fuente y tamaño
                  ctx.font = font;

                  var textToDraw =
                    parte === CursoName ? parte.toUpperCase() : parte;

                  ctx.fillText(textToDraw, x, y);
                  x += ctx.measureText(textToDraw).width;
                });

                y += 55 + 55;
              }
            } else if (type === "certificadoFisico") {
              // Mantener el estilo del certificado físico
              ctx.textAlign = "center";
              ctx.font = "80px Futura Bk BT";
              ctx.fillText(CursoName, 3150, 1450);

              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(NotaParcial, 4220, 1830);

              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(NotaFinal, 4220, 2150);

       // Configurar el fuente y el tamaño del texto
ctx.font = "50px Futura Bk BT"; // Tipo de letra "Futura Bk BT" y tamaño de 50px
ctx.fillStyle = "black"; // Color del texto negro

// Dividir el contenido en líneas
var lineas = selectedModularContent.split("\n");

// Calcular el ancho máximo de los números romanos
var anchoMaximoNumeros = ctx.measureText("XII.").width;

// Definir un ancho máximo predefinido para el texto
var anchoMaximo = 1200;

// Definir una altura estimada por línea de texto
var alturaLinea = 70;

// Calcular la altura total de la lista
var alturaTotal = lineas.length * alturaLinea;

// Calcular la posición inicial en Y para centrar la lista verticalmente
var yInicial = (canvas.height - alturaTotal) / 2;

// Calcular la posición inicial en X para centrar el texto horizontalmente
var xInicial = (canvas.width - anchoMaximo) / 2;

// Renderizar cada línea de la lista
lineas.forEach(function(linea, indice) {
    var y = yInicial + (indice * alturaLinea); // Espacio vertical entre líneas

    // Obtener el número romano de la línea
    var numeroRomano = linea.match(/^([IVXLCDM]+)\./);
    if (numeroRomano) {
        // Calcular el espacio necesario para el número romano
        var anchoNumero = ctx.measureText(numeroRomano[0]).width;
        // Calcular la posición inicial en X del texto
        var x = xInicial + (anchoMaximoNumeros - anchoNumero);
        // Renderizar el número romano
        ctx.fillText(numeroRomano[0], x, y);
        // Renderizar el resto del texto
        ctx.fillText(linea.slice(numeroRomano[0].length).trim(), xInicial + anchoMaximoNumeros + 20, y);
    } else {
        // Si no hay número romano, renderizar el texto completo
        ctx.fillText(linea.trim(), xInicial, y);
    }
});




              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(Promedio, 4190, 2980);

              ctx.textAlign = "center";
              ctx.fillStyle = "black ";
              ctx.font = " 100px Futura Bk BT ";
              ctx.fillText(CodigoParticipante, 1185, 2770);
            }

            const certificateDataURL = canvas.toDataURL("image/jpeg");
            resolve({ certificateDataURL, type, ownerName: ParticipanteName });
          };

          img.onerror = (error) => {
            reject(error);
          };
        });
      };

      const certificatesToSave = [];

      if (selectedImageType === "tipo4") {
        if (digitalImageDataURL) {
          certificatesToSave.push(
            generateCertificate(digitalImageDataURL, "certificadoDigital")
          );
        }
        if (physicalImageDataURL) {
          certificatesToSave.push(
            generateCertificate(physicalImageDataURL, "certificadoFisico")
          );
        }
      } else {
        alert("No se ha seleccionado ningún tipo de certificado.");
        return;
      }

      Promise.all(certificatesToSave)
        .then((certificates) =>
          Promise.all(
            certificates.map((cert) => imageDB.certificates.add(cert))
          )
        )
        .then(() => {
          alert("¡Certificado generado exitosamente!");
          window.location.href = "/cursos";
        })
        .catch((error) => {
          console.error(
            "Error al guardar el certificado en la base de datos:",
            error
          );
        });
    } else {
      alert(
        "Por favor completa todos los campos antes de generar el certificado."
      );
    }
  };

  const dividirTextoEnLineas = (texto, maxWidth, ctx) => {
    const words = texto.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <div>
      <form method="dialog" onSubmit={handleSubmit}>
        <div className=" text-center bg-slate-900 border border-zinc-950 rounded-md mb-4 p-2 ">
          {" "}
          ANVERSO DEL DIPLOMADO{" "}
        </div>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            placeholder="Nombre del Diplomado"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="ParticipanteName"
        >
          <input
            placeholder="Nombre del participante"
            type="text"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="Resolucion"
        >
          <input
            placeholder="Resolucion"
            type="text"
            id="Resolucion"
            value={Resolucion}
            onChange={(e) => setResolucion(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="FechaInicio"
        >
          <input
            placeholder="Fecha de inicio"
            type="date"
            id="FechaInicio"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="FechaFin"
        >
          <input
            placeholder="Fecha de fin"
            type="date"
            id="FechaFin"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <div className=" text-center bg-slate-900 border border-zinc-950 rounded-md mb-4 p-2 ">
          {" "}
          REVERSO DEL DIPLOMADO{" "}
        </div>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>

        <select
          className="select select-bordered w-full mb-4"
          id="modularType"
          value={selectedModular}
          onChange={handleModularChange}
        >
          <option defaultValue>Seleccionar los modulares del diplomado</option>
          <option value="Ingenieria Civil">
            Modulares de Ingenieria Civil
          </option>
          <option value="Ingenieria Puentes">
            Modulares de Ingenieria Puentes
          </option>
        </select>

        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="NotaParcial"
        >
          <input
            placeholder="Nota Parcial"
            type="text"
            id="NotaParcial"
            value={NotaParcial}
            onChange={(e) => setNotaParcial(e.target.value)}
          />
        </label>

        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="NotaFinal"
        >
          <input
            placeholder="Nota Final"
            type="text"
            id="NotaFinal"
            value={NotaFinal}
            onChange={(e) => setNotaFinal(e.target.value)}
          />
        </label>

        <label
          className="input input-bordered flex items-center mb-4"
          htmlFor="Promedio"
        >
          <input
            placeholder="Promedio"
            type="text"
            id="Promedio"
            value={Promedio}
            onChange={(e) => setPromedio(e.target.value)}
          />
        </label>

        <select
          className="select select-bordered w-full mb-4"
          id="imageType"
          value={selectedImageType}
          onChange={(e) => setSelectedImageType(e.target.value)}
        >
          <option defaultValue>Seleccionar tipo de certificado</option>
          <option value="tipo4">Diplomado Físico</option>
        </select>

        <button
          className="btn w-full"
          type="submit"
          disabled={setSubmitButtonDisabled}
        >
          Generar Certificado
        </button>
      </form>
    </div>
  );
};

export default CertificateGenerator;
