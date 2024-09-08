// components/PrivateRoute.js
import React, { useEffect } from 'react';
import { useUser } from '../context/ContextoUsuario';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children, requiredPermissions }) => {
  const { user, permissions } = useUser();

  useEffect(() => {
    if (!user) {
      toast.error('No has iniciado sesión. Serás redirigido...');
    } else {
      const hasRequiredPermissions = requiredPermissions.every(permission => 
        permissions.includes(permission)
      );
      
      if (!hasRequiredPermissions) {
        toast.error('No tienes los permisos requeridos. Serás redirigido...');
      }
    }
  }, [user, permissions, requiredPermissions]);

  useEffect(() => {
    if (!user ) {
      const timer = setTimeout(() => {
        window.location.href = '/iniciarSesion';
      }, 3000);
      

      return () => clearTimeout(timer);
    }
    else if (!requiredPermissions.every(permission => permissions.includes(permission))){
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      

      return () => clearTimeout(timer);
    }
  }, [user, permissions, requiredPermissions]);

  const hasRequiredPermissions = requiredPermissions.every(permission => 
    permissions.includes(permission)
  );

  if (!user) {
    return null;
  }

  return hasRequiredPermissions ? children : null;
};

export default PrivateRoute;
