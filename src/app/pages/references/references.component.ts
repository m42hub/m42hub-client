import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-references',
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CalendarModule,
    CardModule,
  ],
  templateUrl: './references.component.html',
  styleUrl: './references.component.css',
})
export class ReferencesComponent {}
