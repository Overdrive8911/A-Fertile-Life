import { file, serve } from 'bun'
import { Directory } from './variables'

// Run the server
serve({
  fetch(req) {
    const url = new URL(req.url)
    if (url.pathname === '/' || url.pathname === Directory.BUNDLED_STORY_NAME) {
      return new Response(file(Directory.BUNDLED_STORY_NAME), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache', // no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
    }
    return new Response('404 Not Found', { status: 404 })
  },
  port: Directory.PORT,
  development: true,
})

console.log(`The dev server has started on http://localhost:${Directory.PORT}/`)
