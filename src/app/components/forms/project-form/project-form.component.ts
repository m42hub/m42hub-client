import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TabsModule  } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { marked } from 'marked';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../../../interfaces/project/project.interface';
import { ProjectStatusService } from '../../../services/project/status.service';
import { ProjectComplexityService } from '../../../services/project/complexity.service';
import { ProjectToolService } from '../../../services/project/tool.service';
import { ProjectTopicService } from '../../../services/project/topic.service';
import { ProjectRoleService } from '../../../services/project/role.service';
import { ProjectMemberService } from '../../../services/project/member.service';
import { TeamCardComponent } from '../../cards/team-card/team-card.component';
import { RequestCardComponent } from '../../cards/request-card/request-card.component';

// Interface para solicitações pendentes
export interface TeamRequest {
  id: string;
  userId: string;
  userName: string;
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
    RequestCardComponent
],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
})
export class ProjectFormComponent implements OnInit, OnChanges {
  @Input() project?: Project;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<
    CreateProjectRequest | UpdateProjectRequest
  >();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  defaultAvatar = '/default_avatar.png';
  isBrowser = false;
  markdownPreview = '';
  isFormReady = false;

  // Dialog para edição de membros
  showEditMemberDialog = false;
  editingMemberIndex = -1;
  editingMemberForm!: FormGroup;

  // Dialog para adicionar membros
  showAddMemberDialog = false;
  addMemberForm!: FormGroup;

  // statusOptions e tagOptions devem ser carregados de services reais futuramente
  statusOptions: { label: string; value: number }[] = [];
  // tagOptions já declarado acima, removendo duplicidade

  // Tags padronizadas por categoria
  tagOptions: any = {
    'tecnologias/ferramentas': [],
    assuntos: [],
    tempoEstimado: [],
    complexidade: [],
  };
  complexityOptions: { label: string; value: number; color?: string }[] = [];
  toolOptions: { label: string; value: number; color?: string }[] = [];
  topicOptions: { label: string; value: number; color?: string }[] = [];
  roleOptions: { label: string; value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private statusService: ProjectStatusService,
    private complexityService: ProjectComplexityService,
    private toolService: ProjectToolService,
    private topicService: ProjectTopicService,
    private roleService: ProjectRoleService,
    private memberService: ProjectMemberService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Inicializar formulário primeiro
    this.initForm();

    // Inicializar formulários dos dialogs
    this.initDialogForms();

    // Carregar opções dinâmicas
    this.loadOptions();

    // Configurar marked apenas no browser para evitar erros SSR
    if (this.isBrowser) {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      // Atualizar preview quando o valor da descrição mudar (apenas no browser)
      this.projectForm.get('description')?.valueChanges.subscribe((value) => {
        this.updateMarkdownPreview(value);
      });
    }

    // Marcar formulário como pronto
    this.isFormReady = true;

    // Aguardar o próximo ciclo de detecção de mudanças antes de fazer patch
    setTimeout(() => {
      if (this.project && this.isEditMode) {
        this.patchFormWithProject();
      }
    }, 0);
  }
  private loadOptions(): void {
    this.statusService.getAllProjects().subscribe((statuses) => {
      this.statusOptions = statuses.map((s) => ({
        label: s.name,
        value: s.id,
      }));
    });
    this.complexityService.getAllProjects().subscribe((complexities) => {
      this.complexityOptions = complexities.map((c) => ({
        label: c.name,
        value: c.id,
        color: c.hexColor,
      }));
      this.tagOptions.complexidade = this.complexityOptions;
    });
    this.toolService.getAllProjects().subscribe((tools) => {
      this.toolOptions = tools.map((t) => ({
        label: t.name,
        value: t.id,
        color: t.hexColor,
      }));
      this.tagOptions['tecnologias/ferramentas'] = this.toolOptions;
    });
    this.topicService.getAllProjects().subscribe((topics) => {
      this.topicOptions = topics.map((t) => ({
        label: t.name,
        value: t.id,
        color: t.hexColor,
      }));
      this.tagOptions.assuntos = this.topicOptions;
    });
    this.roleService.getAllProjects().subscribe((roles) => {
      this.roleOptions = roles.map((r) => ({ label: r.name, value: r.id }));
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['project'] &&
      changes['project'].currentValue &&
      this.isEditMode &&
      this.projectForm
    ) {
      // Aguardar o próximo ciclo de detecção de mudanças
      setTimeout(() => {
        this.patchFormWithProject();
      }, 0);
    }
  }

  private initForm(): void {
    // Criar o FormArray para team
    const teamArray = this.fb.array([]);

    // Criar o FormArray para tags
    const tagsArray = this.fb.array([]);

    // Criar o formulário principal
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      team: teamArray,
      tags: tagsArray,
      image: [''],
      status: ['active'],
      startDate: [null],
      expectedDate: [null],
      unfilledRoles: [[], [this.maxItemsValidator(8)]],
      // Controles para os selects
      selectedTecnologiasFerramentas: [[]],
      selectedAssuntos: [[]],
      selectedTempoEstimado: [null],
      selectedComplexidade: [null],
    });

