import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../interfaces/project.interface';
import { TeamCardComponent } from '../../cards/team-card/team-card.component';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-project-info-sidebar',
  standalone: true,
  imports: [CommonModule, TeamCardComponent, CardModule, TagModule],
  templateUrl: './project-info-sidebar.component.html',
  styleUrl: './project-info-sidebar.component.css'
})
export class ProjectInfoSidebarComponent {
  @Input() project!: Project;
}
