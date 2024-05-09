import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const YourComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estado local para almacenar los tipos de certificados seleccionados
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const handleButtonClick = () => {
    setShowDialog(true);
  };

  // Cargar el estado inicial desde el localStorage al inicio
  useEffect(() => {
    const storedCertificates = localStorage.getItem('selectedCertificates');
    if (storedCertificates) {
      setSelectedCertificates(JSON.parse(storedCertificates));
    }
  }, []);

  // Función para manejar el cambio de estado cuando se selecciona un certificado
  const handleCheckboxChange = (index: number, type: string) => {
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

  // Función para manejar el clic en el botón "Ir a generar Certificados"
  const handleGenerateCertificates = () => {
    console.log(selectedCertificates);
  };
  // Verificar si algún checkbox está seleccionado
  const isAnyCheckboxSelected = selectedCertificates.length > 0;

  const handleLogin = () => {
    // Verificar si el usuario y la contraseña son válidos
    if (username === "tuUsuario" && password === "tuContraseña") {
      // Redirigir al usuario a la página /cursos/subirImages
      router.push("/cursos/subirImages");
    } else {
      // Mostrar un mensaje de error o tomar otra acción según sea necesario
      alert("Usuario o contraseña incorrectos");
    }
  };


  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {/* Tu contenido actual */}
      <main className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold tracking-tight text-gray-500 sm:text-5xl md:text-6xl p-6 mb-8">
          <span className="block">
            Certificados para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
              {" "}
              CURSOS
            </span>
          </span>
        </h1>
        <h2>Por favor seleccione qué tipo de certificados se va a generar: </h2>
        <div className="flex flex-row">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex">
              <div className="flex items-end">
                <input
                  className="checkbox checkbox-info checkbox-lg mb-2 mr-1"
                  type="checkbox"
                  onChange={() =>
                    handleCheckboxChange(
                      index,
                      index === 0 ? "certificadoDigital" : index === 1 ? "certificadoFisico" : "certificadoOnly"
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <Link href="/cursos" passHref legacyBehavior>
          <button className={`btn btn-info btn-lg mt-8 ${!isAnyCheckboxSelected ? "disabled:opacity-50 cursor-not-allowed" : ""}`} onClick={handleGenerateCertificates} disabled={!isAnyCheckboxSelected}>
            Ir a generar Certificados
          </button>
        </Link>
      </main>
      {/* ... */}

      {/* Botón para abrir el diálogo de inicio de sesión */}
      <button
        className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleButtonClick}
      >
        Iniciar sesión
      </button>

      {/* Diálogo de inicio de sesión */}
      {showDialog && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full border border-gray-300 rounded px-4 py-2 mb-4"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border border-gray-300 rounded px-4 py-2 mb-4"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Iniciar sesión y continuar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default YourComponent;
