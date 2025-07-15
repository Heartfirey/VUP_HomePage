export function safeThrow(exception) {
  if (process.env.NODE_ENV !== 'production') {
    throw exception;
  }
}
