import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalInsumos from "../../components/consts/ModalSalida";

const SalidaInsumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/insumos");
        setInsumos(response.data);
      } catch (error) {
        console.error("Error al obtener los insumos:", error);
      }
    };

    fetchInsumos();
  }, []);

  const handleAgregarInsumo = (insumo) => {
    const insumoExistente = carrito.find(
      (item) => item.IdInsumos === insumo.IdInsumos
    );
    if (insumoExistente) {
      const nuevoCarrito = carrito.map((item) =>
        item.IdInsumos === insumo.IdInsumos
          ? {
              ...item,
              cantidad: item.cantidad + 1,
              total: (item.cantidad + 1) * item.PrecioUnitario,
            }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([
        ...carrito,
        { ...insumo, cantidad: 1, total: insumo.PrecioUnitario },
      ]);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const totalInsumos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const filteredInsumos = insumos
    .filter((insumo) =>
      insumo.NombreInsumos.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((insumo) =>
      selectedCategory ? insumo.nombre_categoria === selectedCategory : true
    );

  const categorias = [
    ...new Set(insumos.map((insumo) => insumo.nombre_categoria)),
  ];

  return (
    <div
      style={{
        paddingTop: "7px",
        margin: "0 auto",
        borderRadius: "30px",
        marginTop: "20px",
        position: "fixed",
        right: "20px",
        top: "30px",
        width: "calc(100% - 100px)",
        padding: "10px",
      }}
    >
      <div
        className="p-2 mx-auto mt-6 max-w-screen-xl"
        style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Salida de Insumos
          </h3>
          <div className="relative">
            <button
              onClick={() => setModalOpen(true)}
              className="text-2xl bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <i className="bx bx-cart text-3xl"></i>
              {totalInsumos > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-sm font-semibold text-white bg-red-500 rounded-full">
                  {totalInsumos}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center mb-3 relative ml-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Buscar insumo..."
              required
            />
          </div>

          <div className="relative ml-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarjetas de insumos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredInsumos.map((insumo) => (
            <div
              key={insumo.IdInsumos}
              className="max-w-xs bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-900 dark:border-gray-800 transition-transform transform hover:scale-105 mt-6"
            >
              <img
                src={`http://localhost:5000${insumo.imagen}`}
                alt={insumo.NombreInsumos}
                className="h-52 w-full object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {insumo.NombreInsumos}
                  </h5>
                  <span className="font-bold text-lg text-gray-900 dark:text-gray-300">
                    ${insumo.PrecioUnitario}
                  </span>
                </div>
                <p className="font-medium text-sm text-gray-600 dark:text-gray-400">
                  Cantidad en stock: {insumo.Cantidad}
                </p>
                <div className="mt-4 flex justify-center">
                  {insumo.Estado !== "Agotado" && insumo.Cantidad > 0 ? (
                    <button
                      className="px-4 py-2 text-white rounded-md shadow-md focus:outline-none focus:ring-2 transition"
                      style={{
                        backgroundColor: "#8e44ad",
                        borderColor: "#8e44ad",
                      }}
                      onClick={() => handleAgregarInsumo(insumo)}
                    >
                      <i className="bx bx-plus text-lg align-middle"></i>
                      <span className="ml-2 align-middle">Sacar insumo</span>
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 text-white rounded-md shadow-md cursor-not-allowed opacity-50"
                      style={{ backgroundColor: "#8e44ad" }}
                      disabled
                    >
                      <i className="bx bx-plus text-lg align-middle"></i>
                      <span className="ml-2 align-middle">Sacar insumo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalInsumos
        open={modalOpen}
        handleClose={handleCloseModal}
        title="Carrito de Insumos"
        carrito={carrito}
        actualizarCarrito={setCarrito}
      />
    </div>
  );
};

export default SalidaInsumos;
