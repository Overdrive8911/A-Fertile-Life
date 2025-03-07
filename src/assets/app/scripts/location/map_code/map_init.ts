import { Application } from 'pixi.js'

$(window).on(':passageend', async () => {
  const container = document.querySelector('.ui-side-bar-popout-map')
  console.log(container)
  if (container) {
    const app = new Application()

    await app.init({ background: '#1099bb' })

    // Then adding the application's canvas to the DOM body.
    container.prepend(app.canvas)
  } else {
    console.error(
      'No element with the class "ui-side-bar-popout-map" was found.'
    )
  }
})
