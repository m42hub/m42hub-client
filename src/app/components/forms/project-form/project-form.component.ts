import type { ValidationErrors } from '@angular/forms';
import type { OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule, FormControl, Validators, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { marked } from 'marked';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../../../interfaces/project/project.interface';

interface OptionWithColor {
  label: string;
  value: number;
  color?: string;
}

interface Option {
  label: string;
  value: number;
}

import { ProjectStatusService } from '../../../services/project/status.service';
import { ProjectComplexityService } from '../../../services/project/complexity.service';
import { ProjectToolService } from '../../../services/project/tool.service';
import { ProjectTopicService } from '../../../services/project/topic.service';
import { ProjectRoleService } from '../../../services/project/role.service';
import { ProjectMemberService } from '../../../services/project/member.service';
import { TeamCardComponent } from '../../cards/team-card/team-card.component';
import { RequestCardComponent } from '../../cards/request-card/request-card.component';

export interface TeamRequest {
  id: string;
  userId: string;
  username: string;
  userPhoto: string;
  requestedRole: string;
  message?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ChipModule,
    TagModule,
    AvatarModule,
    DialogModule,
    TabsModule,
    TextareaModule,
    MultiSelectModule,
    TooltipModule,
    TeamCardComponent,
    RequestCardComponent,
  ],

  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
})
export class ProjectFormComponent implements OnInit, OnChanges {
  @Input() project?: Project;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<CreateProjectRequest | UpdateProjectRequest>();
  @Output() cancelAction = new EventEmitter<void>();

  projectForm!: FormGroup;
  defaultAvatar = '/default_avatar.png';
  isBrowser = false;
  markdownPreview = '';
  isFormReady = false;

  showEditMemberDialog = false;
  editingMemberIndex = -1;
  editingMemberForm!: FormGroup;
  showAddMemberDialog = false;
  addMemberForm!: FormGroup;

  statusOptions: Option[] = [];
  complexityOptions: OptionWithColor[] = [];
  toolOptions: OptionWithColor[] = [];
  topicOptions: OptionWithColor[] = [];
  roleOptions: Option[] = [];
  tagOptions: {
    tools: OptionWithColor[];
    topics: OptionWithColor[];
    complexity: OptionWithColor[];
  } = { tools: [], topics: [], complexity: [] };

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private statusService: ProjectStatusService,
    private complexityService: ProjectComplexityService,
    private toolService: ProjectToolService,
    private topicService: ProjectTopicService,
    private roleService: ProjectRoleService,
    private memberService: ProjectMemberService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initForm();

    this.initDialogForms();

    this.loadOptions();

    if (this.isBrowser) {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      this.projectForm.get('description')?.valueChanges.subscribe((value) => {
        this.updateMarkdownPreview(value);
      });
    }

