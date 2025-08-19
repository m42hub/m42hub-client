import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../interfaces/project/project.interface';
import { TeamCardComponent, TeamMember } from '../../cards/team-card/team-card.component';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProjectRoleService } from '../../../services/project/role.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ProjectRole } from '../../../interfaces/project/role.interface';
import { JoinProjectModalComponent } from '../../modals/join-project-modal/join-project-modal.component';

@Component({
  selector: 'app-project-info-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TeamCardComponent,
    CardModule,
    TagModule,
    ButtonModule,
    JoinProjectModalComponent
  ],
  templateUrl: './project-info-sidebar.component.html',
  styleUrl: './project-info-sidebar.component.css',
})
export class ProjectInfoSidebarComponent implements OnInit {
  @Input() project!: Project;

  private rolesMap: Map<number, string> = new Map();
  defaultAvatar = '/default_avatar.png';

  showJoinModal = false;
  availableRoles: ProjectRole[] = [];

  constructor(
    private roleService: ProjectRoleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (roles: ProjectRole[]) => {
        roles.forEach((role) => {
          this.rolesMap.set(role.id, role.name);
        });
      },
      error: (error) => {
        console.error('Erro ao carregar roles:', error);
      },
    });
  }

  private getRoleName(roleId: number): string {
    const roleName = this.rolesMap.get(roleId);
    if (roleName) {
      return roleName;
    }
    return '';
  }

  private getUserAvatar(user: any): string {
    if (user.photo) return user.photo;
    return this.defaultAvatar;
  }

  getTeamMembers(): TeamMember[] {
    return (
      this.project.members?.filter(member => member.memberStatus.id == 2)
        .map(member => {
          let roleName = this.getRoleName(member.role);

          if (member.isManager) {
            roleName = `${roleName} (​​Idealizador)`;
          }

          return {
            id: member.id.toString(),
            name: `${member.user.firstName} ${member.user.lastName}`,
            username: `${member.user.username}`,
            role: roleName || '',
            photo: this.getUserAvatar(member.user),
            isManager: member.isManager,
          };
        }) || []
    );
  }

  get canJoinProject(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.project.unfilledRoles || this.project.unfilledRoles.length < 1) {
      return false;
    }

    const isAlreadyMember = this.project.members?.some(
      member => member.user.username === currentUser.username
    );

    return !isAlreadyMember;
  }

  openJoinModal(): void {
    if (!this.canJoinProject) return;
    this.availableRoles = this.project.unfilledRoles || [];
    this.showJoinModal = true;
  }

  closeJoinModal(): void {
    this.showJoinModal = false;
  }
}
