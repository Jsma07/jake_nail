import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Card, CardContent, Grid } from '@mui/material';
import { UserContext } from "../../../../context/ContextoUsuario"; // Ajusta la ruta según sea necesario

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(UserContext); // Usa useContext para obtener el token del usuario

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/agendas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCitas(response.data);
      } catch (error) {
        setError('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [token]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={2}>
      {citas.length === 0 ? (
        <Typography>No tienes citas.</Typography>
      ) : (
        citas.map(cita => (
          <Grid item xs={12} sm={6} md={4} key={cita.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Servicio: {cita.servicio.Nombre_Servicio}</Typography>
                <Typography>Fecha: {cita.Fecha}</Typography>
                <Typography>Hora: {cita.Hora}</Typography>
                <Typography>Empleado: {cita.empleado.Nombre} {cita.empleado.Apellido}</Typography>
                <Typography>Estado: {cita.EstadoAgenda}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default MisCitas;
