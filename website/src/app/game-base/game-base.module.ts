import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { NgxsModule } from '@ngxs/store'
import { GameLauncherComponent } from './game-launcher/game-launcher.component'
import { RoomPlayersListComponent } from './game-launcher/room-players-list.component'
import { RoomStore } from './state/room.states'

@NgModule({
  declarations: [
    GameLauncherComponent,
    RoomPlayersListComponent
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([RoomStore]),
  ],
  exports: [
    GameLauncherComponent,
    RoomPlayersListComponent
  ],
})
export class GameBaseModule { }
