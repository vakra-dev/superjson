# superjson

A keyboard driven JSON explorer. Simple, beautiful, fast.

## Features

- **Lightning Fast** - Native JSON parsing with virtualized rendering. Handles large files smoothly.
- **Keyboard First** - Vim-style navigation (j/k, h/l, gg, G) for power users.
- **Beautiful Themes** - 13 carefully crafted color schemes (7 dark, 6 light).
- **Smart Search** - Search keys and values instantly with highlighted results.
- **Copy Paths** - JSONPath, jq, or JavaScript accessor formats with one click.
- **Share JSON** - Compressed URLs for small files, server storage for large files (up to 5MB).
- **Multi-Tab Support** - Each browser tab maintains its own persisted state.
- **Import Anywhere** - Paste JSON, upload files, or import from URLs.
- **Auto Repair** - Automatically fix common JSON syntax errors.
- **Zero Tracking** - Fully client-side processing. Your data never leaves your browser.

> **Tip:** Star this repo to get notified of updates and help others discover the project!

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to start exploring JSON.

## Keyboard Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `j` / `k` | Navigate down/up |
| `h` / `l` | Collapse/expand |
| `Enter` | Toggle expand |
| `gg` | Go to first |
| `G` | Go to last |

### Actions

| Key | Action |
|-----|--------|
| `y` | Copy path |
| `Y` | Copy value |
| `/` | Search |
| `n` / `N` | Next/previous result |
| `E` | Expand all |
| `C` | Collapse all |

### Editor

| Key | Action |
|-----|--------|
| `Cmd+E` | Format JSON |
| `Cmd+M` | Minify JSON |
| `Cmd+D` | Repair JSON |
| `Cmd+K` | Command palette |
| `Cmd+\` | Cycle layout |
| `Cmd+Shift+V` | Toggle view mode |
| `T` | Theme picker |

## Sharing

SuperJSON supports two sharing modes:

- **URL Sharing** - Small JSON files are compressed and embedded directly in the URL. No server required.
- **Server Storage** - Large JSON files (>8KB compressed) are stored server-side with a 30-day expiration.

Share links are created automatically based on file size when you click the share button.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (State management)
- [@tanstack/react-virtual](https://tanstack.com/virtual) (Virtualized lists)
- [Turso](https://turso.tech/) (SQLite edge database for share storage)
- [LZ-String](https://pieroxy.net/blog/pages/lz-string/index.html) (URL compression)

## Environment Variables

For server-side share storage, set these environment variables:

```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## License

MIT
