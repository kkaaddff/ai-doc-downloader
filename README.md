# AI Doc Downloader

A TypeScript-based web crawler that downloads web pages and converts them to Markdown format.

## Features

- Crawls websites starting from a given URL
- Converts HTML content to Markdown format
- Maintains the original site structure in the output
- Handles relative and absolute URLs
- Saves files with proper directory structure

## Installation

```bash
npm install
```

## Usage

```bash
# Compile TypeScript
npm run build

# Run the crawler
node dist/index.js "https://example.com" "./output"
```

## Project Structure

```
.
├── src/
│   ├── crawler/      # Web crawling related code
│   ├── converter/    # HTML to Markdown conversion
│   ├── storage/      # File system operations
│   └── index.ts      # Main application entry
├── dist/            # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- playwright: Web automation
- turndown: HTML to Markdown conversion
- TypeScript: Development
