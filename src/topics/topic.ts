export abstract class Topic {
  get key() {
    return this.constructor.name;
  }
}
