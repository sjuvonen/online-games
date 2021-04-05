import { Observable } from 'rxjs'

export interface Searcher<T> {
  search (options: any): Observable<T[]>
}
