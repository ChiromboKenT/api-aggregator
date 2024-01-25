import { LoggerService } from '@aggregator/logger';
import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SseManagerService {
  private readonly channels: Record<string, Subject<string>> = {};
  constructor(private readonly logger: LoggerService) {}

  getClientChannel(clientId: string, endpoint: string): Subject<string> {
    const channelKey = `${clientId}:${endpoint}`;

    if (!this.channels[channelKey]) {
      this.channels[channelKey] = new Subject<string>();
      this.logger.debug('Channel created', { channelKey });
    }

    this.logger.debug('Channel retrieved', {
      channelKey,
    });

    return this.channels[channelKey];
  }

  sendUpdate(clientId: string, endpoint: string, update: string): void {
    const channel = this.getClientChannel(clientId, endpoint);

    channel.next(update);
  }

  getChannelObservable(clientId: string, endpoint: string): Observable<string> {
    const channel = this.getClientChannel(clientId, endpoint);
    return channel.asObservable();
  }
}
