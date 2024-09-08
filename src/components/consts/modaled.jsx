import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ModalDinamico = ({
  open,
  handleClose,
  title = "",
  fields,
  onSubmit,
  seleccionado,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (seleccionado) {
      setFormData(seleccionado);
    } else {
      setFormData({});
    }
  }, [seleccionado]);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Imprimir en consola el valor seleccionado en el select de rol
    if (name === "IdRol") {
      console.log("Rol seleccionado:", value);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  // Función para cancelar y cerrar el modal
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: "0.375rem",
          width: "80%",
          maxWidth: "50rem",
          maxHeight: "80%",
          overflow: "auto",
          padding: "1.5rem",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {/* Renderizar los campos en grupos de dos */}
          {fields &&
            fields.length > 0 &&
            fields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                {/* Manejar los diferentes tipos de campos */}
                {field.type === "text" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="text"
                    style={{
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                    value={formData[field.name] || ""}
                  />
                )}
                {field.type === "password" && (
                  <TextField
                    id={field.name}
                    name={field.name}
                    label={field.label}
                    variant="outlined"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="password"
                    style={{
                      marginBottom: "0.5rem",
                      textAlign: "center",
                    }}
                    value={formData[field.name] || ""}
                  />
                )}
                {field.type === "select" && (
                  <div>
                    <InputLabel id={`${field.name}-label`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`${field.name}-label`}
                      id={field.name}
                      name={field.name}
                      variant="outlined"
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      value={formData[field.name] || ""}
                      label={field.label}
                      style={{
                        marginBottom: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      {field.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                )}
                
                {field.type === "switch" && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData[field.name] || false}
                        onChange={handleChange}
                        name={field.name}
                        color="primary"
                      />
                    }
                    label={field.label}
                  />
                )}
              </Grid>
            ))}
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            onClick={handleCancel}
            color="secondary"
            variant="contained"
            style={{ marginRight: "1rem" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDinamico;
