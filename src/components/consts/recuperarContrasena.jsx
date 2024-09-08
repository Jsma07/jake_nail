import React, { useState } from 'react';
import axios from 'axios';

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post('http://localhost:5000/api/recuperarContrasena', { correo, tipo: 'cliente' });
      setMensaje('Nueva contraseña enviada al correo.');
    } catch (err) {
      setError('Error en la recuperación de contraseña.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="correo" className="block mb-2 text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md py-2 px-4">
          Enviar Nueva Contraseña
        </button>
      </form>
    </div>
  );
};

export default RecuperarContrasena;
