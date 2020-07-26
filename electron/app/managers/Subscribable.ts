type Subscriber = {
  channel: string;
  callback: any;
};

export default class Subscribable {
  subscribers: Array<Subscriber>;

  constructor() {
    this.subscribers = [];
  }

  public on(channel: string, callback: any) {
    this.subscribers.push({
      channel,
      callback
    });
  }

  protected publish(channel: string, args: any) {
    this.subscribers.forEach(s => {
      if (s.channel === channel) s.callback(args);
    });
  }
}
