import { HomeController } from './home.controller.js'
import { PlayerStore } from './player.store.js'
import { RoomController } from './room.controller.js'
import { RoomNotifier } from './room.notifier.js'

export class GamesExtension {
  static services = {
    'store.player': PlayerStore,
    'room.notifier': RoomNotifier
  }

  static listeners = {
    'room.notifier': [
      ['connection', 'onConnection']
    ]
  }

  static routes = [
    {
      path: '/lobby',
      name: 'lobby.index',
      methods: ['GET']
    }
  ]

  static actions = [
    {
      type: '[Home] LoadIndex',
      name: 'lobby.index'
    },
    {
      type: '[Room] Enter',
      name: 'room.enter'
    },
    {
      type: '[Room] Index',
      name: 'room.index'
    },
    {
      type: '[Room] Launch',
      name: 'room.launch'
    }
  ]

  static controllers = {
    lobby: HomeController,
    room: RoomController
  }
}
