import { Component, OnDestroy, OnInit } from '@angular/core'
import { Game, Room } from '@app/game-base/models'
import { Select, Store } from '@ngxs/store'
import { formatDistance } from 'date-fns'
import { Observable, Subject } from 'rxjs'
import { mergeMap, takeUntil, tap } from 'rxjs/operators'
import { HomeStore } from './home.states'
import { UserSessionState } from '@app/state'
import { Home as HomeActions } from './home.actions'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnDestroy, OnInit {
  games$!: Observable<Game[]>

  @Select(HomeStore.rooms)
  rooms$!: Observable<Room[]>
  groups: Map<string, Room[]> = new Map()

  @Select(UserSessionState.id)
  user$!: Observable<number | null>

  destroy$ = new Subject()

  constructor (
    private store: Store
  ) { }

  ngOnInit () {
    console.log('init')

    this.store
      .select(HomeStore.rooms)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.groups.clear()),
        mergeMap((foo: any) => foo),
        tap((session: any) => {
          if (this.groups.has(session.game)) {
            this.groups.get(session.game)!.push(session)
          } else {
            this.groups.set(session.game, [session])
          }
        })
      )
      .subscribe()

    this.user$
      .pipe(
        takeUntil(this.destroy$),
        tap((id: number | null) => {
          console.log('user$', id)
          if (id) {
            this.store.dispatch(new HomeActions.LoadIndex())
          }
        })
      )
      .subscribe()
  }

  ngOnDestroy () {
    this.destroy$.next()
    this.destroy$.complete()
  }

  createdAgo (timestamp: string) {
    return formatDistance(new Date(timestamp), new Date())
  }
}
