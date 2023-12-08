export interface ILogger {
  error(where: string, message?: string, metadata?: any): void;
  warn(where: string, message?: string, metadata?: any): void;
  info(where: string, message?: string, metadata?: any): void;
  debug(where: string, message?: string, metadata?: any): void;
}

export interface ILoggerConfig {
  level: LoggingLevel;
  module: string;
  dirname?: string;
  maxSize?: string;
  maxFiles?: string;
}

export enum LoggingLevel {
  "error",
  "warn",
  "info",
  "http",
  "verbose",
  "debug",
}
