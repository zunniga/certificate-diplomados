import React, { useState, useEffect } from 'react';
import { ImageDatabase } from './ImageUploaderDB'; // Asegúrate de importar la clase ImageDatabase desde donde se encuentra definida

const imageDB = new ImageDatabase();

const CertificateGenerator = () => {
  const [CursoName, setCursoName] = useState('');
  const [FechaInicio, setFechaInicio] = useState('');
  const [FechaFin, setFechaFin] = useState('');
  const [Ponente, setPonente] = useState('');
  const [Temario, setTemario] = useState('');
  const [HorasAcademicas, setHorasAcademicas] = useState('');
  const [ParticipanteName, setParticipanteName] = useState('');
  const [CodigoParticipante, setCodigoParticipante] = useState('');
  const [imageDataURL, setImageDataURL] = useState(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [selectedImageType, setSelectedImageType] = useState(''); // Nuevo estado para almacenar el tipo de imagen seleccionado

  useEffect(() => {
    const textarea = document.getElementById('Temario');
    textarea.placeholder = "Temario (Cada tema separado por un salto de línea) \nTema 1 \nTema 2 \nTema 3";

  }, []);
  // Función para verificar si todos los campos requeridos están llenos
  const checkFields = () => {
    if (
      CursoName &&
      FechaInicio &&
      FechaFin &&
      Ponente &&
      Temario &&
      HorasAcademicas &&
      ParticipanteName &&
      CodigoParticipante &&
      selectedImageType
    ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };
  // Llama a checkFields cada vez que uno de los campos cambie
  useEffect(() => {
    checkFields();
  }, [CursoName, FechaInicio, FechaFin, Ponente, Temario, HorasAcademicas, ParticipanteName, CodigoParticipante, imageDataURL]);

  useEffect(() => {
    loadSelectedImage();
  }, [selectedImageType]);
  // Función para cargar la imagen correspondiente según el tipo seleccionado
  const loadSelectedImage = async () => {
    try {
      const images = await imageDB.images.toArray(); // Obtener todos los elementos de la base de datos
      if (images.length > 0) {
        // Obtener la imagen correspondiente al tipo seleccionado
        const selectedImage = images.find(image => {
          // Verificamos si el nombre de la imagen coincide con los nombres específicos
          return image.name === 'imgCertiDigital' && selectedImageType === 'tipo1' ||
            image.name === 'imgCertiPhisyc' && selectedImageType === 'tipo2' ||
            image.name === 'imgCertiOnly' && selectedImageType === 'tipo3';
        });
        if (selectedImage) {
          setImageDataURL(selectedImage.imageDataURL);
          console.log('Imagen obtenida de la base de datos:', selectedImage);
        } else {
          console.log('No se encontró una imagen para el tipo seleccionado.');
        }
      } else {
        console.log('No se encontraron imágenes en la base de datos.');
      }
    } catch (error) {
      console.error('Error al cargar la imagen desde la Base de Datos:', error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // Cargar datos iniciales antes de procesar el envío del formulario


    // Verificar si todos los campos están llenos antes de generar el certificado
    if (CursoName && FechaInicio && imageDataURL) {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 46770; // Ancho de tu imagen
      canvas.height = 3307; // Alto de tu imagen

      const img = new Image();
      img.src = imageDataURL;  // Usar la imagen cargada por el usuario

      // Función para formatear una fecha en el formato "dd de mm del aaaa"
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
        const año = partes[0];
        const mes = meses[parseInt(partes[1], 10) - 1];
        const dia = partes[2];
        return dia + ' de ' + mes + ' del ' + año;
      }
      // Formatear las fechas de inicio y fin
      const fechaInicioFormateada = formatearFechaInicio(FechaInicio);
      const fechaFinFormateada = formatearFechaFin(FechaFin);
      console.log(fechaInicioFormateada);
      console.log(fechaFinFormateada);

      img.onload = () => {
        if (ctx) {
          ctx.textAlign = 'justify';
          ctx.drawImage(img, 0, 0);

          ctx.fillStyle = '#000000'; // Color del texto
          ctx.font = '50px Arial'; // Fuente del nombre
          ctx.textBaseline = 'top';

          ctx.textAlign = "center";
          ctx.font = 'bold 50px  Arial';
          ctx.fillText(CursoName, 1300, 670);

          ctx.textAlign = "center";
          ctx.font = 'bold 65px Arial'; // 
          ctx.fillText(ParticipanteName, 1300, 540);

          ctx.textAlign = "center";
          ctx.fillStyle = "white";
          ctx.font = 'bold 25px Arial'; // 
          ctx.fillText(Ponente, 300, 370);

          ctx.textAlign = "center";
          ctx.fillStyle = "white";
          ctx.font = 'bold 30px Arial  ';
          ctx.fillText(CodigoParticipante, 308, 1198);

          //TEXTO DE ORGANIZACION, FECHAS Y HORAS
          var tamanoFuente = 35; // Tamaño de fuente en píxeles
          var textoCompleto = 'Cursito oganizado por la Corporación ECOMÁS, llevado a cabo desde el ' + fechaInicioFormateada + ' hasta el ' + fechaFinFormateada + ' con una duración de ' + HorasAcademicas + ' horas académicas.';
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
          var anchoMaximo = 400; // Ajusta este valor según tus necesidades

          ctx.fillStyle = "white";
          ctx.textAlign = "left";
          ctx.font = '25px bold Arial';
          var palabras = Temario.split('\n');

          var x = 110; // Posición x inicial
          var y = 485; // Posición y inicial

          palabras.forEach(function (linea, index) {
            // Dividir la línea en palabras
            var palabrasLinea = linea.split(' ');
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
          });

          // Resto del código para dibujar el certificado...
          const imageDataURL = canvas.toDataURL('image/jpeg');

          // Guardar el certificado en la tabla de certificados generados
          let certificateType; // Variable para almacenar el tipo de certificado
          switch (selectedImageType) {
            case 'tipo1':
              certificateType = 'certificadoDigital';
              break;
            case 'tipo2':
              certificateType = 'certificadoFisico';
              break;
            case 'tipo3':
              certificateType = 'certificadoOnly';
              break;
            default:
              throw new Error('No se ha seleccionado ningún tipo de certificado.'); // Lanzar un error si no se selecciona ningún tipo
          }

          // Modificar la llamada al método add para incluir el nombre del participante en ownerName
          imageDB.certificates.add({ certificateDataURL: imageDataURL, type: certificateType, ownerName: ParticipanteName }).then(() => {
            // O simplemente mostrar un mensaje de éxito
            console.log(imageDataURL);
            alert('¡Certificado generado exitosamente!');
          }).catch(error => {
            console.error('Error al guardar el certificado en la base de datos:', error);
          });
          // Redireccionar a otra página o realizar otra acción
          window.location.href = '/cursos'; // Redireccionar a otra página
        } else {
          // Crear un array con los nombres de los campos que faltan
          const camposFaltantes = [];
          if (!CursoName) camposFaltantes.push('Nombre del curso');
          if (!FechaInicio) camposFaltantes.push('Fecha de inicio');
          if (!FechaFin) camposFaltantes.push('Fecha de finalización');
          if (!Ponente) camposFaltantes.push('Ponente');
          if (!Temario) camposFaltantes.push('Temario');
          if (!HorasAcademicas) camposFaltantes.push('Horas académicas');
          if (!ParticipanteName) camposFaltantes.push('Nombre del participante');
          if (!CodigoParticipante) camposFaltantes.push('Código del participante');
          if (!imageDataURL) camposFaltantes.push('Imagen');

          alert(`Por favor completa los siguientes campos antes de generar el certificado: ${camposFaltantes.join(', ')}.`);
        }
      };
    }
  }
  return (
    <div>
      <form method="dialog" onSubmit={handleSubmit}>

        <label className='input input-bordered flex items-center mb-4' htmlFor="CursoName">
          <input
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
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
            placeholder="Fecha de finalización"
            type="date"
            id="FechaFin"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <label className='input input-bordered flex items-center mb-4' htmlFor="Ponente">
          <input
            placeholder="Ponente"
            type="text"
            id="Ponente"
            value={Ponente}
            onChange={(e) => setPonente(e.target.value)}
          />
        </label>
        <label className=' flex items-center mb-4 w-full' htmlFor="Temario">
          <textarea id="Temario" onChange={(e) => setTemario(e.target.value)} value={Temario} className="textarea textarea-bordered textarea-sm w-full h-36" ></textarea>

        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="HorasAcademicas">
          <input
            placeholder="HorasAcademicas"
            type="text"
            id="HorasAcademicas"
            value={HorasAcademicas}
            onChange={(e) => setHorasAcademicas(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="ParticipanteName">
          <input
            placeholder="ParticipanteName"
            type="text"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label className='input input-bordered flex items-center mb-4' htmlFor="CodigoParticipante">
          <input
            placeholder="CodigoParticipante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        {/* Agregar select para elegir el tipo de imagen */}
        <select className='select select-bordered w-full mb-4' id="imageType" value={selectedImageType} onChange={(e) => setSelectedImageType(e.target.value)}>
          <option defaultValue>Seleccionar tipo de certificado</option>
          <option value="tipo1">Certificado Digital</option>
          <option value="tipo2">Certificado Físico</option>
          <option value="tipo3">Certificado Solo Empresa</option>
        </select>
        <button className="btn w-full" type="submit" disabled={submitButtonDisabled}>Generar Certificado</button>
      </form>

    </div>
  );
};

export default CertificateGenerator;
