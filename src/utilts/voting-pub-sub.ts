type Message = { pollOptionId: string; votes: number };
type Subscriber = (message: Message) => void;

class VotingPubSub {
  private subscribers: Record<string, Subscriber[]> = {};

  subscribe(pollid: string, subscriber: Subscriber) {
    if (!this.subscribers[pollid]) {
      this.subscribers[pollid] = [];
    }
    this.subscribers[pollid].push(subscriber);
  }

  publish(pollId: string, message: Message) {
    if (!this.subscribers[pollId]) {
      return;
    }
    this.subscribers[pollId].forEach((subscriber) => {
      subscriber(message);
    });
  }
}

export const votingPubSub = new VotingPubSub();
