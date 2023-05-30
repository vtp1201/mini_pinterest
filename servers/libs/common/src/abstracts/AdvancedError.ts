// import { HttpStatusCode } from "axios"

export interface IValidationError {
  [key: string]: {
    kind: string
    path?: string
    message: string
    properties?: {
      [key: string]: any
    }
    reportCode?: string
    messageVariable?: { [key: string]: string }
  }
}

export default class AdvancedError extends Error {
  public name: string
  public statusCode: number
  public errors: IValidationError
  constructor(errors: IValidationError, statusCode?: number) {
    super('ValidationError')
    this.name = 'ValidationError'
    this.statusCode = statusCode || 400
    this.errors = errors
  }
}