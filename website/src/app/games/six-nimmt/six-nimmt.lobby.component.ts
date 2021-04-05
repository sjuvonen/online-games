import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'six-nimmt-lobby',
  templateUrl: './six-nimmt.lobby.component.html'
})
export class SixNimmtLobbyComponent {
  constructor (
    private formBuilder: FormBuilder
  ) { }

  settings = {
    minPlayers: 2,
    maxPlayers: 8
  }

  settingsForm = this.formBuilder.group({
    minPlayers: 2,
    maxPlayers: 8
  })
}
