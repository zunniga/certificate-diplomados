import React, { useState, useEffect } from 'react';
import { ImageDatabase } from './ImageUploaderDB'; // Asegúrate de importar la clase ImageDatabase desde donde se encuentra definida

const imageDB = new ImageDatabase();

const CertificateGenerator = () => {
  const [CursoName, setCursoName] = useState('');
  const [FechaInicio, setFechaInicio] = useState('');
  const [FechaFin, setFechaFin] = useState('');
  const [NotaParcial, setNotaParcial] = useState('');
  const [NotaFinal, setNotaFinal] = useState('');
  const [Promedio, setPromedio] = useState('');
  const [Resolucion, setResolucion] = useState('');
  const [ParticipanteName, setParticipanteName] = useState('');
  const [CodigoParticipante, setCodigoParticipante] = useState('');
  const [digitalImageDataURL, setDigitalImageDataURL] = useState(null);
  const [physicalImageDataURL, setPhysicalImageDataURL] = useState(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [selectedImageType, setSelectedImageType] = useState('');

  useEffect(() => {
   
  }, []);

  const checkFields = () => {
    if (
      CursoName &&
      FechaInicio &&
      FechaFin &&
      NotaParcial &&
      NotaFinal &&
      Promedio &&
      Resolucion &&
      ParticipanteName &&
      CodigoParticipante &&
      selectedImageType
    ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  useEffect(() => {
    checkFields();
  }, [CursoName,NotaParcial ,NotaFinal ,Promedio , FechaInicio, FechaFin, Resolucion, ParticipanteName, CodigoParticipante, digitalImageDataURL, physicalImageDataURL]);

  useEffect(() => {
    loadSelectedImages();
  }, [selectedImageType]);

  const loadSelectedImages = async () => {
    try {
      const images = await imageDB.images.toArray();
      if (images.length > 0) {
        const digitalImage = images.find(image => image.name === 'imgCertiDigital');
        const physicalImage = images.find(image => image.name === 'imgCertiPhisyc');

        if (digitalImage) {
          setDigitalImageDataURL(digitalImage.imageDataURL);
          console.log('Imagen digital obtenida de la base de datos:', digitalImage);
        } else {
          console.log('No se encontró una imagen digital.');
        }

        if (physicalImage) {
          setPhysicalImageDataURL(physicalImage.imageDataURL);
          console.log('Imagen física obtenida de la base de datos:', physicalImage);
        } else {
          console.log('No se encontró una imagen física.');
        }
      } else {
        console.log('No se encontraron imágenes en la base de datos.');
      }
    } catch (error) {
      console.error('Error al cargar las imágenes desde la Base de Datos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (CursoName && FechaInicio && (digitalImageDataURL || physicalImageDataURL)) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Configuraciones de tamaño y fuente del canvas
      canvas.width = 4677;
      canvas.height = 3307;

      function formatearFechaInicio(fecha) {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const partes = fecha.split('-');
        const mes = meses[parseInt(partes[1], 10) - 1];
        const dia = partes[2];
        return dia + ' de ' + mes;
      }

      function formatearFechaFin(fecha) {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const partes = fecha.split('-');
        const mes = meses[parseInt(partes[1], 10) - 1];
        return `${partes[2]} de ${meses[mes]} del ${partes[0]}`;
      }

      const fechaInicioFormateada = formatearFechaInicio(FechaInicio);
      const fechaFinFormateada = formatearFechaFin(FechaFin);

      const generateCertificate = (imageDataURL, type) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = imageDataURL;

          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = '#000000';
            ctx.font = '50px Arial';
            ctx.textBaseline = 'top';

            // Dibujar textos en el canvas
            ctx.textAlign = "center";
            ctx.font = 'bold 50px Arial';
            ctx.fillText(CursoName, 1300, 670);

            ctx.font = 'bold 65px Arial';
            ctx.fillText(ParticipanteName, 1300, 540);

            ctx.font = 'bold 65px Arial';
            ctx.fillText(Resolucion, 700, 540);

            ctx.fillStyle = "black";
            ctx.font = 'bold 25px Arial';
            ctx.fillText(Ponente, 300, 370);

            ctx.font = 'bold 30px Arial';
            ctx.fillText(CodigoParticipante, 308, 1198);

            // Dividir y dibujar texto de organización, fechas y horas
            const textoCompleto = `Cursito organizado por la Corporación ECOMÁS, llevado a cabo desde el ${fechaInicioFormateada} hasta el ${fechaFinFormateada} con una duración de ${HorasAcademicas} horas académicas.`;
            const lineas = dividirTextoEnLineas(textoCompleto, 700, ctx);
            let y = 800;

            lineas.forEach(linea => {
              ctx.fillText(linea, 1300, y);
              y += 40;
            });

            // Dibujar temario
            const palabras = Temario.split('\n');
            let x = 110;
            y = 485;

            palabras.forEach(linea => {
              const palabrasLinea = linea.split(' ');
              let lineaActual = '';

              palabrasLinea.forEach(palabra => {
                if (ctx.measureText(lineaActual + palabra).width > 400) {
                  ctx.fillText(lineaActual, x, y);
                  y += 40;
                  lineaActual = palabra + ' ';
                } else {
                  lineaActual += palabra + ' ';
                }
              });
              ctx.fillText(lineaActual, x, y);
              y += 40;
            });

            // Convertir el canvas a dataURL y resolver la promesa
            const certificateDataURL = canvas.toDataURL('image/jpeg');
            resolve({ certificateDataURL, type, ownerName: ParticipanteName });
          };

          img.onerror = (error) => {
            reject(error);
          };
        });
      };

      const certificatesToSave = [];

      if (selectedImageType === 'tipo4') {
        if (digitalImageDataURL) {
          certificatesToSave.push(generateCertificate(digitalImageDataURL, 'certificadoDigital'));
        }
        if (physicalImageDataURL) {
          certificatesToSave.push(generateCertificate(physicalImageDataURL, 'certificadoFisico'));
        }
      } else {
        alert('No se ha seleccionado ningún tipo de certificado.');
        return;
      }

      Promise.all(certificatesToSave)
        .then(certificates => Promise.all(certificates.map(cert => imageDB.certificates.add(cert))))
        .then(() => {
          alert('¡Certificado generado exitosamente!');
          window.location.href = '/cursos';
        })
        .catch(error => {
          console.error('Error al guardar el certificado en la base de datos:', error);
        });
    } else {
      alert('Por favor completa todos los campos antes de generar el certificado.');
    }
  };

  const dividirTextoEnLineas = (texto, maxWidth, ctx) => {
    const words = texto.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
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
        <div className=' text-center bg-slate-900 border border-zinc-950 rounded-md mb-4 p-2 '> ANVERSO DEL DIPLOMADO </div>
      <label className='input input-bordered flex items-center mb-4' htmlFor="CursoName">
          <input
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
      <label className='input input-bordered flex items-center mb-4' htmlFor="ParticipanteName">
          <input
            placeholder="Nombre del participante"
            type="text"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="CodigoParticipante">
          <input
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="Resolucion">
          <input
            placeholder="Resolucion"
            type="text"
            id="Resolucion"
            value={Resolucion}
            onChange={(e) => setResolucion(e.target.value)}
          />
         </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="FechaInicio">
          <input
            placeholder="Fecha de inicio"
            type="date"
            id="FechaInicio"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="FechaFin">
          <input
            placeholder="Fecha de fin"
            type="date"
            id="FechaFin"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label> 
       

        <div className=' text-center bg-slate-900 border border-zinc-950 rounded-md mb-4 p-2 '> REVERSO DEL DIPLOMADO </div>
      <label className='input input-bordered flex items-center mb-4' htmlFor="CursoName">
          <input
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="CodigoParticipante">
          <input
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
      <label className='input input-bordered flex items-center mb-4' htmlFor="NotaParcial">
          <input
            placeholder="Nota Parcial"
            type="text"
            id="NotaParcial"
            value={NotaParcial}
            onChange={(e) => setNotaParcial(e.target.value)}
          />
        </label>

        <label className='input input-bordered flex items-center mb-4' htmlFor="NotaFinal">
          <input
            placeholder="Nota Final"
            type="text"
            id="NotaFinal"
            value={NotaFinal}
            onChange={(e) => setNotaFinal(e.target.value)}
          />
        </label>

        <label className='input input-bordered flex items-center mb-4' htmlFor="Promedio">
          <input
            placeholder="Promedio"
            type="text"
            id="Promedio"
            value={Promedio}
            onChange={(e) => setPromedio(e.target.value)}
          />
        </label>
       
      
        <select className='select select-bordered w-full mb-4' id="imageType" value={selectedImageType} onChange={(e) => setSelectedImageType(e.target.value)}>
          <option defaultValue>Seleccionar tipo de certificado</option>
          <option value="tipo4">Diplomado Físico</option>
        </select>

      
        <button className="btn w-full" type="submit" disabled={submitButtonDisabled}>Generar Certificado</button>
      </form>

    </div>
  );
};

export default CertificateGenerator;
