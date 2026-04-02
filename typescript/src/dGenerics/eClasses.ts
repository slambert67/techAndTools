class Repository<T> {
  private items: T[] = [];

  add(item: T) {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}
const userRepo = new Repository<{ id: number }>();
userRepo.add({ id: 1 });

// This is the backbone of many backend and data-layer abstractions.
