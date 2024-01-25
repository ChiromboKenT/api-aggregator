import { Inject, Injectable } from '@nestjs/common';

export type LogLevels = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
type logDetails = string | Record<string, unknown>;

@Injectable()
export class LoggerService {
  constructor(@Inject('LOGGER') private readonly logger: any) {}

  info(message: string, data?: unknown) {
    this.log('INFO', message, data);
  }

  trace(message: string, data?: unknown) {
    console.trace('TRACE', {
      ...this.logger,
      message,
      details: data,
    });
  }

  debug(message: string, data?: unknown) {
    this.log('DEBUG', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('WARN', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('ERROR', message, data);
  }
  private log(logLevel: LogLevels, message: string, data: unknown) {
    console.log(
      logLevel,
      JSON.stringify({
        ...this.logger,
        message,
        details: data as logDetails,
      }),
    );
  }
}
