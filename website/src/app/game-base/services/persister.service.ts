import { Observable } from 'rxjs'

export interface Persister<T> {
  persist (payload: T): Observable<T>
}
