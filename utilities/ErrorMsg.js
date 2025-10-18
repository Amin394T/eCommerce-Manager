class ErrorMsg extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const raiseError = (message, statusCode = 500) => {
  return new ErrorMsg(message, statusCode);
};

export default ErrorMsg;
