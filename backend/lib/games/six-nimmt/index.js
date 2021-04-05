import { SixNimmtController } from './six-nimmt.controller.js'
import { SixNimmtGame } from './six-nimmt.game.js'

export class SixNimmtGameExtension {
  static services = {
    'six-nimmt.game': SixNimmtGame
  }

  static listeners = {
    'six-nimmt.game': [
      ['six-nimmt.start', 'start']
    ]
  }

  static controllers = {
    'six-nimmt': SixNimmtController
  }

  static actions = [
    {
      type: '[SixNimmt] Start',
      name: 'six-nimmt.start'
    }
  ]
}
