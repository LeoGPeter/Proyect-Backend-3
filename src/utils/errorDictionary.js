export const errorTypes = {
    INVALID_USER_DATA: {
      code: 1001,
      message: 'Datos de usuario inválidos',
    },
    DUPLICATE_EMAIL: {
      code: 1002,
      message: 'Este email ya está registrado',
    },
    PET_CREATION_FAILED: {
      code: 2001,
      message: 'No se pudo crear la mascota',
    },
    UNAUTHORIZED_ACCESS: {
      code: 3001,
      message: 'No tenés permisos para hacer esto',
    },
    UNKNOWN_ERROR: {
      code: 9999,
      message: 'Error desconocido',
    },
  };
  