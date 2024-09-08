import React, { useEffect, useState } from "react";
import axios from "axios";
import TablePrueba from "../../components/consts/Tabla";
import ModalDinamico from "../../components/consts/Modaladi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Fab from "@mui/material/Fab";

const ListarAdiciones = () => {
  const [adiciones, setAdiciones] = useState([]);
  const [selectedAdicion, setSelectedAdicion] = useState(null);
  const [formData, setFormData] = useState({
    NombreAdiciones: "",
    Precio: "",
    Img: null,
  });
  const [precioError, setPrecioError] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "Precio") {
      // Limitar el valor a números enteros positivos
      const cleanValue = value.replace(/[^0-9]/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: cleanValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Asegúrate de que este evento sea del formulario

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

      // Enviar datos al servidor
      const response = await axios.post(
        "http://localhost:5000/Jackenail/Registraradiciones",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Asegúrate de que response.data tenga la estructura esperada
      console.log("Datos recibidos del servidor:", response.data);

      // Actualizar la lista de adiciones
      setAdiciones((prevAdiciones) => [...prevAdiciones, response.data]);

      // Limpiar los datos del formulario después de enviar
      setFormData({
        NombreAdiciones: "",
        Precio: "",
        Img: null,
      });

      setPrecioError(false);
      setOpenModal(false);
      toast.success("Adición guardada correctamente");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error(
        "Error al enviar el formulario. Por favor, inténtelo de nuevo."
      );
    }
  };

  const columns = [
    { field: "IdAdiciones", headerName: "ID" },
    {
      field: "Imagen",
      headerName: "Imagen",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src={`http://localhost:5000${params.row.Img}`}
            alt={params.row.NombreAdiciones}
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
    },
    { field: "NombreAdiciones", headerName: "Nombre" },
    { field: "Precio", headerName: "Precio", type: "number" },
    {
      field: "Estado",
      headerName: "Estado",
      renderCell: (params) =>
        renderEstadoButton(params.row.Estado, params.row.IdAdiciones),
    },
  ];

  const renderEstadoButton = (estado, adicionId) => {
    let buttonClass, estadoTexto;

    switch (estado) {
      case 1:
        buttonClass = "bg-green-500";
        estadoTexto = "Activo";
        break;
      case 2:
        buttonClass = "bg-red-500";
        estadoTexto = "Inactivo";
        break;
      default:
        buttonClass = "bg-gray-500";
        estadoTexto = "Desconocido";
    }

    return (
      <button
        className={`px-3 py-1.5 text-white text-sm font-medium rounded-lg shadow-md focus:outline-none ${buttonClass}`}
        onClick={() => handleEstadoClick(adicionId, estado)}
      >
        {estadoTexto}
      </button>
    );
  };

  const handleEstadoClick = (adicionId, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 2 : 1;

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas cambiar el estado de la adición a ${nuevoEstado}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`http://localhost:5000/Jackenail/CambiaEstado/${adicionId}`, {
            Estado: nuevoEstado,
          })
          .then((response) => {
            setAdiciones((prevAdiciones) =>
              prevAdiciones.map((adicion) =>
                adicion.IdAdiciones === adicionId
                  ? { ...adicion, Estado: nuevoEstado }
                  : adicion
              )
            );
            toast.success("Estado actualizado correctamente");
          })
          .catch((error) => {
            toast.error(
              `Error al actualizar el estado: ${
                error.response ? error.response.data.mensaje : error.message
              }`
            );
          });
      }
    });
  };

  const handleCrearUsuarioClick = () => {
    setSelectedAdicion(null);
    setOpenModal(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/Jackenail/Listarventas/adiciones")
      .then((response) => {
        setAdiciones(response.data);
      })
      .catch((error) => {
        toast.error("Error al obtener las adiciones");
      });
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar el componente

  return (
    <div>
      <TablePrueba
        title="Gestión de Adiciones"
        columns={columns}
        data={adiciones}
      />
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
        onClick={handleCrearUsuarioClick}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>
      <ModalDinamico
        open={openModal}
        handleClose={() => setOpenModal(false)}
        title="Agregar"
        fields={[
          {
            name: "NombreAdiciones",
            label: "Nombre",
            type: "text",
            value: formData.NombreAdiciones,
            onChange: handleInputChange,
            inputProps: {
              pattern: "^[A-Za-zñÑ]+$",
              title: "El nombre solo puede contener letras y la letra ñ.",
            },
          },
          {
            name: "Precio",
            label: "Precio",
            type: "number",
            value: formData.Precio,
            onChange: handleInputChange,
            inputProps: {
              min: 5000,
              step: 100,
            },
          },
          {
            name: "Img",
            label: "Imagen",
            type: "file",
            onChange: (e) => {
              setFormData((prevData) => ({
                ...prevData,
                Img: e.target.files[0],
              }));
            },
          },
        ]}
        onSubmit={handleFormSubmit}
        precioError={precioError}
      />
    </div>
  );
};

export default ListarAdiciones;
