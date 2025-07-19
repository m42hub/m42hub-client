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
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';
import { marked } from 'marked';
import { Project, TeamMember, ProjectTag } from '../../../interfaces/project.interface';

// Interface para solicitações pendentes
export interface TeamRequest {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  requestedRole: string;
  message?: string;
  requestedAt: Date;
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
    TabViewModule,
    MultiSelectModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit, OnChanges {
  @Input() project?: Project;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  defaultAvatar = '/default_avatar.png';
  isBrowser = false;
  markdownPreview = '';
  isFormReady = false;



  // Dados mockados para solicitações pendentes
  pendingRequests: TeamRequest[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Carlos Silva',
      userPhoto: '/default_avatar.png',
      requestedRole: 'Desenvolvedor Frontend',
      message: 'Tenho experiência com Angular e gostaria de contribuir com o projeto.',
      requestedAt: new Date('2024-03-15')
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Ana Costa',
      userPhoto: '/default_avatar.png',
      requestedRole: 'UX Designer',
      message: 'Sou designer e adoraria participar deste projeto inovador.',
      requestedAt: new Date('2024-03-16')
    }
  ];

  statusOptions = [
    { label: 'Ativo', value: 'active' },
    { label: 'Concluído', value: 'completed' },
    { label: 'Em espera', value: 'on-hold' }
  ];

  // Tags padronizadas por categoria
  tagOptions = {
    'tecnologias/ferramentas': [
      { label: 'Angular', value: 'Angular', color: '#dd0031' },
      { label: 'React', value: 'React', color: '#61dafb' },
      { label: 'Vue.js', value: 'Vue.js', color: '#42b883' },
      { label: 'Node.js', value: 'Node.js', color: '#339933' },
      { label: 'TypeScript', value: 'TypeScript', color: '#3178c6' },
      { label: 'JavaScript', value: 'JavaScript', color: '#f7df1e' },
      { label: 'Python', value: 'Python', color: '#3776ab' },
      { label: 'Java', value: 'Java', color: '#ed8b00' },
      { label: 'C#', value: 'C#', color: '#239120' },
      { label: 'PHP', value: 'PHP', color: '#777bb4' },
      { label: 'Go', value: 'Go', color: '#00add8' },
      { label: 'Rust', value: 'Rust', color: '#ce422b' },
      { label: 'Docker', value: 'Docker', color: '#2496ed' },
      { label: 'Kubernetes', value: 'Kubernetes', color: '#326ce5' },
      { label: 'AWS', value: 'AWS', color: '#ff9900' },
      { label: 'Azure', value: 'Azure', color: '#0089d6' },
      { label: 'Google Cloud', value: 'Google Cloud', color: '#4285f4' },
      { label: 'PostgreSQL', value: 'PostgreSQL', color: '#336791' },
      { label: 'MongoDB', value: 'MongoDB', color: '#47a248' },
      { label: 'Redis', value: 'Redis', color: '#dc382d' },
      { label: 'GraphQL', value: 'GraphQL', color: '#e10098' },
      { label: 'REST API', value: 'REST API', color: '#ff6b6b' },
      { label: 'Microservices', value: 'Microservices', color: '#4ecdc4' },
      { label: 'Machine Learning', value: 'Machine Learning', color: '#ff6b9d' },
      { label: 'AI', value: 'AI', color: '#a8e6cf' },
      { label: 'Blockchain', value: 'Blockchain', color: '#f9ca24' },
      { label: 'IoT', value: 'IoT', color: '#6c5ce7' },
      { label: 'Mobile', value: 'Mobile', color: '#fd79a8' },
      { label: 'Web', value: 'Web', color: '#74b9ff' },
      { label: 'Desktop', value: 'Desktop', color: '#55a3ff' }
    ],
    assuntos: [
      { label: 'Educação', value: 'Educação', color: '#4caf50' },
      { label: 'Saúde', value: 'Saúde', color: '#f44336' },
      { label: 'Finanças', value: 'Finanças', color: '#2196f3' },
      { label: 'E-commerce', value: 'E-commerce', color: '#ff9800' },
      { label: 'Redes Sociais', value: 'Redes Sociais', color: '#9c27b0' },
      { label: 'Produtividade', value: 'Produtividade', color: '#607d8b' },
      { label: 'Entretenimento', value: 'Entretenimento', color: '#e91e63' },
      { label: 'Transporte', value: 'Transporte', color: '#795548' },
      { label: 'Turismo', value: 'Turismo', color: '#00bcd4' },
      { label: 'Esportes', value: 'Esportes', color: '#8bc34a' },
      { label: 'Música', value: 'Música', color: '#ff5722' },
      { label: 'Jogos', value: 'Jogos', color: '#673ab7' },
      { label: 'Notícias', value: 'Notícias', color: '#3f51b5' },
      { label: 'Tecnologia', value: 'Tecnologia', color: '#009688' },
      { label: 'Sustentabilidade', value: 'Sustentabilidade', color: '#4caf50' },
      { label: 'Inovação', value: 'Inovação', color: '#ff4081' },
      { label: 'Acessibilidade', value: 'Acessibilidade', color: '#ffc107' },
      { label: 'Segurança', value: 'Segurança', color: '#d32f2f' },
      { label: 'Comunicação', value: 'Comunicação', color: '#1976d2' }
    ],
    tempoEstimado: [
      { label: '1-2 semanas', value: '1-2 semanas', color: '#00b894' },
      { label: '1 mês', value: '1 mês', color: '#00cec9' },
      { label: '2-3 meses', value: '2-3 meses', color: '#74b9ff' },
      { label: '3-6 meses', value: '3-6 meses', color: '#a29bfe' },
      { label: '6+ meses', value: '6+ meses', color: '#fd79a8' }
    ],
    complexidade: [
      { label: 'Baixa', value: 'Baixa', color: '#00b894' },
      { label: 'Média', value: 'Média', color: '#fdcb6e' },
      { label: 'Alta', value: 'Alta', color: '#e17055' },
      { label: 'Muito Alta', value: 'Muito Alta', color: '#d63031' }
    ]
  };

