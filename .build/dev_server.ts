import { file, serve } from 'bun'
import { Directory } from './variables'

serve({
  async fetch(request) {
    const url = new URL(request.url)
    let pathname = url.pathname

    // If the path ends with a slash, assume it's a directory and append index.html.
    if (pathname.endsWith('/')) {
      pathname += 'index.html'
    }

    // Build the full file path (assuming your static files are in ./public)
    const filePath = Directory.BUNDLED_STORY + pathname

    try {
      // Attempt to serve the file from disk.
      return new Response(file(filePath), {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache', // no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
    } catch (error) {
      // If the file is not found, return a 404 response.
      return new Response('404 Not Found', { status: 404 })
    }
  },
  port: Directory.PORT,
  development: true,
})

// // Run the server
// serve({
//   fetch(req) {
//     const url = new URL(req.url)
//     if (url.pathname === '/' || url.pathname === Directory.BUNDLED_STORY_NAME) {
//       return new Response(file(Directory.BUNDLED_STORY_NAME), {
//         headers: {
//           'Content-Type': 'text/html',
//           'Cache-Control': 'no-cache', // no-store, must-revalidate',
//           Pragma: 'no-cache',
//           Expires: '0',
//         },
//       })
//     }
//     return new Response('404 Not Found', { status: 404 })
//   },
//   port: Directory.PORT,
//   development: true,
// })

console.log(`The dev server has started on http://localhost:${Directory.PORT}/`)
