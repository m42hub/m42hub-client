import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../interfaces/project/project.interface';
import { TeamCardComponent, TeamMember } from '../../cards/team-card/team-card.component';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProjectRoleService } from '../../../services/project/role.service';
import { ProjectRole } from '../../../interfaces/project/role.interface';

@Component({
  selector: 'app-project-info-sidebar',
  standalone: true,
  imports: [CommonModule, TeamCardComponent, CardModule, TagModule],
  templateUrl: './project-info-sidebar.component.html',
  styleUrl: './project-info-sidebar.component.css',
})
export class ProjectInfoSidebarComponent implements OnInit {
  @Input() project!: Project;

  private rolesMap: Map<number, string> = new Map();
  defaultAvatar = '/default_avatar.png';

  constructor(private roleService: ProjectRoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    // Carrega todos os roles disponíveis para mapear IDs para nomes
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
      this.project.members?.map((member) => {
        let roleName = this.getRoleName(member.role);

        // Se for manager, adiciona essa informação ao role
        if (member.isManager) {
          roleName = `${roleName} (Gerente)`;
        }

        return {
          id: member.id.toString(),
          name: `${member.user.firstName} ${member.user.lastName}`,
          role: roleName || '',
          photo: this.getUserAvatar(member.user),
          isManager: member.isManager,
        };
      }) || []
    );
  }
}
