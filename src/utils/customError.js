export class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    let error = new Error(message, { cause });
    error.code = code;
    error.name = name;
    throw error;
  }
}
