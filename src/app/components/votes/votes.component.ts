import { Component, effect, Input, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesService } from '../../services/services.service';
import { Candidates } from '../../interfaces/candidates';
import { MaterialModule } from '../../material/material/material.module';
import { Voter } from '../../interfaces/voter';
import { Vote } from '../../interfaces/vote';

@Component({
  selector: 'app-votes',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.css']
})
export class VotesComponent implements OnInit {
  @Input() votersData = signal<Voter[]>([]);
   candidates=signal<Candidates[]>([]);
  voteForm: FormGroup;

  constructor(
    private service: ServicesService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.voteForm = this.fb.group({
      voter: ['', Validators.required],
      candidate: ['', Validators.required]
    });

   effect(()=>{
     //get candidate data
     this.service.getCandidates().subscribe((candidates: Candidates[]) => {
      this.candidates.set(candidates);
    });
   
    }, { allowSignalWrites: true })
  
  }

  ngOnInit(): void {
    this.candidates().filter(candidate => candidate.voter_id.length < 5);
   this.votersData().filter(voter => !voter.voted);
  }

  hasVoted(): boolean {
    const voterId = this.voteForm.get('voter')?.value;
    const selectedCandidate = this.candidates().find(candidate => candidate.id === this.voteForm.get('candidate')?.value);
    
    // Check if selectedCandidate and selectedCandidate.voter_id are defined
    return selectedCandidate?.voter_id ? (Array.isArray(selectedCandidate.voter_id) ? selectedCandidate.voter_id.some(id => id === voterId) : false) : false;
    }
  
  
  

    onVote() {
      const voterId = this.voteForm.get('voter')?.value;
      const candidateId = this.voteForm.get('candidate')?.value;
  
      // Update the voter's voted status
      const voter = this.votersData().find(voter => voter.id === voterId);
      if (voter) {
        voter.voted = true;
        this.service.updateVoter(voter).subscribe(() => {
          // Update the signal
          this.votersData.update(voters => voters.map(v => v.id === voter.id ? voter : v));
        });
      }
  
      // Update the candidate's votes and voter_id array
      const candidate = this.candidates().find(candidate => candidate.id === candidateId);
      if (candidate) {
        candidate.votes += 1;
  
        if (!Array.isArray(candidate.voter_id)) {
          candidate.voter_id = [];
        }
  
        candidate.voter_id.push(voterId);
  
        this.service.updateCandidate(candidate).subscribe(() => {
          this.snackBar.open('Vote cast successfully!', 'Close', { duration: 2000 });
  
          // Update the signal
          this.candidates.update(candidates => candidates.map(c => c.id === candidate.id ? candidate : c));
  
          // Remove the voter from the form options after voting
          this.votersData.update(voters => voters.filter(v => v.id !== voterId));
  
          // Reset the form
          this.voteForm.reset();
        });
      }
    }

}


