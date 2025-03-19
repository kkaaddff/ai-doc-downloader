export class CrawlerQueue {
  private visited = new Set<string>()
  private queue: string[] = []

  add(url: string) {
    if (!this.visited.has(url)) {
      this.queue.push(url)
      this.visited.add(url)
    }
  }

  next(): string | undefined {
    return this.queue.shift()
  }

  isEmpty(): boolean {
    return this.queue.length === 0
  }
}
