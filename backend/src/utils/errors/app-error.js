export class AppError extends Error {
  constructor({
    message,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details = null,
    isOperational = true,
    layer = "APP",
    cause = null,
  }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    this.layer = layer;
    this.cause = cause;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ControllerError extends AppError {
  constructor({
    message,
    statusCode = 400,
    code = "CONTROLLER_ERROR",
    details = null,
    cause = null,
  }) {
    super({
      message,
      statusCode,
      code,
      details,
      layer: "CONTROLLER",
      cause,
    });
  }
}

export class ServiceError extends AppError {
  constructor({
    message,
    statusCode = 422,
    code = "SERVICE_ERROR",
    details = null,
    cause = null,
  }) {
    super({
      message,
      statusCode,
      code,
      details,
      layer: "SERVICE",
      cause,
    });
  }
}

export class RepositoryError extends AppError {
  constructor({
    message,
    statusCode = 500,
    code = "REPOSITORY_ERROR",
    details = null,
    cause = null,
  }) {
    super({
      message,
      statusCode,
      code,
      details,
      layer: "REPOSITORY",
      cause,
    });
  }
}
