export const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    req.logger?.error(`[${err.name}] ${err.message}`);

    return res.status(500).json({
      status: 'error',
      error: {
        name: err.name,
        message: err.message,
        code: err.code || 500,
        type: err.type || 'INTERNAL_SERVER_ERROR',
      },
    });
  }

  req.logger?.fatal('Error no identificado');
  res.status(500).json({
    status: 'error',
    message: 'Fallo inesperado',
  });
};
  