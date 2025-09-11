import type { ValidationErrors } from '@angular/forms';
import type { OnInit, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Component, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { marked } from 'marked';
import mermaid from 'mermaid';
import { ProjectStatusService } from '../../../services/project/status.service';
import { ProjectComplexityService } from '../../../services/project/complexity.service';
import { ProjectToolService } from '../../../services/project/tool.service';
import { ProjectTopicService } from '../../../services/project/topic.service';
import { ProjectRoleService } from '../../../services/project/role.service';
import { ProjectMemberService } from '../../../services/project/member.service';
import { TeamCardComponent } from '../../cards/team-card/team-card.component';
import { RequestCardComponent } from '../../cards/request-card/request-card.component';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../../../interfaces/project/project.interface';
import type { TeamRequest } from '../../cards/request-card/request-card.component';

interface OptionWithColor {
  label: string;
  value: number;
  color?: string;
}

interface Option {
  label: string;
  value: number;
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
export class ProjectFormComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() project?: Project;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<CreateProjectRequest | UpdateProjectRequest>();
  @Output() cancelAction = new EventEmitter<void>();

  private _teamPending: any[] = [];
  projectForm!: FormGroup;
  defaultAvatar = '/default_avatar.png';
  isBrowser = false;
  markdownPreview: string | undefined = '';
  isFormReady = false;

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
    private formBuilder: FormBuilder,
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

    this.statusService.getAll().subscribe((status) => {
      this.statusOptions = status.map((status) => ({
        label: status.name,
        value: status.id,
      }));
      checkAndPatch();
    });

    this.complexityService.getAll().subscribe((complexities) => {
      this.complexityOptions = complexities.map((complexity) => ({
        label: complexity.name,
        value: complexity.id,
        color: complexity.hexColor,
      }));
      this.tagOptions.complexity = this.complexityOptions;
      checkAndPatch();
    });

    this.toolService.getAll().subscribe((tools) => {
      this.toolOptions = tools.map((tool) => ({
        label: tool.name,
        value: tool.id,
        color: tool.hexColor,
      }));
      this.tagOptions.tools = this.toolOptions;
      checkAndPatch();
    });

    this.topicService.getAll().subscribe((topics) => {
      this.topicOptions = topics.map((topic) => ({
        label: topic.name,
        value: topic.id,
        color: topic.hexColor,
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
    const teamArray = this.formBuilder.array([]);
    const tagsArray = this.formBuilder.array([]);

    this.projectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      summary: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      team: teamArray,
      tags: tagsArray,
      image: [''],
      status: [null],
      startDate: [null, [Validators.required]],
      endDate: [null],
      managerRoleId: [null, this.isEditMode ? [] : [Validators.required]],
      unfilledRoles: [[], [this.maxItemsValidator(8)]],
      selectedTools: [[]],
      selectedTopics: [[]],
      selectedComplexity: [null],
      discord: [''],
      github: [''],
      projectWebsite: [''],
    });

    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
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
    const managerRoleId = manager?.roleId ? Number(manager.roleId) : null;

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
      discord: this.project.discord || '',
      github: this.project.github || '',
      projectWebsite: this.project.projectWebsite || '',
    });

    const teamArray = this.projectForm.get('team') as FormArray;
    teamArray.clear();
    (this.project.members || []).forEach((member) => {
      let memberFullname = `${member.user.firstName}  ${member.user.lastName}`;
      const roleName = this.getRoleName(member.roleId);

      teamArray.push(
        this.formBuilder.group({
          id: [member.id],
          name: [memberFullname],
          user: [member.user],
          username: [member.user?.username || ''],
          role: [roleName],
          memberStatus: [member.memberStatus],
          isManager: [member.isManager || false],
          applicationMessage: [member.applicationMessage],
          createdAt: [member.createdAt],
        }),
      );
    });

    this.updateTagsFromSelects();
    this.updateTeamPending();
  }

  private getRoleName(roleId: number): string {
    if (roleId == null) return '';
    const foundRole = this.roleOptions.find((option) => String(option.value) === String(roleId));
    return foundRole ? foundRole.label : String(roleId);
  }

  private addTag(type: 'tool' | 'topic' | 'complexity', value: string, color?: string): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    let label = value;
    let found;
    if (type === 'tool') {
      found = this.toolOptions.find(
        (tool) => String(tool.value) === String(value) || tool.label === value,
      );
    } else if (type === 'topic') {
      found = this.topicOptions.find(
        (topic) => String(topic.value) === String(value) || topic.label === value,
      );
    } else if (type === 'complexity') {
      found = this.complexityOptions.find(
        (complexity) => String(complexity.value) === String(value) || complexity.label === value,
      );
    }
    if (found) label = found.label;
    tagsArray.push(
      this.formBuilder.group({ id: this.generateId(), name: label, type, color: color || '' }),
    );
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
      discord: formValue.discord,
      github: formValue.github,
      projectWebsite: formValue.projectWebsite,
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

  private processMermaidDiagrams(): void {
    if (!this.isBrowser) return;
    if (!this.markdownPreview) return;

    setTimeout(() => {
      const mermaidBlocks = document.querySelectorAll('.language-mermaid');
      mermaidBlocks.forEach((block) => {
        const code = block.textContent || '';
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.textContent = code;
        block.parentNode?.replaceChild(container, block);

        try {
          void mermaid.init(undefined, container);
        } catch {
          container.textContent = 'Erro ao renderizar diagrama Mermaid';
        }
      });
    }, 0);
  }

  ngAfterViewChecked(): void {
    this.processMermaidDiagrams();
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

  private updateTeamPending() {
    if (!this.teamArray?.controls) {
      this._teamPending = [];
      return;
    }
    this._teamPending = this.teamArray.controls
      .map((control) => control.value)
      .filter((member: any) => member.memberStatus?.id === 1);
  }

  onRequestCardAcceptRequest(request: TeamRequest): void {
    this.memberService.approve(request.id).subscribe({
      next: () => {
        this.setMemberStatus(request.id, 2, 'Aprovado');
        this.updateTeamPending();
      },
    });
  }

  onRequestCardRejectRequest(request: TeamRequest): void {
    this.memberService.reject(request.id, request.feedback || '').subscribe({
      next: () => {
        this.setMemberStatus(request.id, 3, 'Recusado');
        this.updateTeamPending();
      },
    });
  }

  private setMemberStatus(memberId: number, statusId: number, statusName: string): void {
    const teamArray = this.projectForm.get('team') as FormArray;
    const memberControl = teamArray.controls.find((control) => control.value.id === memberId);
    if (memberControl) {
      const memberStatus = memberControl.value.memberStatus || {};
      memberControl.patchValue({
        memberStatus: { ...memberStatus, id: statusId, name: statusName },
      });
    }
  }

  removeTag(index: number): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    tagsArray.removeAt(index);
  }

  get tagsArray(): any[] {
    return (this.projectForm.get('tags') as FormArray).value;
  }
  get teamApproved() {
    if (!this.teamArray?.controls) return [];
    return this.teamArray.controls
      .map((control) => control.value)
      .filter((member: any) => member.memberStatus?.id === 2);
  }
  get teamPending() {
    return this._teamPending;
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
