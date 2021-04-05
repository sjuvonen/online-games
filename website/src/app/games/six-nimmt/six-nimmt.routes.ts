import { Routes } from '@angular/router'
import { SixNimmtGameComponent } from './six-nimmt.game.component'
import { SixNimmtLobbyComponent } from './six-nimmt.lobby.component'

export const routes: Routes = [
  {
    path: '',
    component: SixNimmtLobbyComponent,
    data: {
      game: 'six-nimmt'
    }
  },
  {
    path: ':room',
    component: SixNimmtLobbyComponent,
    data: {
      game: 'six-nimmt'
    }
  },
  {
    path: ':room/play',
    component: SixNimmtGameComponent,
  }
]
