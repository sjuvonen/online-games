import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { Player } from '../models'

interface Slot {
  required: boolean
  player: Player | null
}

@Component({
  selector: 'room-players-list',
  templateUrl: './room-players-list.component.html'
})
export class RoomPlayersListComponent implements OnChanges, OnInit {
  @Input()
  min = 1

  @Input()
  max = 2

  @Input()
  players: Player[] = []

  slots: Slot[] = []

  ngOnInit () {
    this.updateSlots()
  }

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
