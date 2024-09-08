import React, { useState, useEffect } from "react";
import axios from 'axios';
import CustomSwitch from "../../components/consts/switch";
import Table from "../../components/consts/Tabla";
import ModalAgregarCategoria from "../../components/consts/modal";
import ModalEditarCategoria from "../../components/consts/modalEditar";
import CamposObligatorios from "../../components/consts/camposVacios";
import Fab from '@mui/material/Fab';

const Categorias = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionado, setCategoriaSeleccionado] = useState(null);
  const [buscar, setBuscar] = useState('')

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const filtrar = categorias.filter(categoria =>{
    const {nombre_categoria, IdCategoria} = categoria
    const terminoABuscar = buscar.toLowerCase();
    const IdCategoriaString = IdCategoria.toString(); 
    return(
      nombre_categoria.toLowerCase().includes(terminoABuscar) ||
      IdCategoriaString.includes(terminoABuscar) 
    )
  })

  const handleAddCategoria = async (formData) => {
    try {
      const { nombre_categoria } = formData;
  
      const camposObligatorios = ['nombre_categoria'];
      if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
        return;
      }
  
      formData.estado_categoria = 1;
      try {
        await axios.post('http://localhost:5000/api/categorias/guardarCategoria', formData);
        
        const confirmation = await window.Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres agregar esta categoría?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, agregar',
          cancelButtonText: 'Cancelar'
        });
  
        if (confirmation.isConfirmed) {
          handleCloseModalAgregar();
          fetchCategorias();
          window.Swal.fire('¡Categoría agregada!', '', 'success');
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error === 'El nombre de la categoría ya está registrado.') {
          window.Swal.fire({
            icon: 'warning',
            title: 'Categoría ya registrada',
            text: 'La categoría ingresada ya está registrada.',
          });
        } else {
          console.error('Error al agregar categoría:', error);
        }
      }
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };
  
  const handleEditCategoria = async (formData) => {
    try {
        const camposObligatorios = ['nombre_categoria'];

        if (!CamposObligatorios(formData, camposObligatorios, 'Por favor, complete todos los campos de la categoría.')) {
            return;
        }
  
        const formatNombreCategoria = (nombre) => {
            const nombreSinEspacios = nombre.trim();
            const nombreMinusculas = nombreSinEspacios.toLowerCase();
            const nombreFormateado = nombreMinusculas.charAt(0).toUpperCase() + nombreMinusculas.slice(1);
            return nombreFormateado;
        };

        formData.nombre_categoria = formatNombreCategoria(formData.nombre_categoria);

        const response = await axios.get('http://localhost:5000/api/categorias');
        const categorias = response.data;
        const categoriaExistente = categorias.find(categoria => categoria.nombre_categoria === formData.nombre_categoria && categoria.IdCategoria !== formData.IdCategoria);

        if (categoriaExistente) {
            window.Swal.fire({
                icon: 'warning',
                title: 'Categoría ya registrada',
                text: 'La categoría ingresada ya está registrada.',
            });
            return;
        }

        await axios.put(`http://localhost:5000/api/categorias/editar/${formData.IdCategoria}`, formData);
        handleCloseModalEditar();
        fetchCategorias();
        window.Swal.fire('¡Categoría actualizada!', '', 'success');
    } catch (error) {
        console.error('Error al editar categoría:', error);
        window.Swal.fire('Error', 'Hubo un error al intentar actualizar la categoría', 'error');
    }
};

  const handleChange = (name, value) => {
    setCategoriaSeleccionado((prevCategoria) => ({
      ...prevCategoria,
      [name]: value,
    }));
  };

const handleToggleSwitch = async (id) => {
    const categoria = categorias.find(categoria => categoria.IdCategoria === id);
    if (!categoria) {
        console.error('Categoría no encontrada');
        return;
    }

    const newEstado = categoria.estado_categoria === 1 ? 0 : 1;

    const result = await window.Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Quieres cambiar el estado de la categoría?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        try {
            await axios.put(`http://localhost:5000/api/categorias/editar/${id}`, { estado_categoria: newEstado });
            fetchCategorias(); // Actualiza la lista de categorías después de la actualización
            window.Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: 'El estado de la categoría ha sido actualizado correctamente.',
            });
        } catch (error) {
            console.error('Error al cambiar el estado de la categoría:', error);
            window.Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cambiar el estado de la categoría. Por favor, inténtalo de nuevo más tarde.',
            });
        }
    }
};

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setCategoriaSeleccionado(null);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setCategoriaSeleccionado(null);
  };

  const handleEditClick = (categoria) => {
    setCategoriaSeleccionado(categoria);
    setOpenModalEditar(true);
  };

return (
  <div>
      <ModalAgregarCategoria
        open={openModalAgregar}
        handleClose={handleCloseModalAgregar}
        onSubmit={handleAddCategoria}
        title="Crear Nueva Categoria De Insumos"
        fields={[
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
        ]}
        onChange={handleChange}
      />

      <ModalEditarCategoria
        open={openModalEditar}
        handleClose={handleCloseModalEditar}
        onSubmit={handleEditCategoria}
        title="Editar Categoria De Insumos"
        fields={[
          { name: 'IdCategoria', label: 'Identificador', type: 'number', readOnly: true }, 
          { name: 'nombre_categoria', label: 'Nombre', type: 'text' },
        ]}
        onChange={handleChange}
        entityData={categoriaSeleccionado} 
      />

      <Table
        columns={[
          { field: 'IdCategoria', headerName: 'ID', width: 'w-16' },
          { field: 'nombre_categoria', headerName: 'NOMBRE CATEGORIA', width: 'w-36' },
          {
            field: 'Acciones',
            headerName: 'ACCIONES',
            width: 'w-48',
            renderCell: (params) => (
              <div className="flex justify-center space-x-4">
                {params.row.estado_categoria === 1 && (
                <button onClick={() => handleEditClick(params.row)} className="text-yellow-500">
                  <i className="bx bx-edit" style={{ fontSize: "24px" }}></i>
                </button>
              )}
              <CustomSwitch
                active={params.row.estado_categoria === 1}
                onToggle={() => handleToggleSwitch(params.row.IdCategoria)}
              />
            </div>
               
            ),
          },
        ]}
        data={filtrar}
        title="Gestion de Categorias"

      />
      <Fab
        aria-label="add"
        style={{
          border: '0.5px solid grey',
          backgroundColor: '#94CEF2',
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 1000, // Asegura que el botón flotante esté por encima de otros elementos
        }}
        onClick={() => setOpenModalAgregar(true)}
      >
        <i className='bx bx-plus' style={{ fontSize: '1.3rem' }}></i>
     </Fab>
    </div>
  );
};

export default Categorias;
