import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'
import { Player } from '../models'
import { RoomAction } from '../state/room.actions'
import { RoomStore } from '../state/room.states'

@Component({
  selector: 'app-game-launcher',
  templateUrl: './game-launcher.component.html'
})
export class GameLauncherComponent implements OnDestroy, OnInit {
  @Select(RoomStore.players)
  players$!: Observable<Player[]>

  @Select(RoomStore.id)
  id$!: Observable<number | null>

  owner$ = new Observable<boolean>()

  @Input()
  minPlayers = 4

  @Input()
  maxPlayers = 8

  slots: Array<Player | undefined> = []

  private destroy$ = new Subject<void>()
  private game!: string
  private room: number | null = null

  constructor (
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store
  ) { }

  ngOnInit () {
    this.players$
      .pipe(
        takeUntil(this.destroy$),
        tap((players: Player[]) => {
          this.slots = Array.from({ ...players, length: this.maxPlayers})
        })
      )
      .subscribe()

    this.activatedRoute.data
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => this.game = data.game),
      )
      .subscribe()

    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        tap((params) => {
          if (params.room) {
            this.store.dispatch([
              new RoomAction.Index(params.room),
              new RoomAction.Enter(params.room)
            ])
          } else {
            if (!this.game) {
              throw new Error('Game ID is not set!')
            }
          }
        })
      )
      .subscribe()

    this.id$
      .pipe(
        takeUntil(this.destroy$),
        tap(id => this.room = id)
      )
      .subscribe()

    this.store
      .select(RoomStore.started)
      .pipe(
        takeUntil(this.destroy$),
        tap((started) => {
          if (started) {
            this.router.navigate(['play'], {
              relativeTo: this.activatedRoute
            })
          }
        })
      )
      .subscribe()
  }

  ngOnDestroy () {
    this.destroy$.next()
    this.destroy$.complete()
  }

  isNew (): boolean {
    return this.room === null
  }

  isOwner () {
    return true
  }

  canStart (): boolean {
    return false
  }

  create (settings: any) {
    // return this.store.dispatch(new RoomAction.Create(this.game, settings))
    //   .pipe(
    //     tap((foo: any) => {
    //       console.log('Session created', foo)
    //     })
    //   )
    //   .subscribe()
  }

  launch () {
    if (this.room) {
      this.store.dispatch(new RoomAction.Launch(this.room))
    }
  }
}
