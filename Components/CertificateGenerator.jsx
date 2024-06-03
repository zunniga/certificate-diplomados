import React, { useState, useEffect } from "react";
import { ImageDatabase } from "./ImageUploaderDB"; // Importa la clase ImageDatabase
import { LuBookUp } from "react-icons/lu";
import { LuBookDown } from "react-icons/lu";


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

  const [selectedModularContent, setSelectedModularContent] = useState("");

  const handleModularChange = (e) => {
    setSelectedModularContent(e.target.value);
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
      selectedModularContent &&
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
    FechaInicio,
    FechaFin,
    selectedModularContent,
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
    selectedModularContent,
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
                  // Establece la fuente dependiendo del valor de 'parte'
                  var font =
                    parte === CursoName ||
                    parte === "420 horas académicas" ||
                    parte === "26 créditos"
                      ? "bold 65px Century Gothic" // Fuente en negrita y tamaño 65px
                      : "65px Century Gothic"; // Fuente normal y tamaño 65px
                  ctx.font = font;

                  // Agrega comillas a CursoName si es necesario
                  var textToDraw =
                    parte === CursoName ? `"${parte.toUpperCase()}"` : parte;

                  // Dibuja el texto en el lienzo en la posición (x, y)
                  ctx.fillText(textToDraw, x, y);

                  // Actualiza la posición horizontal para el siguiente texto
                  x += ctx.measureText(textToDraw).width;
                });

                y += 55 + 55;
              }
            } else if (type === "certificadoFisico") {
              // Mantener el estilo del certificado físico
              ctx.textAlign = "center";
              ctx.font = "80px Futura Bk BT";

              // Agregar comillas a CursoName
              var cursoNameConComillas = `"${CursoName}"`;

              // Dibujar el texto en el lienzo en la posición (3150, 1450)
              ctx.fillText(cursoNameConComillas, 3150, 1450);

              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(NotaParcial, 4220, 1830);

              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(NotaFinal, 4220, 2150);

              // Configurar el fuente y el tamaño del texto
              var textoCompleto = selectedModularContent;
              var anchoMaximo = 4700;
              var tamanoFuente = 50; // Tamaño de la fuente en píxeles
              var margenHorizontal = 450; // Margen horizontal entre el título del módulo y el texto del módulo
              var margenIzquierdo = 1950; // Margen izquierdo para el texto
              var margenSeparacion = -7; // Margen vertical entre el título y el texto

              // Función para convertir un número a números romanos (hasta 15)
              function convertirARomanos(num) {
                if (num < 1 || num > 15) return ""; // Asegurar que el número esté en el rango 1-15
                var romanos = [
                  "I",
                  "II",
                  "III",
                  "IV",
                  "V",
                  "VI",
                  "VII",
                  "VIII",
                  "IX",
                  "X",
                  "XI",
                  "XII",
                  "XIII",
                  "XIV",
                  "XV",
                ];
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
              var alturaCanvas = 2650; // Altura total del canvas (ejemplo)
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
                var yBase = yInicial + i * alturaModulo; // Base del módulo
                var yTitulo = yBase + alturaModulo / 4; // Título a 1/4 del módulo desde la base
                var yTexto = yBase + alturaModulo / 4; // Texto a 1/2 del módulo desde la base

                // Establecer la fuente y el color del texto del título del módulo
                ctx.textAlign = "left";
                ctx.font = `${tamanoFuente}px Futura Bk BT`;
                ctx.fillStyle = "black";

                // Renderizar el título del módulo
                ctx.fillText(tituloModulo, xTitulo, yTitulo);

                // Renderizar el texto del módulo
                ctx.fillText(textoModulo, xTexto, yTexto);
              }

              ctx.textAlign = "center";
              ctx.font = "bold 80px Futura Bk BT ";
              ctx.fillText(Promedio, 4170, 2970);

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
      <div className="text-center text-xl bg-[#001d51] font-futura-bkbt border border-zinc-950 rounded-md mb-4 p-2 flex items-center justify-center">
      ANVERSO DEL DIPLOMADO
      <LuBookUp className="ml-2" size={25} />
    </div>
        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            required
            className="text-[#001d51]"
            placeholder="Nombre del Diplomado"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="ParticipanteName"
        >
          <input
          className="text-[#001d51]"
            required
            placeholder="Nombre del participante"
            type="text"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
            className="text-[#001d51]"
            required
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="Resolucion"
        >
          <input 
          className="text-[#001d51]"
            required
            placeholder="Resolucion"
            type="text"
            id="Resolucion"
            value={Resolucion}
            onChange={(e) => setResolucion(e.target.value)}
          />
        </label>
        <label
          className="input bg-[#649bdd] input-bordered flex items-center mb-4"
          htmlFor="FechaInicio"
        >
        <h1 className="mr-6 text-slate-100" > Fecha de Inicio:  </h1>
          <input
          className="text-slate-100"
            required
            placeholder="Fecha de inicio"
            type="date"
            id="FechaInicio"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          
          
        </label>
        <label
          className="input bg-[#649bdd] input-bordered flex items-center mb-4"
          htmlFor="FechaFin"
        >
           <h1 className="mr-6 text-slate-100"  > Fecha de Finalización:  </h1>
          <input
          className="text-slate-100"
            required
            placeholder="Fecha de fin"
            type="date"
            id="FechaFin"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <div className="text-center text-xl bg-[#001d51] font-futura-bkbt border border-zinc-950 rounded-md mb-4 p-2 flex items-center justify-center">
      REVERSO DEL DIPLOMADO
      <LuBookDown className="ml-2" size={25} />
    </div>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            className="text-[#001d51]"
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
          className="text-[#001d51]"
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>

        <label className="flex  items-center mb-4 w-full">
          <textarea
            required
            id="modularType"
            value={selectedModularContent}
            onChange={handleModularChange}
            className="textarea text-[#001d51] bg-slate-200 textarea-bordered textarea-sm w-full h-36"
            placeholder="Ingresa los Módulos correspondientes al diplomado"
          ></textarea>
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="NotaParcial"
        >
          <input 
          className="text-[#001d51]"
            required
            placeholder="Nota Parcial"
            type="text"
            id="NotaParcial"
            value={NotaParcial}
            onChange={(e) => setNotaParcial(e.target.value)}
          />
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="NotaFinal"
        >
          <input 
            className="text-[#001d51]"
            required
            placeholder="Nota Final"
            type="text"
            id="NotaFinal"
            value={NotaFinal}
            onChange={(e) => setNotaFinal(e.target.value)}
          />
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="Promedio"
        >
          <input 
            className="text-[#001d51]"
            required
            placeholder="Promedio"
            type="text"
            id="Promedio"
            value={Promedio}
            onChange={(e) => setPromedio(e.target.value)}
          />
        </label>

        <select
          required
          className="select bg-[#649bdd] text-slate-100 select-bordered w-full mb-4"
          id="imageType"
          value={selectedImageType}
          onChange={(e) => setSelectedImageType(e.target.value)}
        >
          <option defaultValue>Seleccionar tipo de certificado</option>
          <option value="tipo4 text-slate-100">Diplomado Físico</option>
        </select>

        <button
          className="btn bg-[#001d51] w-full"
          type="submit"
          disabled={setSubmitButtonDisabled}
        >
          Generar Certificado
        </button>
      </form>
    </div>
  );
};

// ParticipanteName.js


export default CertificateGenerator;
