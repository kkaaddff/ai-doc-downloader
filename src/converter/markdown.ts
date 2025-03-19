import TurndownService from 'turndown'

export class MarkdownConverter {
  private turndown: TurndownService

  constructor() {
    this.turndown = new TurndownService({
      codeBlockStyle: 'fenced',
      headingStyle: 'atx',
      bulletListMarker: '-',
      hr: '---',
    })

    // Remove style tags and their content
    this.turndown.addRule('removeStyles', {
      filter: ['style'],
      replacement: () => '',
    })

    // Remove script tags and their content
    this.turndown.addRule('removeScripts', {
      filter: ['script'],
      replacement: () => '',
    })

    // Handle code blocks better
    this.turndown.addRule('pre', {
      filter: 'pre',
      replacement: (content, node) => {
        const element = node as HTMLElement
        const language = element.className?.replace('language-', '') || ''
        return `\n\`\`\`${language}\n${content.trim()}\n\`\`\`\n`
      },
    })

    // Remove unnecessary attributes from links
    this.turndown.addRule('links', {
      filter: 'a',
      replacement: (content, node) => {
        const element = node as HTMLAnchorElement
        const href = element.href
        return href ? `[${content}](${href})` : content
      },
    })

    // Clean up images
    this.turndown.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const element = node as HTMLImageElement
        const alt = element.alt || ''
        const src = element.src
        return src ? `![${alt}](${src})` : ''
      },
    })

    // Remove common unnecessary elements
    this.turndown.remove(['nav', 'footer', 'aside', 'script', 'style', 'meta', 'iframe'])
  }

  convert(html: string): string {
    // Pre-process HTML to remove unnecessary elements
    const cleanHtml = this.preProcessHtml(html)
    // Convert to Markdown
    const markdown = this.turndown.turndown(cleanHtml)
    // Post-process Markdown to clean up the result
    return this.postProcessMarkdown(markdown)
  }

  private preProcessHtml(html: string): string {
    // Remove HTML comments
    html = html.replace(/<!--[\s\S]*?-->/g, '')

    // Remove data attributes
    html = html.replace(/ data-[^=]+="[^"]*"/g, '')

    // Remove common tracking and unnecessary attributes
    html = html.replace(/ (class|id|style|onclick|onload|aria-[a-z]+)="[^"]*"/g, '')

    return html
  }

  private postProcessMarkdown(markdown: string): string {
    // Define patterns to skip
    const patternsToSkip = [':root', 'try {', '{"props":']

    // Split content into lines, filter unwanted lines, and rejoin
    return (
      markdown
        .split('\n')
        .filter((line) => {
          const trimmedLine = line.trim()
          // Keep empty lines and lines that don't start with skip patterns
          return !trimmedLine || !patternsToSkip.some((pattern) => trimmedLine.startsWith(pattern))
        })
        .join('\n')
        // Remove multiple consecutive blank lines
        .replace(/\n{3,}/g, '\n\n')
        // Remove trailing whitespace
        .replace(/[ \t]+$/gm, '')
        // Remove spaces before list markers
        .replace(/^[ \t]+(-|\*|\+|\d+\.) /gm, '$1 ')
        // Clean up code blocks (ensure proper spacing)
        .replace(/```(\w*)\n\n/g, '```$1\n')
        .replace(/\n\n```/g, '\n```')
        // Trim the final result
        .trim()
    )
  }
}
