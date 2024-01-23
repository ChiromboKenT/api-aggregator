import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SseManagerService {
  private readonly channels: Record<string, Subject<string>> = {};

  getClientChannel(clientId: string, endpoint: string): Subject<string> {
    const channelKey = `${clientId}:${endpoint}`;

    if (!this.channels[channelKey]) {
      this.channels[channelKey] = new Subject<string>();
    }

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
