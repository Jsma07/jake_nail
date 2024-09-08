import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Divider } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ModalAgregarAdicion = ({
  open,
  handleClose,
  title = "",
  adiciones,
  setAdiciones,
}) => {
  const [formData, setFormData] = useState({
    NombreAdiciones: "",
    Precio: "",
    Img: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        Img: file,
      }));
    } else {
      toast.error("Por favor, selecciona un archivo de imagen.");
    }
  };

  const [precioError, setPrecioError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    return () => {
      if (formData.Img) {
        URL.revokeObjectURL(formData.Img);
      }
    };
  }, [formData.Img]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const precio = Number(formData.Precio);

    if (isNaN(precio) || precio < 5000) {
      setPrecioError(true);
      toast.error("El precio debe ser un número mayor o igual a 5000.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("NombreAdiciones", formData.NombreAdiciones);
      formDataToSend.append("Precio", formData.Precio);
      if (formData.Img) {
        formDataToSend.append("Img", formData.Img);
      }

      const response = await axios.post(
        "http://localhost:5000/Jackenail/Registraradiciones",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar la lista de adiciones en tiempo real
      setAdiciones((prevAdiciones) => [...prevAdiciones, response.data]);

      setFormData({
        NombreAdiciones: "",
        Precio: "",
        Img: null,
      });

      setPrecioError(false);
      handleClose();
      toast.success("Adición guardada correctamente");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Error al enviar el formulario. Por favor, inténtelo de nuevo."
      );
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center">
        <div
          style={{ width: "60%" }}
          className="bg-white text-black rounded-lg shadow-lg p-6 max-w-[1600px] h-auto max-h-[90%] flex flex-col relative"
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-2 text-black hover:text-gray-600"
          >
            <CloseIcon />
          </button>
          <Typography variant="h5" gutterBottom className="text-center mb-6">
            {title}
          </Typography>
          <Divider sx={{ mt: 2 }} />
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <label className="block">
                  Nombre:
                  <input
                    type="text"
                    name="NombreAdiciones"
                    value={formData.NombreAdiciones}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>
              </div>
              <div className="w-full ml-4">
                <label className="block">
                  Precio:
                  <input
                    type="number"
                    name="Precio"
                    value={formData.Precio}
                    onChange={handleInputChange}
                    style={{ borderColor: precioError ? "red" : "" }}
                    required
                    className="w-full mt-1 p-2 border rounded"
                  />
                </label>
              </div>
            </div>
            <Divider sx={{ mt: 2 }} />
            <div className="mt-4">
              <label className="block">
                Imagen:
                <input
                  type="file"
                  name="Img"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1"
                />
              </label>
              {formData.Img && (
                <div className="mt-4">
                  <Typography variant="subtitle2">Vista previa:</Typography>
                  <div className="relative mt-2 max-w-[200px] h-[200px] overflow-hidden border rounded">
                    <img
                      src={URL.createObjectURL(formData.Img)}
                      alt="Vista previa"
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="contained"
                type="submit"
                className="w-1/2 text-sm"
                style={{
                  backgroundColor: "#EF5A6F",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#e6455c" },
                }}
              >
                Guardar
              </Button>
              <Button
                variant="contained"
                onClick={handleClose}
                className="w-1/2 text-sm ml-2"
                style={{
                  backgroundColor: "#ccc",
                  color: "#000",
                  "&:hover": { backgroundColor: "#bbb" },
                }}
              >
                Cerrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAgregarAdicion;
