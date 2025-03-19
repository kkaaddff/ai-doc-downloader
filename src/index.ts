import * as fs from 'fs'
import { Cookie } from 'playwright'
import { MarkdownConverter } from './converter/markdown'
import { BrowserManager } from './crawler/browser'
import { CrawlerQueue } from './crawler/queue'
import { normalizeUrl } from './crawler/urlUtils'
import { FileStorage } from './storage/fileSystem'

export async function main(startUrl: string, outputDir: string, cookieFile?: string) {
  const browser = new BrowserManager()
  const queue = new CrawlerQueue()
  const converter = new MarkdownConverter()
  const storage = new FileStorage(outputDir)

  let cookies: Cookie[] = []
  if (cookieFile && fs.existsSync(cookieFile)) {
    try {
      const cookieData = fs.readFileSync(cookieFile, 'utf-8')
      cookies = JSON.parse(cookieData)
      console.log(`Loaded cookies from ${cookieFile}`)
    } catch (error) {
      console.error(`Error loading cookies from ${cookieFile}:`, error)
    }
  }

  await browser.init()
  queue.add(startUrl)

  try {
    while (!queue.isEmpty()) {
      const url = queue.next()
      if (!url) break

      console.log(`Processing: ${url}`)
      const page = await browser.newPage(cookies)

      try {
        await page.goto(url, { waitUntil: 'networkidle' })

        // 检查文件是否已存在
        const fileExists = await storage.fileExists(new URL(url))

        if (!fileExists) {
          // 只在文件不存在时抓取和保存内容
          const content = await page.content()
          const markdown = converter.convert(content)

          // 保存内容
          await storage.saveMarkdown(new URL(url), markdown)
          console.log(`Saved content for: ${url}`)
        } else {
          console.log(`Skipping content extraction for: ${url} (file already exists)`)
        }

        // Extract links
        const links = await page.$$eval('a', (as) => as.map((a) => a.href))
        for (const link of links) {
          const normalized = normalizeUrl(url, link)
          if (normalized) queue.add(normalized)
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}
