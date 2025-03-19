import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'

export class FileStorage {
  constructor(private baseDir: string) {}

  async saveMarkdown(url: URL, content: string) {
    const fileName = this.urlToFilePath(url)
    const filePath = join(this.baseDir, fileName)

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, content, 'utf-8')
  }

  private urlToFilePath(url: URL): string {
    const path = url.pathname === '/' ? '/index' : url.pathname
    return path.replace(/\/$/, '/index').replace(/\/$/, '') + '.md'
  }
}
