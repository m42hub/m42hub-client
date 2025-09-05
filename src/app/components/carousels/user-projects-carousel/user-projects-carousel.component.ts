import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import type { ProjectMemberProject } from '../../../interfaces/project/member.interface';
import { UserProjectSummaryCardComponent } from '../../cards/user-project-summary-card/user-project-summary-card.component';

@Component({
  selector: 'app-user-projects-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule, UserProjectSummaryCardComponent],
  templateUrl: './user-projects-carousel.component.html',
  styleUrl: './user-projects-carousel.component.css',
})
export class UserProjectsCarouselComponent {
  @Input() projects: ProjectMemberProject[] = [];
  @Input() numVisible = 3;
  @Input() showRequestDate = false;
}
