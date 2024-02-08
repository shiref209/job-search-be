export const globalErrorHandler = (error, req, res, next) => {
  if (req.validationError) {
    return res.status(400).json({ message: req.validationError.details });
  }
  return res.status(error.cause || 500).json({ message: error.message });
};
