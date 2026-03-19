type Listener = (payload: unknown) => void;

class NotificationHub {
  private listenersByUser = new Map<string, Set<Listener>>();

  subscribe(userId: string, listener: Listener) {
    const set = this.listenersByUser.get(userId) || new Set<Listener>();
    set.add(listener);
    this.listenersByUser.set(userId, set);
    return () => {
      const existing = this.listenersByUser.get(userId);
      if (!existing) return;
      existing.delete(listener);
      if (existing.size === 0) this.listenersByUser.delete(userId);
    };
  }

  broadcastToUser(userId: string, payload: unknown) {
    const set = this.listenersByUser.get(userId);
    if (!set) return;
    for (const listener of set) listener(payload);
  }
}

export const notificationHub = new NotificationHub();
