import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../interfaces/project/project.interface';
import { TeamCardComponent, TeamMember } from '../../cards/team-card/team-card.component';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProjectRoleService } from '../../../services/project/role.service';
import { ProjectMemberService } from '../../../services/project/member.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ProjectRole } from '../../../interfaces/project/role.interface';
import { ApplyProjectMember } from '../../../interfaces/project/member.interface';

@Component({
  selector: 'app-project-info-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TeamCardComponent,
    CardModule,
    TagModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    TextareaModule,
    MessageModule
  ],
  templateUrl: './project-info-sidebar.component.html',
  styleUrl: './project-info-sidebar.component.css',
})
export class ProjectInfoSidebarComponent implements OnInit {
  @Input() project!: Project;

  private rolesMap: Map<number, string> = new Map();
  defaultAvatar = '/default_avatar.png';

  // Modal state
  showJoinModal = false;
  joinForm: FormGroup;
  availableRoles: ProjectRole[] = [];
  isSubmitting = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' | null = null;

  constructor(
    private roleService: ProjectRoleService,
    private memberService: ProjectMemberService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.joinForm = this.formBuilder.group({
      roleId: ['', Validators.required],
      applicationMessage: ['', [Validators.maxLength(500)]]
    });
  }

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
          username: `${member.user.username}`,
          role: roleName || '',
          photo: this.getUserAvatar(member.user),
          isManager: member.isManager,
        };
      }) || []
    );
  }

  // Join project functionality
  get canJoinProject(): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !this.project.unfilledRoles || this.project.unfilledRoles.length === 0) {
      return false;
    }

    // Check if user is already a member by username
    const isAlreadyMember = this.project.members?.some(
      member => member.user.username === currentUser.username
    );

    return !isAlreadyMember;
  }

  openJoinModal(): void {
    if (!this.canJoinProject) return;

    this.availableRoles = this.project.unfilledRoles || [];
    this.showJoinModal = true;
    this.joinForm.reset();
    this.submitMessage = '';
    this.submitMessageType = null;
  }

  closeJoinModal(): void {
    this.showJoinModal = false;
    this.joinForm.reset();
    this.submitMessage = '';
    this.submitMessageType = null;
  }

  submitJoinRequest(): void {
    if (this.joinForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitMessageType = null;

    const formValue = this.joinForm.value;
    const applicationData: ApplyProjectMember = {
      projectId: this.project.id,
      roleId: parseInt(formValue.roleId),
      isManager: false, // Default to false, unless there's a specific UI for this
      applicationMessage: formValue.applicationMessage || null
    };

    this.memberService.apply(applicationData).subscribe({
      next: (response) => {
        this.submitMessage = 'Solicitação enviada com sucesso!';
        this.submitMessageType = 'success';
        this.isSubmitting = false;

        // Close modal after a delay
        setTimeout(() => {
          this.closeJoinModal();
        }, 2000);
      },
      error: (error) => {
        console.error('Erro ao enviar solicitação:', error);
        this.submitMessage = 'Erro ao enviar solicitação. Tente novamente.';
        this.submitMessageType = 'error';
        this.isSubmitting = false;
      }
    });
  }
}
