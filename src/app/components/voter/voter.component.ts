import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../material/material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../../services/services.service';
import { Voter } from '../../interfaces/voter';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-voter',
  standalone: true,
  imports: [MaterialModule, HttpClientModule],
  templateUrl: './voter.component.html',
  styleUrls: ['./voter.component.css']
})
export class VoterComponent {
  voterForm!: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private voteService: ServicesService,
    public dialogRef: MatDialogRef<VoterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Voter [],
    private snackBar: MatSnackBar
  ) {
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
          this.snackBar.open('Voter registered successfully:', 'Close', { duration: 2000 });
          // Pass the new voter data back
          this.dialogRef.close(response); 
        },
        (error) => {
          this.snackBar.open('Error registering voter:', 'Close', { duration: 2000 });
          console.error(error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }


}
