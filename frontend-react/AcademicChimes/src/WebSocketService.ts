import { Client, StompSubscription } from '@stomp/stompjs';

class WebSocketService {
  private client: Client;
  private connectPromise: Promise<void> | null = null;
  private subscriptions: { [key: string]: StompSubscription } = {};

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };
  }

  connect(): Promise<void> {
    if (!this.connectPromise) {
      this.connectPromise = new Promise((resolve, reject) => {
        this.client.activate();
        this.client.onConnect = () => {
          console.log('Connected to WebSocket');
          resolve();
        };
        this.client.onStompError = (frame) => {
          console.error('STOMP error', frame);
          reject(new Error('Failed to connect to WebSocket'));
        };
      });
    }
    return this.connectPromise;
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
    this.connectPromise = null;
    this.subscriptions = {};
  }

  async subscribe(destination: string, callback: (message: unknown) => void): Promise<void> {
    try {
      await this.connect();
      if (!this.subscriptions[destination]) {
        this.subscriptions[destination] = this.client.subscribe(destination, (message) => {
          callback(JSON.parse(message.body));
        });
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }

  async send(destination: string, body: unknown): Promise<void> {
    try {
      await this.connect();
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}

export default new WebSocketService();