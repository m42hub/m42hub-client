import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import type { ProjectRole } from '../../../interfaces/project/role.interface';
import type { ApplyProjectMember } from '../../../interfaces/project/member.interface';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ProjectMemberService } from '../../../services/project/member.service';

@Component({
  selector: 'app-join-project-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    TextareaModule,
    MessageModule,
    ButtonModule,
  ],
  templateUrl: './join-project-modal.component.html',
  styleUrl: './join-project-modal.component.css',
})
export class JoinProjectModalComponent {
  @Input() visible = false;
  @Input() availableRoles: ProjectRole[] = [];
  @Input() project: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() completedModal = new EventEmitter<void>();

  joinForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private memberService: ProjectMemberService,
  ) {
    this.joinForm = this.formBuilder.group({
      roleId: ['', Validators.required],
      applicationMessage: ['', [Validators.maxLength(500)]],
    });
  }

  onClose(): void {
    this.closeModal.emit();
    this.joinForm.reset();
    this.submitMessage = '';
    this.submitMessageType = null;
  }

  onSubmit(): void {
    if (this.joinForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitMessageType = null;

    const formValue = this.joinForm.value;
    const applicationData: ApplyProjectMember = {
      projectId: this.project.id,
      roleId: parseInt(formValue.roleId),
      isManager: false,
      applicationMessage: formValue.applicationMessage || null,
    };

    this.memberService.apply(applicationData).subscribe({
      next: (_response: any) => {
        this.submitMessage = 'Solicitação enviada com sucesso!';
        this.submitMessageType = 'success';
        this.isSubmitting = false;

        setTimeout(() => {
          this.closeModal.emit();
          window.location.reload();
        }, 2000);
      },
      error: (error: any) => {
        console.error('Erro ao enviar solicitação:', error);
        this.submitMessage = 'Erro ao enviar solicitação. Tente novamente.';
        this.submitMessageType = 'error';
        this.isSubmitting = false;
      },
    });
  }
}
