import { CmsExtension } from '@colibre/cms'
import * as Colibre from '@colibre/server'
import * as ColibreWss from '@colibre/wss'
import { GamesExtension } from './games/index.js'
import { InitDbExtension } from './initdb/index.js'
import { SessionExtension } from './session/index.js'
import { SixNimmtGameExtension } from './games/six-nimmt/index.js'
import config from '../config.json'

const extensions = [
  CmsExtension,
  InitDbExtension,
  SessionExtension,
  GamesExtension,
  SixNimmtGameExtension
]

const server = new Colibre.Server({ ...config, extensions })
const wss = new ColibreWss.Server(server, { ...config.wss })

server.start().then(([addr, port]) => {
  console.info(`HTTP server listening on ${addr}:${port}.`)
})

wss.start().then(([port]) => {
  console.info(`WS server listening on port ${port}.`)
})
