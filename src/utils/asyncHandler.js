export const asyncHandler = (fn) => (req, res, next) => {
  return fn(req, res, next).catch((error) => {
    next(new Error(error.message, { cause: 500 }));
  });
};
