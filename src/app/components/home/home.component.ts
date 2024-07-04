import { Component, computed, OnInit, signal, effect, OnDestroy, Input, output } from '@angular/core';
import { MaterialModule } from '../../material/material/material.module';
import { ResultsComponent } from '../results/results.component';
import { VotesComponent } from '../votes/votes.component';
import { CandidatesComponent } from '../candidates/candidates.component';
import { CommonModule } from '@angular/common';
import { VoterComponent } from '../voter/voter.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from '../../services/services.service';
import { Voter } from '../../interfaces/voter';
import { Subject, takeUntil } from 'rxjs';
import { Candidates } from '../../interfaces/candidates';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ResultsComponent,
    VotesComponent,
    VoterComponent,
    CandidatesComponent
  ],
  providers: [
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  votersData=signal<Voter[]>([]);
  votingDeadline = signal<Date>(new Date('2024-07-07'));
  currentTime = signal(new Date());
  hours= signal(0);
  minutes= signal(0);
  seconds= signal(0);


  constructor(
    private service: ServicesService,
    public dialog: MatDialog
  ) {
    effect(() => {
      const now= this.currentTime()
      const deadline = new Date(this.votingDeadline().toISOString());
      console.log("deadline",deadline);
      console.log("now",now);
      const remainingTime = deadline.getTime() - now.getTime();
      console.log("remainingTime",remainingTime);
      if (remainingTime <= 0) {
        this.seconds.set(0);
        this.minutes.set(0);
        this.hours.set(0);
        return;
      }

      const secondsLeft = Math.floor((remainingTime / 1000) % 60);
      const minutesLeft = Math.floor((remainingTime / (1000 * 60)) % 60);
      const hoursLeft = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  
      this.seconds.set(secondsLeft);
      this.minutes.set(minutesLeft);
      this.hours.set(hoursLeft);

      //get voter data
      this.service.getVoters().pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.votersData.set(data);
      });
      //update the voterData whenever there is changes in the data
      this.votersData.update
  
      }, { allowSignalWrites: true });
  }
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    //get the voters data

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  addVoter(): void {
    const dialogRef = this.dialog.open(VoterComponent, {
      width: '450px',
    });

 
    }
  //displayed columns 
  displayedColumns: string[] = ['position', 'name', 'ID', 'voted']

}


