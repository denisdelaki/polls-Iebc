import { Component, OnInit, Input, signal, computed, effect } from '@angular/core';
import { Candidates } from '../../interfaces/candidates';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  candidatesData= signal<Candidates[]>([])
  constructor(private service: ServicesService) {
    effect(()=>{
      //get candidate data
      this.service.getCandidates().subscribe(data => {
      this.candidatesData.set(data);
    });
    this.candidatesData.update
  }, { allowSignalWrites: true })
}
  ngOnInit(): void {}

 sortedCandidates = computed(() => {
  return this.candidatesData().slice().sort((a: Candidates, b: Candidates) => b.votes - a.votes);
});
}
