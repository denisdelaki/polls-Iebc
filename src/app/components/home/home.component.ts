import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material/material.module';
import { ResultsComponent } from '../results/results.component';
import { VotesComponent } from '../votes/votes.component';
import { CandidatesComponent } from '../candidates/candidates.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ResultsComponent,
    VotesComponent,
    CandidatesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
