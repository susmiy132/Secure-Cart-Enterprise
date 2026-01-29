
/**
 * Mock MongoDB Service
 * In a real app, these would be Mongoose calls.
 */
export class DB {
  private static getCollection(name: string): any[] {
    const data = localStorage.getItem(`db_${name}`);
    return data ? JSON.parse(data) : [];
  }

  private static saveCollection(name: string, data: any[]) {
    localStorage.setItem(`db_${name}`, JSON.stringify(data));
  }

  static findOne<T>(collection: string, query: Partial<T>): T | null {
    const items = this.getCollection(collection);
    return items.find(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    ) || null;
  }

  static findMany<T>(collection: string, query: Partial<T> = {}): T[] {
    const items = this.getCollection(collection);
    return items.filter(item => 
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  static insertOne<T>(collection: string, doc: T): T {
    const items = this.getCollection(collection);
    const newDoc = { ...doc, id: doc['id'] || Math.random().toString(36).substr(2, 9) };
    items.push(newDoc);
    this.saveCollection(collection, items);
    return newDoc;
  }

  static updateOne<T>(collection: string, id: string, update: Partial<T>) {
    const items = this.getCollection(collection);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...update };
      this.saveCollection(collection, items);
    }
  }
}
