type GameId = string
type PlayerId = string

export interface SettingsBase {
  minPlayers: number
  maxPlayers: number
}

export interface LobbyBase {
  game: GameId
  settings: SettingsBase
}

export interface Lobby extends LobbyBase {
  id: string
  owner: PlayerId
  players: PlayerId[]
  started: boolean
}
