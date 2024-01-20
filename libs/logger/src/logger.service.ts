import { Inject, Injectable } from '@nestjs/common';

interface LoggerData<T> {
  message: string;
  data: T;
}

interface LoggerError<T> {
  message: string;
  error: T;
}

@Injectable()
export class LoggerService {
  constructor(@Inject('APP_NAME') private readonly appname: string) {}

  public debug<T = any>(data: LoggerData<T>) {
    console.debug({
      app_name: this.appname,
      log_level: 'DEBUG',
      data: typeof data === 'string' ? data : JSON.stringify(data),
    });
  }

  public log<T = any>(data: LoggerData<T>) {
    console.debug({
      app_name: this.appname,
      log_level: 'INFO',
      data: typeof data === 'string' ? data : JSON.stringify(data),
    });
  }

  public error<T = any>(error: LoggerError<T>, trace: boolean = false) {
    const params = {
      app_name: this.appname,
      log_level: 'ERROR',
      error,
    };
    if (trace) {
      console.trace(params);
    } else {
      console.error(params);
    }
  }
}
