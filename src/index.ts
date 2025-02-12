import { BrowserManager } from './crawler/browser';
import { CrawlerQueue } from './crawler/queue';
import { normalizeUrl } from './crawler/urlUtils';
import { MarkdownConverter } from './converter/markdown';
import { FileStorage } from './storage/fileSystem';

async function main(startUrl: string, outputDir: string) {
  const browser = new BrowserManager();
  const queue = new CrawlerQueue();
  const converter = new MarkdownConverter();
  const storage = new FileStorage(outputDir);

  await browser.init();
  queue.add(startUrl);

  try {
    while (!queue.isEmpty()) {
      const url = queue.next();
      if (!url) break;

      console.log(`Processing: ${url}`);
      const page = await browser.newPage();
      
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Extract content
        const content = await page.content();
        const markdown = converter.convert(content);
        
        // Save content
        await storage.saveMarkdown(new URL(url), markdown);
        
        // Extract links
        const links = await page.$$eval('a', as => as.map(a => a.href));
        for (const link of links) {
          const normalized = normalizeUrl(url, link);
          if (normalized) queue.add(normalized);
        }
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

// Usage example
if (require.main === module) {
  const url = process.argv[2];
  const outputDir = process.argv[3] || './output';
  
  if (!url) {
    console.error('Please provide a URL to crawl');
    process.exit(1);
  }

  main(url, outputDir).catch(console.error);
} 