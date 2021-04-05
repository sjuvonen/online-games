import { Observable } from 'rxjs'

export interface Loader<T> {
  fetch (id: string | number): Observable<T>
  fetchAll (ids: string[] | number[]): Observable<T[]>
}