    this.isFormReady = true;
  }

  private loadOptions(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.statusOptions = [];
      this.complexityOptions = [];
      this.toolOptions = [];
      this.topicOptions = [];
      this.roleOptions = [];
      return;
    }

    let loadedCount = 0;
    const totalServices = 5;
    const checkAndPatch = () => {
      loadedCount++;
      if (loadedCount === totalServices && this.project && this.isEditMode) {
        this.patchFormWithProject();
      }
    };

    this.statusService.getAll().subscribe((statuses) => {
      this.statusOptions = statuses.map((s) => ({
        label: s.name,
        value: s.id,
      }));
      checkAndPatch();
    });

    this.complexityService.getAll().subscribe((complexities) => {
      this.complexityOptions = complexities.map((c) => ({
        label: c.name,
        value: c.id,
        color: c.hexColor,
      }));
      this.tagOptions.complexity = this.complexityOptions;
      checkAndPatch();
    });

    this.toolService.getAll().subscribe((tools) => {
      this.toolOptions = tools.map((t) => ({
        label: t.name,
        value: t.id,
        color: t.hexColor,
      }));
      this.tagOptions.tools = this.toolOptions;
      checkAndPatch();
    });

    this.topicService.getAll().subscribe((topics) => {
      this.topicOptions = topics.map((t) => ({
        label: t.name,
        value: t.id,
        color: t.hexColor,
      }));
      this.tagOptions.topics = this.topicOptions;
      checkAndPatch();
    });

    this.roleService.getAll().subscribe((roles) => {
      this.roleOptions = roles.map((r) => ({ label: r.name, value: r.id }));
      checkAndPatch();
    });
  }

  get showTeamCard(): boolean {
    return !!(
      this.isFormReady &&
      this.isEditMode &&
      this.isBrowser &&
      this.projectForm &&
      this.projectForm.get('team')
    );
  }

  get showTagsCard(): boolean {
    return this.isFormReady && !!this.projectForm?.get('tags');
  }

  get showManagerCard(): boolean {
    return (
      !this.isEditMode &&
      this.isFormReady &&
      this.isBrowser &&
      !!this.projectForm?.get('managerRoleId')
    );
  }

  get showUnfilledRolesCard(): boolean {
    return !!(
      this.isFormReady &&
      this.isBrowser &&
      this.projectForm &&
      this.projectForm.get('unfilledRoles')
    );
  }

  private initForm(): void {
    const teamArray = this.fb.array([]);
    const tagsArray = this.fb.array([]);

    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      summary: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      team: teamArray,
      tags: tagsArray,
      image: [''],
      status: [null],
      startDate: [null],
      endDate: [null],
      managerRoleId: [null, this.isEditMode ? [] : [Validators.required]],
      unfilledRoles: [[], [this.maxItemsValidator(8)]],
      selectedTools: [[]],
      selectedTopics: [[]],
      selectedComplexity: [null],
    });

    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
  }

  private initDialogForms(): void {
    this.editingMemberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      photo: [''],
      isManager: [false],
    });
    this.addMemberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      photo: [''],
      isManager: [false],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['project'] &&
      changes['project'].currentValue &&
      this.isEditMode &&
      this.projectForm
    ) {
      this.patchFormWithProject();
    }
  }

  private patchFormWithProject(): void {
    if (!this.project || !this.projectForm) {
      return;
    }

    const manager = this.project.members?.find((member) => member.isManager);
    const managerRoleId = manager?.role ? Number(manager.role) : null;

    this.projectForm.patchValue({
      name: this.project.name,
      summary: this.project.summary || '',
      description: this.project.description,
      image: this.project.imageUrl || '',
      status: this.project.status?.id ? Number(this.project.status.id) : null,
      startDate: this.project.startDate ? new Date(this.project.startDate) : null,
      endDate: this.project.endDate ? new Date(this.project.endDate) : null,
      managerRoleId: managerRoleId,
      unfilledRoles: this.project.unfilledRoles?.map((r) => Number(r.id)) || [],
      selectedTools: this.project.tools?.map((t) => Number(t.id)) || [],
      selectedTopics: this.project.topics?.map((t) => Number(t.id)) || [],
      selectedComplexity: this.project.complexity?.id ? Number(this.project.complexity.id) : null,
    });

    const teamArray = this.projectForm.get('team') as FormArray;
    teamArray.clear();
    (this.project.members || []).forEach((member) => {
      let memberFullname = `${member.user.firstName}  ${member.user.lastName}`;
      teamArray.push(
        this.fb.group({
          id: [member.id],
          name: [memberFullname],
          user: [member.user],
          role: [member.role],
          memberStatus: [member.memberStatus],
          isManager: [member.isManager || false],
          applicationMessage: [member.applicationMessage],
          createdAt: [member.createdAt],
        }),
      );
    });

    this.updateTagsFromSelects();
  }

  private addTag(type: 'tool' | 'topic' | 'complexity', value: string, color?: string): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    let label = value;
    let found;
    if (type === 'tool') {
      found = this.toolOptions.find((t) => String(t.value) === String(value) || t.label === value);
    } else if (type === 'topic') {
      found = this.topicOptions.find((t) => String(t.value) === String(value) || t.label === value);
    } else if (type === 'complexity') {
      found = this.complexityOptions.find(
        (c) => String(c.value) === String(value) || c.label === value,
      );
    }
    if (found) label = found.label;
    tagsArray.push(this.fb.group({ id: this.generateId(), name: label, type, color: color || '' }));
  }

  onToolsChange(): void {
    this.updateTagsFromSelects();
  }

  onTopicsChange(): void {
    this.updateTagsFromSelects();
  }

  onComplexityChange(): void {
    this.updateTagsFromSelects();
  }

  private updateTagsFromSelects(): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    tagsArray.clear();
    (this.projectForm.get('selectedTools')?.value || []).forEach((id: string | number) => {
      const found = this.toolOptions.find((t) => String(t.value) === String(id));
      this.addTag('tool', String(id), found?.color);
    });
    (this.projectForm.get('selectedTopics')?.value || []).forEach((id: string | number) => {
      const found = this.topicOptions.find((t) => String(t.value) === String(id));
      this.addTag('topic', String(id), found?.color);
    });
    const selectedComplexity = this.projectForm.get('selectedComplexity')?.value;
    if (selectedComplexity) {
      const found = this.complexityOptions.find(
        (c) => String(c.value) === String(selectedComplexity),
      );
      this.addTag('complexity', selectedComplexity, found?.color);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  get teamArray(): FormArray {
    return this.projectForm.get('team') as FormArray;
  }
  removeTeamMember(index: number): void {
    this.teamArray.removeAt(index);
  }

  getTeamForCard(filter?: 'approved' | 'pending'): any[] {
    let controls = this.teamArray.controls;
    if (filter === 'approved') {
      controls = controls.filter((c) => c.get('memberStatus')?.value?.id == 2);
    } else if (filter === 'pending') {
      controls = controls.filter((c) => c.get('memberStatus')?.value?.id == 1);
    }
    return controls.map((control, idx) => {
      const user = control.get('user')?.value;
      return {
        id: control.get('id')?.value || `temp-${idx}`,
        name: `${user.firstName} ${user.lastName}`,
        username: user?.username || '',
        role:
          this.roleOptions.find(
            (r) => r.value === control.get('role')?.value || r.label === control.get('role')?.value,
          )?.label || control.get('role')?.value,
        photo: control.get('photo')?.value || user?.photo || '',
        applicationMessage: control.get('applicationMessage')?.value || '',
        createdAt: control.get('createdAt')?.value || '',
      };
    });
  }
  onTeamCardRemoveMember(event: { index: number }): void {
    this.removeTeamMember(event.index);
  }
  onTeamCardEditMember(event: { index: number; member: any }): void {
    this.editingMemberIndex = event.index;
    this.editingMemberForm.patchValue({
      name: event.member.name,
      username: event.member.username,
      role: event.member.role,
      photo: event.member.photo || '',
      isManager: event.member.isManager || false,
    });
    this.showEditMemberDialog = true;
  }

  onSaveEditMember(): void {
    if (this.editingMemberForm.valid && this.editingMemberIndex >= 0) {
      this.teamArray.at(this.editingMemberIndex).patchValue(this.editingMemberForm.value);
      this.showEditMemberDialog = false;
      this.editingMemberIndex = -1;
    }
  }

  onCancelEditMember(): void {
    this.showEditMemberDialog = false;
    this.editingMemberIndex = -1;
  }

  onAddMember(): void {
    this.addMemberForm.reset();
    this.showAddMemberDialog = true;
  }
  onSaveAddMember(): void {
    if (this.addMemberForm.valid) {
      this.teamArray.push(
        this.fb.group({
          id: [this.generateId()],
          name: [this.addMemberForm.value.name],
          username: [this.addMemberForm.value.username],
          role: [this.addMemberForm.value.role],
          photo: [this.addMemberForm.value.photo || ''],
          isManager: [this.addMemberForm.value.isManager || false],
        }),
      );
      this.showAddMemberDialog = false;
    }
  }

  onCancelAddMember(): void {
    this.showAddMemberDialog = false;
  }

  onSubmit(): void {
    if (!this.projectForm.valid) {
      this.markFormGroupTouched();
      return;
    }
    const formValue = this.projectForm.value;
    const req = {
      name: formValue.name,
      summary: formValue.summary,
      description: formValue.description,
      statusId: formValue.status,
      complexityId: formValue.selectedComplexity,
      imageUrl: formValue.image && formValue.image.trim() !== '' ? formValue.image.trim() : null,
      startDate: formValue.startDate ? formValue.startDate.toISOString() : null,
      endDate: formValue.endDate ? formValue.endDate.toISOString() : null,
      toolIds: formValue.selectedTools,
      topicIds: formValue.selectedTopics,
      unfilledRoleIds: formValue.unfilledRoles,
    };
    if (this.isEditMode) this.save.emit(req as UpdateProjectRequest);
    else this.save.emit({ ...req, managerRoleId: formValue.managerRoleId } as CreateProjectRequest);
  }

  onCancel(): void {
    this.cancelAction.emit();
  }

  private markFormGroupTouched(): void {
    Object.values(this.projectForm.controls).forEach((control) => control?.markAsTouched());
  }

  formatDate(date: Date): string {
    if (this.isBrowser) {
      return new Date(date).toLocaleDateString('pt-BR');
    } else {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
    }
  }

  private updateMarkdownPreview(markdownText: string): void {
    if (!this.isBrowser) {
      this.markdownPreview = markdownText;
      return;
    }

    if (markdownText) {
      try {
        this.markdownPreview = marked.parse(markdownText) as string;
      } catch {
        this.markdownPreview = markdownText;
      }
    } else {
      this.markdownPreview = '';
    }
  }

  private maxItemsValidator(maxItems: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) return null;
      if (control.value.length > maxItems)
        return { maxItems: { max: maxItems, actual: control.value.length } };
      return null;
    };
  }

  feedbackDialogVisible = false;
  feedbackTextControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  feedbackRequest: any = null;

  onRequestCardAcceptRequest(request: any): void {
    if (!request?.id) {
      return;
    }
    this.memberService.approve(request.id).subscribe({
      next: () => {
        const teamArray = this.projectForm.get('team') as FormArray;
        if (!teamArray) {
          return;
        }
        for (let i = 0; i < teamArray.length; i++) {
          const member = teamArray.at(i);
          if (member.get('id')?.value === request.id) {
            member.patchValue({
              memberStatus: { id: 2, name: 'Aprovado' },
            });
            break;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao aprovar membro:', err);
      },
    });
  }

  onRequestCardRejectRequest(request: any): void {
    this.feedbackRequest = request;
    this.feedbackTextControl.reset('');
    this.feedbackDialogVisible = true;
  }

  confirmRejectRequest(): void {
    if (!this.feedbackRequest?.id) {
      return;
    }
    const feedback = this.feedbackTextControl.value || '';
    this.memberService.reject(this.feedbackRequest.id, feedback).subscribe({
      next: () => {
        const teamArray = this.projectForm.get('team') as FormArray;
        if (!teamArray) {
          return;
        }
        for (let i = 0; i < teamArray.length; i++) {
          const member = teamArray.at(i);
          if (member.get('id')?.value === this.feedbackRequest.id) {
            teamArray.removeAt(i);
            break;
          }
        }
        this.closeFeedbackDialog();
      },
      error: (err) => {
        console.error('Erro ao rejeitar membro:', err);
        this.closeFeedbackDialog();
      },
    });
  }

  closeFeedbackDialog(): void {
    this.feedbackDialogVisible = false;
    this.feedbackTextControl.reset('');
    this.feedbackRequest = null;
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  removeTag(index: number): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    tagsArray.removeAt(index);
  }

  get tagsArray(): any[] {
    return (this.projectForm.get('tags') as FormArray).value;
  }

  get teamApproved() {
    return this.getTeamForCard('approved');
  }
  get teamPending() {
    return this.getTeamForCard('pending');
  }
  get nameControl() {
    return this.projectForm.get('name');
  }
  get summaryControl() {
    return this.projectForm.get('summary');
  }
  get descriptionControl() {
    return this.projectForm.get('description');
  }
  get teamControl() {
    return this.projectForm.get('team');
  }
  get tagsControl() {
    return this.projectForm.get('tags');
  }
  get managerRoleIdControl() {
    return this.projectForm.get('managerRoleId');
  }
  get unfilledRolesControl() {
    return this.projectForm.get('unfilledRoles');
  }
}
