/**
 * Custom error class used to throw customized errors
 */
export class CustomError extends Error {
  constructor(message: string = '') {
    super()

    this.message = message
  }

  statusCode(): number {
    if (this instanceof BadRequestError) {
      return 400
    }

    if (this instanceof UnauthorizedError) {
      return 401
    }

    if (this instanceof NotFoundError) {
      return 404
    }

    if (this instanceof InternalError) {
      return 500
    }

    return 500
  }
}

export class BadRequestError extends CustomError {}
export class InternalError extends CustomError {}
export class NotFoundError extends CustomError {}
export class UnauthorizedError extends CustomError {}