  roleOptions = [
    { label: 'Tech Lead', value: 'Tech Lead' },
    { label: 'Desenvolvedor Frontend', value: 'Desenvolvedor Frontend' },
    { label: 'Desenvolvedor Backend', value: 'Desenvolvedor Backend' },
    { label: 'Desenvolvedor Full Stack', value: 'Desenvolvedor Full Stack' },
    { label: 'UX/UI Designer', value: 'UX/UI Designer' },
    { label: 'DevOps Engineer', value: 'DevOps Engineer' },
    { label: 'QA Tester', value: 'QA Tester' },
    { label: 'Product Manager', value: 'Product Manager' },
    { label: 'Scrum Master', value: 'Scrum Master' },
    { label: 'Data Scientist', value: 'Data Scientist' },
    { label: 'Machine Learning Engineer', value: 'Machine Learning Engineer' },
    { label: 'Mobile Developer', value: 'Mobile Developer' },
    { label: 'Game Developer', value: 'Game Developer' },
    { label: 'Security Engineer', value: 'Security Engineer' },
    { label: 'Database Administrator', value: 'Database Administrator' },
    { label: 'System Administrator', value: 'System Administrator' },
    { label: 'Network Engineer', value: 'Network Engineer' },
    { label: 'Cloud Architect', value: 'Cloud Architect' },
    { label: 'Business Analyst', value: 'Business Analyst' },
    { label: 'Technical Writer', value: 'Technical Writer' }
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Inicializar formulário primeiro
    this.initForm();

    // Configurar marked apenas no browser para evitar erros SSR
    if (this.isBrowser) {
      marked.setOptions({
        breaks: true,
        gfm: true
      });

      // Atualizar preview quando o valor da descrição mudar (apenas no browser)
      this.projectForm.get('description')?.valueChanges.subscribe(value => {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && changes['project'].currentValue && this.isEditMode && this.projectForm) {
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
      selectedComplexidade: [null]
    });

    // Garantir que o formulário está marcado como inicializado
    this.projectForm.markAsPristine();
    this.projectForm.markAsUntouched();
  }

  private patchFormWithProject(): void {
    if (!this.project || !this.projectForm) return;

    // Patch dos campos básicos
    this.projectForm.patchValue({
      name: this.project.name,
      summary: this.project.summary || '',
      description: this.project.description,
      image: this.project.image || '',
      status: this.project.status || 'active',
      startDate: this.project.startDate,
      expectedDate: this.project.expectedDate,
      unfilledRoles: this.project.unfilledRoles || []
    });

    // Patch da equipe
    const teamArray = this.projectForm.get('team') as FormArray;
    teamArray.clear();
    this.project.team.forEach(member => {
      teamArray.push(this.fb.group({
        id: [member.id],
        name: [member.name],
        photo: [member.photo],
        role: [member.role],
        isManager: [member.isManager || false]
      }));
    });

    // Patch das tags
    const tagsArray = this.projectForm.get('tags') as FormArray;
    tagsArray.clear();

        // Resetar seleções
    const selectedTecnologiasFerramentas: string[] = [];
    const selectedAssuntos: string[] = [];
    let selectedTempoEstimado: string | null = null;
    let selectedComplexidade: string | null = null;

    this.project.tags.forEach(tag => {
      tagsArray.push(this.fb.group({
        id: [tag.id],
        name: [tag.name],
        type: [tag.type],
        color: [tag.color || '']
      }));

      // Sincronizar com as propriedades dos selects
      if (tag.type === 'tecnologias/ferramentas') {
        selectedTecnologiasFerramentas.push(tag.name);
      } else if (tag.type === 'assuntos') {
        selectedAssuntos.push(tag.name);
      } else if (tag.type === 'tempoEstimado') {
        selectedTempoEstimado = tag.name;
      } else if (tag.type === 'complexidade') {
        selectedComplexidade = tag.name;
      }
    });

    // Patch dos controles dos selects
    this.projectForm.patchValue({
      selectedTecnologiasFerramentas: selectedTecnologiasFerramentas,
      selectedAssuntos: selectedAssuntos,
      selectedTempoEstimado: selectedTempoEstimado,
      selectedComplexidade: selectedComplexidade
    });
  }

  // Métodos para gerenciar tags
  addTag(type: 'tecnologias/ferramentas' | 'assuntos' | 'tempoEstimado' | 'complexidade', value: string): void {
    const tagsArray = this.projectForm.get('tags') as FormArray;
    const newTag = {
      id: this.generateId(),
      name: value,
      type: type,
      color: this.getTagColor(value, type)
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
    return tagsArray.value.some((tag: any) => tag.type === type && tag.name === value);
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
    const selectedTecnologiasFerramentas = this.projectForm.get('selectedTecnologiasFerramentas')?.value || [];
    const selectedAssuntos = this.projectForm.get('selectedAssuntos')?.value || [];
    const selectedTempoEstimado = this.projectForm.get('selectedTempoEstimado')?.value;
    const selectedComplexidade = this.projectForm.get('selectedComplexidade')?.value;

    tagsArray.clear();

    // Adicionar tags de tecnologias/ferramentas
    selectedTecnologiasFerramentas.forEach((value: string) => {
      const newTag = {
        id: this.generateId(),
        name: value,
        type: 'tecnologias/ferramentas',
        color: this.getTagColor(value, 'tecnologias/ferramentas')
      };
      tagsArray.push(this.fb.group(newTag));
    });

    // Adicionar tags de assuntos
    selectedAssuntos.forEach((value: string) => {
      const newTag = {
        id: this.generateId(),
        name: value,
        type: 'assuntos',
        color: this.getTagColor(value, 'assuntos')
      };
      tagsArray.push(this.fb.group(newTag));
    });

    // Adicionar tag de tempo estimado
    if (selectedTempoEstimado) {
      const newTag = {
        id: this.generateId(),
        name: selectedTempoEstimado,
        type: 'tempoEstimado',
        color: this.getTagColor(selectedTempoEstimado, 'tempoEstimado')
      };
      tagsArray.push(this.fb.group(newTag));
    }

    // Adicionar tag de complexidade
    if (selectedComplexidade) {
      const newTag = {
        id: this.generateId(),
        name: selectedComplexidade,
        type: 'complexidade',
        color: this.getTagColor(selectedComplexidade, 'complexidade')
      };
      tagsArray.push(this.fb.group(newTag));
    }
  }

  // Métodos auxiliares
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  getTagColor(tagName: string, type: string): string {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      'tecnologias/ferramentas': {
        'Angular': '#dd0031',
        'TypeScript': '#3178c6',
        'Node.js': '#339933',
        'React': '#61dafb',
        'Vue.js': '#4fc08d',
        'Python': '#3776ab',
        'Java': '#007396',
        'C#': '#68217a',
        'PHP': '#777bb4',
        'Ruby': '#cc342d'
      },
      assuntos: {
        'Educação': '#4caf50',
        'Saúde': '#f44336',
        'Finanças': '#2196f3',
        'E-commerce': '#ff9800',
        'Redes Sociais': '#9c27b0',
        'Produtividade': '#607d8b',
        'Entretenimento': '#e91e63',
        'Transporte': '#795548',
        'Turismo': '#00bcd4',
        'Esportes': '#8bc34a',
        'Música': '#ff5722',
        'Jogos': '#673ab7',
        'Notícias': '#3f51b5',
        'Tecnologia': '#009688',
        'Sustentabilidade': '#4caf50',
        'Inovação': '#ff4081',
        'Acessibilidade': '#ffc107',
        'Segurança': '#d32f2f',
        'Comunicação': '#1976d2'
      },
      tempoEstimado: {
        '1-2 semanas': '#4caf50',
        '1 mês': '#8bc34a',
        '2-3 meses': '#ff9800',
        '3-6 meses': '#ff5722',
        '6+ meses': '#f44336'
      },
      complexidade: {
        'Baixa': '#4caf50',
        'Média': '#ff9800',
        'Alta': '#f44336',
        'Muito Alta': '#9c27b0'
      }
    };

    return colorMap[type]?.[tagName] || '#607d8b';
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

  // Request management
  acceptRequest(request: TeamRequest): void {
    // Adicionar à equipe
    const newMember = this.fb.group({
      id: [request.userId],
      name: [request.userName],
      photo: [request.userPhoto],
      role: [request.requestedRole],
      isManager: [false]
    });

    this.teamArray.push(newMember);

    // Remover da lista de solicitações
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
  }

  rejectRequest(request: TeamRequest): void {
    // Remover da lista de solicitações
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== request.id);
  }



  // Form submission
  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;

      // Converter tags do formato de grupo para array de ProjectTag
      const tags: ProjectTag[] = [];

      // Tags de tecnologias/ferramentas (múltiplas)
      formValue.tags.forEach((tag: any) => {
        tags.push({
          id: tag.id,
          name: tag.name,
          type: tag.type,
          color: tag.color
        });
      });

      const project: Project = {
        id: this.project?.id || this.generateId(),
        name: formValue.name,
        summary: formValue.summary,
        description: formValue.description,
        team: formValue.team,
        tags: tags,
        image: formValue.image,
        status: formValue.status,
        startDate: formValue.startDate,
        expectedDate: formValue.expectedDate,
        unfilledRoles: formValue.unfilledRoles,
        createdAt: this.project?.createdAt || new Date(),
        updatedAt: new Date()
      };
      this.save.emit(project);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
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
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
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
}
