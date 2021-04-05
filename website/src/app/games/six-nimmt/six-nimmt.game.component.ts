import { Component, OnDestroy, OnInit } from '@angular/core'
import { Card } from './game/types'
import { Select, Store } from '@ngxs/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import { SixNimmtStore } from './six-nimmt.game.state'

@Component({
  selector: 'six-nimmt-game',
  templateUrl: './six-nimmt.game.component.html',
  styleUrls: ['./six-nimmt.game.component.css']
})
export class SixNimmtGameComponent implements OnDestroy, OnInit {
  @Select(SixNimmtStore.hand)
  hand$!: Observable<Card[]>

  @Select(SixNimmtStore.board)
  board$!: Observable<Card[][]>

  board: Card[][] = [
    new Array(6),
    new Array(6),
    new Array(6),
    new Array(6),
  ]

  private destroy$ = new Subject<void>()

  constructor (private store: Store) {}

  ngOnInit () {
    this.board$
      .pipe(
        takeUntil(this.destroy$),
        tap((board: Card[][]) => {
          
        })
      )
      .subscribe()
  }

  ngOnDestroy () {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
