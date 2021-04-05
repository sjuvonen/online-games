import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { GameBaseModule } from '@app/game-base/game-base.module'
import { NgxsModule } from '@ngxs/store'
import { SixNimmtGameComponent } from './six-nimmt.game.component'
import { SixNimmtLobbyComponent } from './six-nimmt.lobby.component'
import { routes } from './six-nimmt.routes'
import { SixNimmtStore } from './six-nimmt.game.state'

@NgModule({
  declarations: [
    SixNimmtGameComponent,
    SixNimmtLobbyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GameBaseModule,
    NgxsModule.forFeature([SixNimmtStore]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class SixNimmtGameModule { }