    // Garantir que o formulário está marcado como inicializado
    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
  }

  private initDialogForms(): void {
    // Inicializar formulário de edição de membros
    this.editingMemberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      photo: [''],
      isManager: [false],
    });

    // Inicializar formulário de adição de membros
    this.addMemberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      photo: [''],
      isManager: [false],
    });
  }

  private patchFormWithProject(): void {
    if (!this.project || !this.projectForm) return;

    this.projectForm.patchValue({
      name: this.project.name,
      summary: this.project.summary || '',
      description: this.project.description,
      image: this.project.imageUrl || '',
      status: this.project.status || '',
      startDate: this.project.startDate,
      expectedDate: this.project.endDate,
      unfilledRoles: this.project.unfilledRoles?.map((r) => r.id) || [],
    });

    // Patch da equipe
    const teamArray = this.projectForm.get('team') as FormArray;
    teamArray.clear();
    (this.project.members || []).forEach((member) => {
      let memberFullname: string = `${member.user.firstName}  ${member.user.lastName}`;
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
        })
      );
    });

    // Patch das tags (tools/topics/complexity)
    // Aqui você pode adaptar para preencher selects se necessário
  }

  // Métodos para gerenciar tags
  addTag(
    type:
      | 'tecnologias/ferramentas'
      | 'assuntos'
      | 'tempoEstimado'
      | 'complexidade',
    value: string,
    color?: string
  ): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    let label = value;
    if (type === 'tecnologias/ferramentas') {
      const found = this.toolOptions.find(
        (t) => String(t.value) === String(value) || t.label === value
      );
      label = found ? found.label : value;
    } else if (type === 'assuntos') {
      const found = this.topicOptions.find(
        (t) => String(t.value) === String(value) || t.label === value
      );
      label = found ? found.label : value;
    } else if (type === 'complexidade') {
      const found = this.complexityOptions.find(
        (c) => String(c.value) === String(value) || c.label === value
      );
      label = found ? found.label : value;
    }
    const newTag = {
      id: this.generateId(),
      name: label,
      type: type,
      color: color || '',
    };
    tagsArray.push(this.fb.group(newTag));
  }

  removeTag(index: number): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    tagsArray.removeAt(index);
  }

  getTagsByType(type: string): any[] {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    return tagsArray.value.filter((tag: any) => tag.type === type);
  }

  isTagSelected(type: string, value: string): boolean {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    return tagsArray.value.some(
      (tag: any) => tag.type === type && tag.name === value
    );
  }

  getTagsArray(): FormArray {
    return this.projectForm.get('tags') as FormArray;
  }

  onTecnologiasFerramentasChange(event: any): void {
    this.updateTagsFromSelects();
  }

  onAssuntosChange(event: any): void {
    this.updateTagsFromSelects();
  }

  onTempoEstimadoChange(event: any): void {
    this.updateTagsFromSelects();
  }

  onComplexidadeChange(event: any): void {
    this.updateTagsFromSelects();
  }

  private updateTagsFromSelects(): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    const selectedTecnologiasFerramentas =
      this.projectForm.get('selectedTecnologiasFerramentas')?.value || [];
    const selectedAssuntos =
      this.projectForm.get('selectedAssuntos')?.value || [];
    const selectedTempoEstimado = this.projectForm.get(
      'selectedTempoEstimado'
    )?.value;
    const selectedComplexidade = this.projectForm.get(
      'selectedComplexidade'
    )?.value;

    tagsArray.clear();

    // Adicionar tags de tecnologias/ferramentas

    selectedTecnologiasFerramentas.forEach((id: string | number) => {
      const found = this.toolOptions.find(
        (t) => String(t.value) === String(id)
      );
      const color = found?.color || '';
      this.addTag('tecnologias/ferramentas', String(id), color);
    });

    // Adicionar tags de assuntos
    selectedAssuntos.forEach((id: string | number) => {
      const found = this.topicOptions.find(
        (t) => String(t.value) === String(id)
      );
      const color = found?.color || '';
      this.addTag('assuntos', String(id), color);
    });

    // Adicionar tag de tempo estimado (mantém sem cor)
    if (selectedTempoEstimado) {
      this.addTag('tempoEstimado', selectedTempoEstimado);
    }

    // Adicionar tag de complexidade
    if (selectedComplexidade) {
      const found = this.complexityOptions.find(
        (c) => String(c.value) === String(selectedComplexidade)
      );
      const color = found?.color || '';
      this.addTag('complexidade', selectedComplexidade, color);
    }
  }

  // Métodos auxiliares
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Team management (apenas para edição)
  get teamArray(): FormArray {
    return this.projectForm.get('team') as FormArray;
  }

  updateMemberRole(index: number, newRole: string): void {
    const member = this.teamArray.at(index);
    member.patchValue({ role: newRole });
  }

  removeTeamMember(index: number): void {
    this.teamArray.removeAt(index);
  }

  // Métodos para integração com team-card
  getTeamForCard(filter?: 'approved' | 'pending'): any[] {
    let filteredControls = this.teamArray.controls;

    if (filter === 'approved') {
      filteredControls = filteredControls.filter(
        (control) => control.get('memberStatus')?.value?.id == 2
      );
    } else if (filter === 'pending') {
      filteredControls = filteredControls.filter(
        (control) => control.get('memberStatus')?.value?.id == 1
      );
    }

    // O RequestCardComponent espera: id, name, role, photo, applicationMessage, createdAt
    return filteredControls.map((control, index) => {
      const id = control.get('id')?.value || `temp-${index}`;
      // Tenta pegar o nome do user, se existir, senão pega o campo name
      let name = '';
      const user = control.get('user')?.value;
      if (user && (user.firstName || user.lastName)) {
        name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      } else {
        name = control.get('name')?.value || '';
      }
      const roleId = control.get('role')?.value;
      const roleObj = this.roleOptions.find(
        (r) => r.value === roleId || r.label === roleId
      );
      const role = roleObj ? roleObj.label : roleId;
      const photo =
        control.get('photo')?.value || (user && user.photo) || '';
      const applicationMessage = control.get('applicationMessage')?.value || '';
      const createdAt = control.get('createdAt')?.value || '';

      return {
        id,
        name,
        role,
        photo,
        applicationMessage,
        createdAt
      };
    });
  }

  onTeamCardRemoveMember(event: { index: number; member: any }): void {
    this.removeTeamMember(event.index);
  }

  onTeamCardEditMember(event: { index: number; member: any }): void {
    this.editingMemberIndex = event.index;
    this.initEditMemberForm(event.member);
    this.showEditMemberDialog = true;
  }

  private initEditMemberForm(member: any): void {
    this.editingMemberForm.patchValue({
      name: member.name,
      role: member.role,
      photo: member.photo || '',
      isManager: member.isManager || false,
    });
  }

  onSaveEditMember(): void {
    if (this.editingMemberForm.valid && this.editingMemberIndex >= 0) {
      const memberControl = this.teamArray.at(this.editingMemberIndex);
      memberControl.patchValue(this.editingMemberForm.value);
      this.showEditMemberDialog = false;
      this.editingMemberIndex = -1;
    }
  }

  onCancelEditMember(): void {
    this.showEditMemberDialog = false;
    this.editingMemberIndex = -1;
  }

  // Métodos para adicionar membros
  onAddMember(): void {
    this.initAddMemberForm();
    this.showAddMemberDialog = true;
  }

  private initAddMemberForm(): void {
    this.addMemberForm.reset();
  }

  onSaveAddMember(): void {
    if (this.addMemberForm.valid) {
      const newMember = this.fb.group({
        id: [this.generateId()],
        name: [this.addMemberForm.value.name],
        role: [this.addMemberForm.value.role],
        photo: [this.addMemberForm.value.photo || ''],
        isManager: [this.addMemberForm.value.isManager || false],
      });

      this.teamArray.push(newMember);
      this.showAddMemberDialog = false;
    }
  }

  onCancelAddMember(): void {
    this.showAddMemberDialog = false;
  }

  // Métodos para integração com request-card removidos

  // Form submission
  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      // Montar o objeto para envio real (CreateProjectRequest ou UpdateProjectRequest)
      const request: CreateProjectRequest | UpdateProjectRequest = {
        name: formValue.name,
        summary: formValue.summary,
        description: formValue.description,
        statusId: formValue.status, // ajuste conforme necessário
        complexityId: formValue.selectedComplexidade, // ajuste conforme necessário
        imageUrl: formValue.image,
        startDate: formValue.startDate,
        endDate: formValue.expectedDate,
        toolIds: formValue.selectedTecnologiasFerramentas,
        topicIds: formValue.selectedAssuntos,
        unfilledRoleIds: formValue.unfilledRoles,
        managerRoleId: 1, // ajuste conforme necessário
      };
      this.save.emit(request);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach((key) => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods
  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultAvatar;
  }

  onImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  formatDate(date: Date): string {
    // Verificar se estamos no browser para usar toLocaleDateString
    if (this.isBrowser) {
      return new Date(date).toLocaleDateString('pt-BR');
    } else {
      // No servidor, usar formato mais simples para evitar problemas de localização
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${d.getFullYear()}`;
    }
  }

  private updateMarkdownPreview(markdownText: string): void {
    // Só processar markdown no browser
    if (!this.isBrowser) {
      this.markdownPreview = markdownText;
      return;
    }

    if (markdownText) {
      try {
        this.markdownPreview = marked.parse(markdownText) as string;
      } catch (error) {
        this.markdownPreview = markdownText;
      }
    } else {
      this.markdownPreview = '';
    }
  }

  // Validador customizado para limitar número de itens selecionados
  private maxItemsValidator(maxItems: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) {
        return null;
      }

      if (control.value.length > maxItems) {
        return { maxItems: { max: maxItems, actual: control.value.length } };
      }

      return null;
    };
  }

  // --- Aceitar/Rejeitar solicitação de membro ---

  feedbackDialogVisible = false;
  feedbackTextControl = new FormControl('', [Validators.required, Validators.minLength(1)]);
  feedbackRequest: any = null;

  onRequestCardAcceptRequest(request: any): void {
    console.log('[ProjectFormComponent] Evento de aceitar recebido:', request);
    if (!request?.id) return;
    this.memberService.approveMember(request.id).subscribe({
      next: (updatedMember) => {
        const teamArray = this.projectForm.get('team') as FormArray;
        if (!teamArray) return;
        for (let i = 0; i < teamArray.length; i++) {
          const member = teamArray.at(i);
          if (member.get('id')?.value === request.id) {
            member.patchValue({
              memberStatus: { id: 2, name: 'Aprovado' }
            });
            break;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao aprovar membro:', err);
      }
    });
  }

  // Abre o diálogo de feedback ao rejeitar
  onRequestCardRejectRequest(request: any): void {
    console.log('[ProjectFormComponent] Evento de rejeitar recebido:', request);
    this.feedbackRequest = request;
    this.feedbackTextControl.reset('');
    this.feedbackDialogVisible = true;
  }

  // Confirma rejeição com feedback
  confirmRejectRequest(): void {
    if (!this.feedbackRequest?.id) return;
    const feedback = this.feedbackTextControl.value || '';
    this.memberService.rejectMember(this.feedbackRequest.id, feedback).subscribe({
      next: (updatedMember) => {
        const teamArray = this.projectForm.get('team') as FormArray;
        if (!teamArray) return;
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
      }
    });
  }

  closeFeedbackDialog(): void {
    this.feedbackDialogVisible = false;
    this.feedbackTextControl.reset('');
    this.feedbackRequest = null;
  }
}
