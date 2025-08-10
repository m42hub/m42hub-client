import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-disclaimer-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './disclaimer-modal.component.html',
  styleUrl: './disclaimer-modal.component.css'
})
export class DisclaimerModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() accepted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onAccept(): void {
    this.closeModal();
    this.accepted.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.closeModal();
  }

  private closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
