import { Injectable } from '@angular/core'
import { Store } from '@ngxs/store'
import { SendWebSocketMessage } from '@ngxs/websocket-plugin'

export interface Message {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class GameClient {
  constructor (private store: Store) { }

  send (type: string, message: Message) {
    console.log('SEND', message)
    this.store.dispatch(new SendWebSocketMessage({ ...message, type }))
  }
}
