import React, { useState, useEffect } from "react";
import CustomSwitch from "../../components/consts/switch";
import AddRoleModal from "./ModalRol";
import ModalEditar from "./ModalEditar";
import Table from "../../components/consts/Tabla";
import axios from "axios";
import { Fab } from "@mui/material";
import ModalPermisos from "./modalPermisos";
import { toast, ToastContainer } from "react-toastify";


const Roles = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [openPermisosModal, setOpenPermisosModal] = useState(false);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [buscar, setBuscar] = useState("");

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/roles");
      if (response.data && Array.isArray(response.data)) {
        const rolesWithPermissions = response.data.map((role) => ({
          ...role,
          permisos: role.permisos || [],
        }));
        setRoles(rolesWithPermissions);
      } else {
        console.error("Data received is empty or malformed:", response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleToggleSwitch = async (id) => {
    if(id=== 1 || id ===2 || id===4){
      toast.error("No se puede desactivar este rol.", {
        position: "bottom-right",
        autoClose: 3000, 
      });
      return;
    }
    const updatedRoles = roles.map((rol) =>
      rol.idRol === id
        ? { ...rol, EstadoRol: rol.EstadoRol === 1 ? 0 : 1 }
        : rol
    );

    try {
      const updatedRole = updatedRoles.find((rol) => rol.idRol === id);
      if (!updatedRole) {
        console.error("No se encontró el rol actualizado");
        return;
      }

      const result = await window.Swal.fire({
        icon: "warning",
        title: "¿Estás seguro?",
        text: "¿Quieres cambiar el estado del rol?",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.put(
          `http://localhost:5000/api/editarRol/${id}`,
          {
            EstadoRol: updatedRole.EstadoRol,
            nombre: updatedRole.nombre,
            permisos: updatedRole.permisos.map((permiso) => permiso.idPermiso),
          }
        );

        if (response.status === 200) {
          setRoles(updatedRoles);
          toast.success("El estado del rol ha sido actualizado.", {
            position: "bottom-right",
            autoClose: 3000, // Cierra automáticamente después de 3 segundos
          });
        }
      }
    } catch (error) {
      console.error("Error al cambiar el estado del rol:", error);
      toast.error("Hubo un error al cambiar el estado del rol. Por favor, inténtalo de nuevo más tarde.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
    }
  };

  const filtrar = roles.filter((rol) => {
    const { nombre = "", permisos = [] } = rol;

    const nombreRol = nombre.toLowerCase().includes(buscar.toLowerCase());

    const permisosAsociados = permisos && permisos.some((p) =>
      p.nombre && p.nombre.toLowerCase().includes(buscar.toLowerCase())
    );

    return nombreRol || permisosAsociados;
  });

  const handleEditClick = (id) => {
    if (id === 1 || id === 2 || id === 4) {
      toast.error("No se puede editar este rol.", {
        position: "bottom-right",
        autoClose: 3000, // Cierra automáticamente después de 3 segundos
      });
      return;
    }
    setSelectedRoleId(id);
  };

  const handleViewDetailsClick = (permisos) => {
    setSelectedPermisos(permisos);
    setOpenPermisosModal(true);
  };

  const handleClosePermisosModal = () => {
    setOpenPermisosModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedRoleId(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRoleId(null);
  };

  // Función para agregar un nuevo rol, siempre activo
  const handleAddRole = (newRole) => {
    // Asignar un ID único al nuevo rol y EstadoRol a 1
    const newRoleWithDefaults = { ...newRole, idRol: roles.length + 1, EstadoRol: 1 };
    setRoles([...roles, newRoleWithDefaults]);
    setOpenModal(false); // Cerrar el modal de creación
  };

  const columns = [
    { field: "idRol", headerName: "ID", width: "w-16" },
    { field: "nombre", headerName: "Nombre", width: "w-36" },
    {
      field: "permisos",
      headerName: "Modulo Permiso",
      width: "w-36",
      renderCell: (params) => (
        <ul style={{ textAlign: "center" }}>
          <button
            onClick={() => handleViewDetailsClick(params.row.permisos)}
            className="text-blue-500"
          >
            <i class="bx bx-show-alt" style={{ fontSize: "24px" }}></i>
          </button>
        </ul>
      ),
    },
    {
      field: "Acciones",
      headerName: "Acciones",
      width: "w-48",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4">
          {params.row.EstadoRol === 1 && ![1, 2, 4].includes(params.row.idRol) && (
            <button
              onClick={() => handleEditClick(params.row.idRol)}
              className="text-yellow-500"
            >
              <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
            </button>
          )}
    { ![1, 2, 4].includes(params.row.idRol) &&(
          <CustomSwitch
            active={params.row.EstadoRol === 1}
            onToggle={() => handleToggleSwitch(params.row.idRol)}
          />
        )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table title="Gestion de Roles" columns={columns} data={filtrar} />
      <AddRoleModal
        open={openModal && selectedRoleId === null}
        handleClose={handleCloseModal}
        setRoles={setRoles}
        onAddRole={handleAddRole} // Pasar la función para agregar rol
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
        onClick={handleOpenModal}
      >
        <i className="bx bx-plus" style={{ fontSize: "1.3rem" }}></i>
      </Fab>

      <ModalEditar
        open={selectedRoleId !== null}
        handleClose={handleCloseModal}
        roleId={selectedRoleId}
        setRoles={setRoles}
      />
      <ModalPermisos
        open={openPermisosModal}
        handleClose={handleClosePermisosModal}
        permisos={selectedPermisos}
      />
      
    </div>
  );
};

export default Roles;
