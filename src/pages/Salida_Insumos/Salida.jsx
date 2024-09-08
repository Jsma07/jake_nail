import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Tabla from "../../components/consts/Tabla";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Modal, Typography, Button } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Salida = () => {
  const [salidas, setSalidas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/ListarSalidas");
        const salidasConDetalles = response.data.map((salida) => ({
          id: salida.IdSalida,
          categoria: salida.insumo.categoria.nombre_categoria,
          idInsumo: (
            <div>
              <img
                src={`http://localhost:5000${salida.insumo.Imagen}`}
                alt={salida.insumo.NombreInsumos}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                }}
              />
            </div>
          ),
          NombreInsumo: salida.insumo.NombreInsumos,
          Fecha: salida.Fecha_salida,
          Cantidad: salida.Cantidad,
          Estado:
            salida.Estado === "Terminado"
              ? "Terminado"
              : salida.Estado === "Anulado"
              ? "Anulado"
              : "Desconocido",
          Acciones: (
            <div className="flex space-x-2">
              <Fab
                size="small"
                aria-label="view"
                onClick={() => handleOpenModal(salida)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white"
              >
                <RemoveRedEyeIcon />
              </Fab>

              {salida.Estado !== "Anulado" && (
                <Fab
                  size="small"
                  aria-label="anular"
                  onClick={() => handleAnular(salida)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-white"
                >
                  <DeleteIcon />
                </Fab>
              )}
            </div>
          ),
          estiloFila: salida.Estado === "Terminado" ? "bg-gray-200" : "",
        }));
        setSalidas(salidasConDetalles);
      } catch (error) {
        console.error("Error al obtener los datos de salidas:", error);
      }
    };

    fetchSalidas();
  }, []);

  const handleAnular = async (salida) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres anular esta salida?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Anula la salida
          await axios.patch(
            `http://localhost:5000/salidas/${salida.IdSalida}`,
            { nuevoEstado: "Anulado" }
          );

          // Restaura la cantidad en los insumos
          await axios.put(
            `http://localhost:5000/api/existenciainsumos/editar/${salida.insumo.IdInsumos}`,
            { Cantidad: salida.insumo.Cantidad + salida.Cantidad } // Devuelve la cantidad a la existencia
          );

          // Actualiza el estado local
          setSalidas((prevSalidas) =>
            prevSalidas.map((item) =>
              item.id === salida.IdSalida
                ? { ...item, Estado: "Anulado", estiloFila: "bg-gray-200" }
                : item
            )
          );

          toast.success(
            "La salida se ha anulado y la cantidad ha sido restaurada.",
            {
              position: "bottom-right",
              autoClose: 3000,
            }
          );
        } catch (error) {
          console.error("Error al anular la salida:", error);
          Swal.fire("Error!", "No se pudo anular la salida.", "error");
        }
      }
    });
  };

  const handleOpenModal = (salida) => {
    setDescripcion(salida.Descripcion || "Descripción no disponible");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: "categoria", headerName: "Categoría" },
    { field: "idInsumo", headerName: "Insumo" },
    { field: "NombreInsumo", headerName: "Nombre Insumo" },
    { field: "Fecha", headerName: "Fecha" },
    { field: "Cantidad", headerName: "Cantidad" },
    { field: "Estado", headerName: "Estado" },
    { field: "Acciones", headerName: "Acciones" },
  ];

  return (
    <div>
      <Tabla
        title="Gestión de Salidas de Insumos"
        columns={columns}
        data={salidas}
        rowClassName={(row) => row.estiloFila}
      />

      <Link to="/Registrarsalida">
        <Fab
          aria-label="add"
          style={{
            border: "0.5px solid grey",
            backgroundColor: "#94CEF2",
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 1000,
          }}
        >
          <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
        </Fab>
      </Link>

      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-[80%] max-w-lg">
            <Typography variant="h6" gutterBottom>
              Descripción de la Salida
            </Typography>
            <Typography variant="body1" gutterBottom>
              {descripcion}
            </Typography>
            <Button
              onClick={handleCloseModal}
              sx={{
                backgroundColor: "#EF5A6F",
                color: "#fff",
                "&:hover": { backgroundColor: "#e6455c" },
              }}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Salida;
