export const errorHandler = (err, req, res, next) => {
    req.logger?.error(err.stack || err.message);
    res.status(500).json({ status: 'error', message: err.message });
  };
  