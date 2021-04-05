import { Component, Input, OnChanges } from '@angular/core'
import { Player } from '@game-base/models'

interface Slot {
  required: boolean
  player: Player | null
}

@Component({
  selector: 'home-players-list',
  templateUrl: './home-players-list.component.html'
})
export class HomePlayersListComponent implements OnChanges {
  @Input()
  min = 1

  @Input()
  max = 2

  @Input()
  players: Player[] = []

  slots: Slot[] = []

  ngOnChanges () {
    this.updateSlots()
  }

  private updateSlots(): void {
    this.slots = new Array(this.max)

    for (let i = 0; i < this.max; i++) {
      this.slots[i] = {
        required: i < this.min,
        player: this.players[i] || null
      }
    }
  }
}
