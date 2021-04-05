import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UserSession, UserSessionState } from '@app/state'
import { Select, Store } from '@ngxs/store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnDestroy, OnInit {
  username: string = ''
  password: string = ''

  @Select(UserSessionState.username)
  session$!: Observable<string>

  private destroyed$ = new Subject()

  constructor (
    private router: Router,
    private store: Store
  ) { }

  submit (): void {
    console.log('DO LOGIN!', this.username)

    this.store.dispatch(new UserSession.Login(this.username, this.password))
  }

  ngOnInit () {
    this.session$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((username: string) => {
        if (username) {
          console.log('LOGGED IN!')

          this.router.navigate([''])
        }
      })
  }

  ngOnDestroy () {
    this.destroyed$.next()
    this.destroyed$.complete()
  }
}
