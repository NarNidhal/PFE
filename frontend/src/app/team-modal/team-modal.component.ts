import { CommonModule } from '@angular/common';
import { Component , EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [  FormsModule, CommonModule],
  templateUrl: './team-modal.component.html',
  styleUrl: './team-modal.component.css'
})
export class TeamModalComponent {
  @Input() teamName!: string;
  @Input() users: any[] = [];
  @Output() close = new EventEmitter<void>(); // Emit an event to parent


  closeModal() {
    this.close.emit(); // Notify parent to close modal
  }
}
