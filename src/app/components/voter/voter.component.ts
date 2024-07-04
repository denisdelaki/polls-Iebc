import { Component, Output, signal } from '@angular/core';
import { MaterialModule } from '../../material/material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import { Voter } from '../../interfaces/voter';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-voter',
  standalone: true,
  imports: [MaterialModule, HttpClientModule],
  templateUrl: './voter.component.html',
  styleUrl: './voter.component.css'
})
export class VoterComponent {
@Output() votersData=signal<Voter[]>([]);
voterForm!: FormGroup<any>;
constructor(private fb: FormBuilder, private voteService: ServicesService) {
  this.voterForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    nationality: ['', Validators.required],
    id_number: ['', [Validators.required, ]]
  });
}

registerVoter(): void {
  if (this.voterForm.valid) {
    const newVoter: Voter = {
      ...this.voterForm.value,
      voted: false 
    };
    
    this.voteService.addVoter(newVoter).subscribe(
      (response) => {
        console.log('Voter registered successfully:', response);
        this.votersData.update((prevVoters) => [...prevVoters, response]);
        this.voterForm.reset();
      },
      (error) => {
        console.error('Error registering voter:', error);
      }
    );
  } else {
    console.log('Form is invalid');
  }
}

}
