import { errorTypes } from './errorDictionary.js';

export class CustomError extends Error {
  constructor(name, type) {
    const errorInfo = errorTypes[type] || errorTypes.UNKNOWN_ERROR;
    super(errorInfo.message);
    this.name = name;
    this.code = errorInfo.code;
    this.type = type;
  }
}
