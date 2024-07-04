import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Voter } from '../interfaces/voter';
import { Candidates } from '../interfaces/candidates';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private votersUrl = 'http://localhost:3000/voters';
  private candidatesUrl = 'http://localhost:3000/candidates'
  private votersSubject = new BehaviorSubject<Voter[]>([]);
  // voters$ = this.votersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getVoters(): Observable<Voter[]> {
    return this.http.get<Voter[]>(this.votersUrl).pipe(
      tap(voters => this.votersSubject.next(voters))
    );
  }

  addVoter(voter: Voter): Observable<Voter> {
    return this.http.post<Voter>(this.votersUrl, voter).pipe(
      tap((newVoter: Voter) => {
        this.votersSubject.next([...this.votersSubject.value, newVoter]);
      }),
      finalize(() => {}))
  }

  //get the candidates
  getCandidates(): Observable<any[]> {
    return this.http.get<Candidates[]>(this.candidatesUrl);
  }

  updateCandidate(candidate: Candidates): Observable<Candidates> {
    const url = `${this.candidatesUrl}/${candidate.id}`;
    return this.http.put<Candidates>(url, candidate);
  }
  updateVoter(voter: Voter): Observable<Voter> {
    const url = `${this.votersUrl}/${voter.id}`;
    return this.http.put<Voter>(url, voter);
  }
}
