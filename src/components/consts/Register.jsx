import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Correo: '',
    Telefono: '',
    Documento: '',
    tipoDocumento: '',
    Contrasena: '',
    Estado: 1,
    IdRol: 4
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { Nombre, Apellido, Correo, Telefono, Documento, tipoDocumento, Contrasena } = formData;
    if (!Nombre || !Apellido || !Correo || !Telefono || !Documento || !tipoDocumento || !Contrasena) {
      toast.error("Todos los campos son obligatorios.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    const numeroRegex = /^[0-9]+$/;
    if (!nameRegex.test(Nombre)) {
      toast.error("El nombre solo puede contener letras y espacios.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (Telefono.length < 9 || Telefono.length >15 ) {
      toast.error("El telefeno debe contener entre 9 y 15 números.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (Nombre.length < 4 || Nombre.length >20 ) {
      toast.error("El nombre debe contener entre 4 y 20 letras.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (Apellido.length < 4 || Apellido.length >20 ) {
      toast.error("El apellido debe contener entre 4 y 20 letras.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (Documento.length < 8 || Documento.length >17 ) {
      toast.error("El documento debe contener entre 8 y 17 números.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!nameRegex.test(Apellido)) {
      toast.error("El Apellido solo puede contener letras y espacios.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!numeroRegex.test(Documento)) {
      toast.error("El Documento solo puede contener números.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (!numeroRegex.test(Telefono)) {
      toast.error("El Teléfono solo puede contener números.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    const validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const correoSinEspacios = Correo.trim();

    if (!validacionCorreo.test(correoSinEspacios)) {
      toast.error("El Correo no tiene un formato válido.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    
    const validacionContrasena = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!validacionContrasena.test(Contrasena)) {
      toast.error("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const response = await axios.post("http://localhost:5000/Jackenail/RegistrarClientes", formData);

    toast.success("El cliente se ha registrado correctamente.", {
      position: "bottom-right",
      autoClose: 3000,
    });

    setFormData({
      Nombre: '',
      Apellido: '',
      Correo: '',
      Telefono: '',
      Documento: '',
      tipoDocumento: '',
      Contrasena: ''
    });
  } catch (error) {
    if (error.response) {
      console.error("Error al registrar el cliente:", error.response.data);
      console.error("Status code:", error.response.status);
      console.error("Headers:", error.response.headers);
      
      // Mostrar detalles específicos del error de validación
      if (error.response.data && error.response.data.errores) {
        error.response.data.errores.forEach(err => {
          toast.error(`Error en ${err.campo}: ${err.mensaje}`, {
            position: "bottom-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(`Error: ${error.response.data.mensaje}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      toast.error("No se recibió respuesta del servidor.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } else {
      console.error("Error al configurar la solicitud:", error.message);
      toast.error("Error al configurar la solicitud.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
    console.error("Error config:", error.config);
  }
};


  return (
   
    <div className="bg-pink-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-800 bottom-0 leading-5 h-full w-full overflow-hidden">
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="absolute top-0 left-0 p-4">
          <img src="/jacke.png" alt="Logo" className="h-16 rounded-full" />
        </div>
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-300">
            <h1 className="my-7 font-semibold text-4xl">Jake Nails</h1>
            <p className="pr-3 text-sm opacity-75">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups</p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-96">
            <div className="mb-7 text-center">
              <h3 className="font-semibold text-2xl text-gray-800">Regístrate</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
              >
                <option value="" disabled>Tipo de documento</option>
                <option value="C.C">Cédula de ciudadania</option>
                <option value="C.E">Cédula de extranjeria</option>
                {/* Añade más opciones según tus necesidades */}
              </select>
              <input
                name="Documento"
                value={formData.Documento}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Número de documento: "
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="Nombre:"
                />
                <input
                  name="Apellido"
                  value={formData.Apellido}
                  onChange={handleChange}
                  className="text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                  type="text"
                  placeholder="Apellido:"
                />
              </div>
              <input
                name="Telefono"
                value={formData.Telefono}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Telefono: "
              />
              <input
                name="Correo"
                value={formData.Correo}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="email"
                placeholder="Correo Electrónico: "
              />
              <input
                name="Contrasena"
                value={formData.Contrasena}
                onChange={handleChange}
                className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                type="password"
                placeholder="Contraseña:"
              />
              <button
                type="submit"
                className="w-full flex justify-center bg-purple-800 hover:bg-purple-700 text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
              >
                Registrarse
              </button>
              <p className="text-gray-400 text-center">¿Ya tienes una cuenta? <a href="/iniciarSesion" className="text-sm text-purple-700 hover:text-purple-700">Inicia sesión</a></p>
            </form>
            <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Register;
