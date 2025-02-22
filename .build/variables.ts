type EnvironmentMode = 'production' | 'development'
export const mode =
  (Bun.env.NODE_ENV as EnvironmentMode | undefined) || 'development'
// export const watchSASS =
//   (Bun.env.WATCH_SASS as 'true' | 'false') == 'true' ? true : false

// Directories
export const enum Directory {
  BASE = './src',
  /**
   * This contains the bundled scripts and styles
   */
  OUTPUT = './.prebuilt',
  /**
   * This is the actual directory to the story's html
   */
  BUNDLED_STORY = './dist',
  BUNDLED_STORY_NAME = BUNDLED_STORY + '/index.html',

  // SECTION
  ASSETS = BASE + '/assets',
  APP = ASSETS + '/app',
  // !SECTION

  SCRIPTS = APP + '/scripts',
  STYLES = APP + '/styles',
  SCRIPT_EXTENSIONS = SCRIPTS + '/extensions',
  STYLE_EXTENSIONS = STYLES + '/extensions',

  SCRIPT_ENTRYPOINT = APP + '/index.ts',
  STYLE_ENTRYPOINT = STYLES + '/main.scss',

  /**
   * USE THIS FOR REFERRING TO `MEDIA`
   */
  STORY_MEDIA = '/media',

  /**
   * USE THIS FOR REFERRING TO `FONTS`
   */
  STORY_FONTS = '/fonts',

  FONTS = ASSETS + STORY_FONTS,
  MEDIA = ASSETS + STORY_MEDIA,
  VENDOR = ASSETS + '/vendor',
  STORY = BASE + '/story',
  HEAD_CONTENT = BASE + '/head_content.html',

  BUNDLED_SCRIPTS_DIR = OUTPUT + '/app/scripts',
  BUNDLED_STYLES_DIR = OUTPUT + '/app/styles',
  BUNDLED_SCRIPTS = BUNDLED_SCRIPTS_DIR + '/index.js',
  BUNDLED_STYLES = BUNDLED_STYLES_DIR + '/main.css',

  /**
   * The dev server would be started on "localhost:PORT" where "PORT" is this
   */
  PORT = 8080,
}
