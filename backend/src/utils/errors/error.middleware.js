import { AppError } from "./app-error.js";

export const notFoundHandler = (req, _res, next) => {
  next(
    new AppError({
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404,
      code: "ROUTE_NOT_FOUND",
      layer: "APP",
    }),
  );
};

const mapMongooseError = (err) => {
  if (err?.name === "ValidationError") {
    return new AppError({
      message: "Validation failed for database operation.",
      statusCode: 400,
      code: "DB_VALIDATION_ERROR",
      details: Object.values(err.errors || {}).map((e) => e.message),
      layer: "REPOSITORY",
      cause: err,
    });
  }

  if (err?.name === "CastError") {
    return new AppError({
      message: `Invalid value for ${err.path}.`,
      statusCode: 400,
      code: "DB_CAST_ERROR",
      details: { path: err.path, value: err.value },
      layer: "REPOSITORY",
      cause: err,
    });
  }

  if (err?.code === 11000) {
    return new AppError({
      message: "Duplicate value detected.",
      statusCode: 409,
      code: "DB_DUPLICATE_ERROR",
      details: err.keyValue,
      layer: "REPOSITORY",
      cause: err,
    });
  }

  return err;
};

const normalizeError = (err) => {
  if (err instanceof AppError) {
    return err;
  }

  const mapped = mapMongooseError(err);
  if (mapped instanceof AppError) {
    return mapped;
  }

  return new AppError({
    message: "Something went wrong.",
    statusCode: 500,
    code: "INTERNAL_ERROR",
    details: null,
    isOperational: false,
    layer: "APP",
    cause: err,
  });
};

export const globalErrorHandler = (err, _req, res, _next) => {
  const normalizedError = normalizeError(err);

  const payload = {
    success: false,
    status: normalizedError.status,
    code: normalizedError.code,
    message: normalizedError.message,
    layer: normalizedError.layer,
  };

  if (normalizedError.details) {
    payload.details = normalizedError.details;
  }

  if (process.env.NODE_ENV !== "production") {
    payload.stack = normalizedError.stack;
  }

  return res.status(normalizedError.statusCode).json(payload);
};
