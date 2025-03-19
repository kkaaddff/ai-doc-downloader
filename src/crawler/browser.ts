import { chromium, Browser, Page, Cookie } from 'playwright'

export class BrowserManager {
  private browser: Browser | null = null

  async init() {
    this.browser = await chromium.launch({ headless: true })
  }

  async newPage(cookies: Cookie[] = []): Promise<Page> {
    if (!this.browser) throw new Error('Browser not initialized')
    const context = await this.browser.newContext()

    if (cookies.length > 0) {
      await context.addCookies(cookies)
    }

    return context.newPage()
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}
