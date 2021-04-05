import { Player } from './player'

export interface Settings {
  minPlayers: number
  maxPlayers: number
}

export interface Room {
  id: number
  name: string
  game: string
  createdAt: string
  players: Player[]
  settings: Settings
}
