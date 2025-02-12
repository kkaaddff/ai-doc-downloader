import TurndownService from 'turndown';

export class MarkdownConverter {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      codeBlockStyle: 'fenced',
      headingStyle: 'atx'
    });

    this.turndown.addRule('pre', {
      filter: 'pre',
      replacement: (content) => `\n\`\`\`\n${content}\n\`\`\`\n`
    });
  }

  convert(html: string): string {
    return this.turndown.turndown(html);
  }
} 