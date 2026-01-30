/**
 * To-Do List Frontend Application
 * Consumo completo da API REST com JavaScript vanilla
 */

class TodoApp {
  constructor() {
    this.apiBase = '/api/tarefas';
    this.tasks = [];
    this.currentFilter = 'todos';
    this.isLoading = false;

    // Elementos do DOM
    this.elements = {};
    
    // Inicialização
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    try {
      // Verifica se o DOM está pronto
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }
      
      console.log('Iniciando aplicação To-Do List...');
      
      this.cacheElements();
      this.bindEvents();
      await this.loadTasks();
      this.updateStats();
      
      console.log('Aplicação inicializada com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar aplicação:', error);
      // Apenas usa console para erro de inicialização, pois toast pode não estar disponível
      console.error('Detalhes do erro:', error.message, error.stack);
    }
  }

  /**
   * Cache dos elementos do DOM
   */
  cacheElements() {
    console.log('Cacheando elementos do DOM...');
    
    this.elements = {
      // Navbar
      navbarToggle: document.getElementById('navbarToggle'),
      navbarMenu: document.getElementById('navbarMenu'),
      navbarLinks: document.querySelectorAll('.navbar-link, .navbar-menu-mobile-link'),
      
      // Formulário
      taskForm: document.getElementById('taskForm'),
      taskTitle: document.getElementById('taskTitle'),
      taskDescription: document.getElementById('taskDescription'),
      taskStatus: document.getElementById('taskStatus'),
      submitBtn: document.getElementById('submitBtn'),
      
      // Modal de edição
      taskDetailModal: document.getElementById('taskDetailModal'),
      taskEditForm: document.getElementById('taskEditForm'),
      editTaskId: document.getElementById('editTaskId'),
      editTaskTitle: document.getElementById('editTaskTitle'),
      editTaskDescription: document.getElementById('editTaskDescription'),
      editTaskStatus: document.getElementById('editTaskStatus'),
      saveTaskBtn: document.getElementById('saveTaskBtn'),
      deleteTaskBtn: document.getElementById('deleteTaskBtn'),
      cancelEditBtn: document.getElementById('cancelEditBtn'),
      closeTaskModal: document.getElementById('closeTaskModal'),
      
      // Informações da tarefa no modal
      infoTaskId: document.getElementById('infoTaskId'),
      infoCreatedDate: document.getElementById('infoCreatedDate'),
      infoUpdatedDate: document.getElementById('infoUpdatedDate'),
      
      // Erros do formulário de edição
      editTitleError: document.getElementById('editTitleError'),
      editDescError: document.getElementById('editDescError'),
      editStatusError: document.getElementById('editStatusError'),
      
      // Erros do formulário principal
      titleError: document.getElementById('titleError'),
      descError: document.getElementById('descError'),
      statusError: document.getElementById('statusError'),
      
      // Lista e estados
      tasksList: document.getElementById('tasksList'),
      emptyState: document.getElementById('emptyState'),
      loadingIndicator: document.getElementById('loadingIndicator'),
      
      // Filtros
      filterButtons: document.querySelectorAll('.btn-filter'),
      
      // Estatísticas
      statTotal: document.getElementById('statTotal'),
      statPending: document.getElementById('statPending'),
      statProgress: document.getElementById('statProgress'),
      statCompleted: document.getElementById('statCompleted'),
      progressBar: document.getElementById('progressBar'),
      progressText: document.getElementById('progressText'),
      activityList: document.getElementById('activityList'),
      
      // Modal
      apiInfoModal: document.getElementById('apiInfoModal'),
      apiInfoContent: document.getElementById('apiInfoContent'),
      btnToggleApiInfo: document.getElementById('btnToggleApiInfo'),
      btnToggleApiInfoMobile: document.getElementById('btnToggleApiInfoMobile'),
      btnToggleApiInfoAbout: document.getElementById('btnToggleApiInfoAbout'),
      closeModal: document.getElementById('closeModal'),
      
      // Toast container
      toastContainer: document.getElementById('toastContainer')
    };
    
    // Verificação crítica de elementos essenciais
    const criticalElements = ['taskForm', 'taskTitle', 'tasksList', 'emptyState'];
    const missing = criticalElements.filter(id => !this.elements[id]);
    
    if (missing.length > 0) {
      console.error('Elementos críticos não encontrados:', missing);
      throw new Error(`Elementos essenciais não encontrados: ${missing.join(', ')}`);
    }
    
    console.log('Elementos cacheados com sucesso!');
  }

  /**
   * Bind de eventos
   */
  bindEvents() {
    // Navbar Mobile Toggle
    this.elements.navbarToggle?.addEventListener('click', () => this.toggleMobileMenu());
    
    // Navbar Links (navegação suave)
    this.elements.navbarLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavLinkClick(e));
    });
    
    // Formulário
    this.elements.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.elements.taskForm.addEventListener('reset', () => this.clearFormErrors());
    
    // Evento change do select de status
    if (this.elements.taskStatus) {
      this.elements.taskStatus.addEventListener('change', (e) => this.updateStatusSelectAppearance(e.target));
      // Inicializa com a primeira opção
      this.updateStatusSelectAppearance(this.elements.taskStatus);
    }
    
    // Modal de edição
    this.elements.taskEditForm?.addEventListener('submit', (e) => this.handleEditFormSubmit(e));
    this.elements.saveTaskBtn?.addEventListener('click', () => this.elements.taskEditForm?.requestSubmit());
    this.elements.deleteTaskBtn?.addEventListener('click', () => this.handleDeleteFromModal());
    this.elements.cancelEditBtn?.addEventListener('click', () => this.closeTaskDetailModal());
    this.elements.closeTaskModal?.addEventListener('click', () => this.closeTaskDetailModal());
    this.elements.taskDetailModal?.addEventListener('click', (e) => {
      if (e.target === this.elements.taskDetailModal || e.target.classList.contains('modal-backdrop')) {
        this.closeTaskDetailModal();
      }
    });
    
    // Filtros
    if (this.elements.filterButtons) {
      this.elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => this.handleFilterChange(btn));
      });
    }
    
    // Modal
    this.elements.btnToggleApiInfo?.addEventListener('click', () => this.toggleApiInfo());
    this.elements.btnToggleApiInfoMobile?.addEventListener('click', () => {
      this.closeMobileMenu();
      this.toggleApiInfo();
    });
    this.elements.btnToggleApiInfoAbout?.addEventListener('click', () => this.toggleApiInfo());
    this.elements.closeModal?.addEventListener('click', () => this.closeApiInfoModal());
    this.elements.apiInfoModal?.addEventListener('click', (e) => {
      if (e.target === this.elements.apiInfoModal || e.target.classList.contains('modal-backdrop')) {
        this.closeApiInfoModal();
      }
    });
    
    // Teclas
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeApiInfoModal();
        this.closeMobileMenu();
      }
    });
    
    // Scroll para atualizar navbar ativa
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Validação em tempo real
    this.elements.taskTitle.addEventListener('input', () => this.validateField('title'));
    this.elements.taskDescription.addEventListener('input', () => this.validateField('description'));
  }

  /**
   * Carrega todas as tarefas da API
   */
  async loadTasks() {
    this.setLoading(true);
    
    try {
      const response = await fetch(this.apiBase);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      this.tasks = await response.json();
      this.renderTasks();
      this.updateStats();
      
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      this.showToast('Não foi possível carregar as tarefas', 'error');
      this.tasks = [];
      this.renderTasks();
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Renderiza a lista de tarefas
   */
  renderTasks() {
    // Verificação de segurança
    if (!this.elements || !this.elements.tasksList || !this.elements.emptyState) {
      console.warn('Elementos da lista de tarefas não disponíveis');
      return;
    }
    
    const filteredTasks = this.getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      this.elements.tasksList.style.display = 'none';
      this.elements.emptyState.style.display = 'block';
      return;
    }
    
    this.elements.tasksList.style.display = 'grid';
    this.elements.emptyState.style.display = 'none';
    
    this.elements.tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    
    // Adiciona eventos aos botões das tarefas
    this.bindTaskEvents();
  }

  /**
   * Cria HTML de uma tarefa
   */
  createTaskHTML(task) {
    const createdDate = new Date(task.criado_em).toLocaleDateString('pt-BR');
    const statusClass = `status-${task.status}`;
    const statusText = this.getStatusText(task.status);
    
    return `
      <article class="task-item ${statusClass}" data-id="${task.id}" role="listitem" tabindex="0">
        <div class="task-header">
          <div class="task-content" onclick="app.openTaskDetailModal(${task.id})">
            <h3 class="task-title">${this.escapeHtml(task.titulo)}</h3>
            ${task.descricao ? `<p class="task-description">${this.escapeHtml(task.descricao)}</p>` : ''}
            <div class="task-meta">
              <span class="task-status ${statusClass}">
                ${this.getStatusIcon(task.status)}
                ${statusText}
              </span>
              <span class="task-date">
                <span class="material-icons">calendar_today</span>
                ${createdDate}
              </span>
            </div>
          </div>
          <div class="task-actions">
            ${this.createTaskActions(task)}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Cria os botões de ação da tarefa
   */
  createTaskActions(task) {
    let actions = '';
    
    // Botões de status
    if (task.status === 'pendente') {
      actions += `
        <button class="btn btn-ghost btn-sm task-action-btn" data-task-id="${task.id}" data-action="start" 
                title="Iniciar tarefa" aria-label="Iniciar tarefa">
          <span class="material-icons">play_arrow</span>
        </button>
      `;
    }
    
    if (task.status === 'em_andamento') {
      actions += `
        <button class="btn btn-ghost btn-sm task-action-btn" data-task-id="${task.id}" data-action="complete" 
                title="Concluir tarefa" aria-label="Concluir tarefa">
          <span class="material-icons">check</span>
        </button>
        <button class="btn btn-ghost btn-sm task-action-btn" data-task-id="${task.id}" data-action="pending" 
                title="Voltar para pendente" aria-label="Voltar para pendente">
          <span class="material-icons">undo</span>
        </button>
      `;
    }
    
    if (task.status === 'concluida') {
      actions += `
        <button class="btn btn-ghost btn-sm task-action-btn" data-task-id="${task.id}" data-action="reopen" 
                title="Reabrir tarefa" aria-label="Reabrir tarefa">
          <span class="material-icons">undo</span>
        </button>
      `;
    }
    
    return actions;
  }

  /**
   * Bind de eventos dos botões das tarefas
   */
  bindTaskEvents() {
    // Adiciona eventos aos botões de ação
    const actionButtons = document.querySelectorAll('.task-action-btn');
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = parseInt(btn.dataset.taskId);
        const action = btn.dataset.action;
        this.handleTaskAction(taskId, action);
      });
    });
  }

  /**
   * Manipula ações rápidas das tarefas
   */
  handleTaskAction(taskId, action) {
    const statusMap = {
      'start': 'em_andamento',
      'complete': 'concluida',
      'pending': 'pendente',
      'reopen': 'pendente'
    };
    
    const newStatus = statusMap[action];
    if (newStatus) {
      this.updateTaskStatus(taskId, newStatus);
    }
  }

  /**
   * Manipula submissão do formulário
   */
  async handleFormSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    const formData = {
      titulo: this.elements.taskTitle.value.trim(),
      descricao: this.elements.taskDescription.value.trim() || null,
      status: this.elements.taskStatus.value
    };
    
    this.setSubmitLoading(true);
    
    try {
      const response = await fetch(this.apiBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const newTask = await response.json();
      this.tasks.unshift(newTask);
      this.renderTasks();
      this.updateStats();
      this.clearForm();
      this.showToast('Tarefa criada com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      this.showToast(error.message || 'Erro ao criar tarefa', 'error');
    } finally {
      this.setSubmitLoading(false);
    }
  }

  /**
   * Atualiza status de uma tarefa
   */
  async updateTaskStatus(taskId, newStatus) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const oldStatus = task.status;
    
    try {
      const response = await fetch(`${this.apiBase}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const updatedTask = await response.json();
      const index = this.tasks.findIndex(t => t.id === taskId);
      this.tasks[index] = updatedTask;
      this.renderTasks();
      this.updateStats();
      this.showToast(`Tarefa ${this.getStatusText(newStatus).toLowerCase()}!`, 'success');
      
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      this.showToast(error.message || 'Erro ao atualizar tarefa', 'error');
      // Reverte o status visual em caso de erro
      task.status = oldStatus;
    }
  }

  /**
   * Exclui uma tarefa
   */
  async deleteTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (!confirm(`Tem certeza que deseja excluir a tarefa "${task.titulo}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${this.apiBase}/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.renderTasks();
      this.updateStats();
      this.showToast('Tarefa excluída com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      this.showToast(error.message || 'Erro ao excluir tarefa', 'error');
    }
  }

  /**
   * Manipula mudança de filtro
   */
  handleFilterChange(button) {
    if (!this.elements.filterButtons) return;
    
    // Remove classe active de todos os botões
    this.elements.filterButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    
    // Adiciona classe active ao botão clicado
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Atualiza filtro atual
    this.currentFilter = button.dataset.filter;
    this.renderTasks();
  }

  /**
   * Retorna tarefas filtradas
   */
  getFilteredTasks() {
    if (this.currentFilter === 'todos') {
      return this.tasks;
    }
    return this.tasks.filter(task => task.status === this.currentFilter);
  }

  /**
   * Atualiza estatísticas detalhadas
   */
  updateDetailedStats() {
    // Verificação de segurança
    if (!this.elements) return;
    
    const total = this.tasks.length;
    const pending = this.tasks.filter(task => task.status === 'pendente').length;
    const progress = this.tasks.filter(task => task.status === 'em_andamento').length;
    const completed = this.tasks.filter(task => task.status === 'concluida').length;
    
    // Atualiza cards de estatísticas
    if (this.elements.statTotal) this.elements.statTotal.textContent = total;
    if (this.elements.statPending) this.elements.statPending.textContent = pending;
    if (this.elements.statProgress) this.elements.statProgress.textContent = progress;
    if (this.elements.statCompleted) this.elements.statCompleted.textContent = completed;
    
    // Atualiza barra de progresso
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    if (this.elements.progressBar) {
      this.elements.progressBar.style.width = `${completionRate}%`;
    }
    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${completionRate}%`;
    }
    
    // Atualiza atividade recente
    this.updateRecentActivity();
  }

  /**
   * Atualiza lista de atividade recente
   */
  updateRecentActivity() {
    if (!this.elements.activityList) return;
    
    // Pega as 3 tarefas mais recentes
    const recentTasks = [...this.tasks]
      .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
      .slice(0, 3);
    
    if (recentTasks.length === 0) {
      this.elements.activityList.innerHTML = `
        <div class="activity-item">
          <span class="material-icons">info</span>
          <span>Nenhuma atividade recente</span>
        </div>
      `;
      return;
    }
    
    this.elements.activityList.innerHTML = recentTasks.map(task => {
      const createdDate = new Date(task.criado_em).toLocaleDateString('pt-BR');
      const statusIcon = this.getStatusIcon(task.status);
      return `
        <div class="activity-item">
          ${statusIcon}
          <span>${this.escapeHtml(task.titulo)} - ${createdDate}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Manipula clique nos links da navbar
   */
  handleNavLinkClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    // Se for link externo, não faz nada
    if (href.startsWith('http') || href.startsWith('/api')) {
      return;
    }
    
    // Previne comportamento padrão
    e.preventDefault();
    
    // Fecha menu mobile se estiver aberto
    this.closeMobileMenu();
    
    // Navegação suave
    this.smoothScrollTo(href);
    
    // Atualiza link ativo
    this.updateActiveNavLink(href);
  }

  /**
   * Rolagem suave para elemento
   */
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - navbarHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Atualiza link ativo da navbar baseado no scroll
   */
  updateActiveNavLink(targetHref) {
    // Remove classe active de todos os links
    this.elements.navbarLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    
    // Adiciona classe active ao link correspondente
    this.elements.navbarLinks.forEach(link => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Manipula evento de scroll para atualizar navbar ativa
   */
  handleScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
    const scrollPosition = window.scrollY + navbarHeight + 50;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = `#${section.id}`;
      }
    });
    
    if (currentSection) {
      this.updateActiveNavLink(currentSection);
    }
  }

  /**
   * Alterna menu mobile
   */
  toggleMobileMenu() {
    if (!this.elements.navbarToggle || !this.elements.navbarMenu) return;
    
    const isExpanded = this.elements.navbarToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Abre menu mobile
   */
  openMobileMenu() {
    if (!this.elements.navbarToggle || !this.elements.navbarMenu) return;
    
    this.elements.navbarToggle.setAttribute('aria-expanded', 'true');
    this.elements.navbarMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Previne scroll do body
  }

  /**
   * Fecha menu mobile
   */
  closeMobileMenu() {
    if (!this.elements.navbarToggle || !this.elements.navbarMenu) return;
    
    this.elements.navbarToggle.setAttribute('aria-expanded', 'false');
    this.elements.navbarMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restaura scroll do body
  }

  /**
   * Atualiza estatísticas (método existente atualizado)
   */
  updateStats() {
    // Verificação de segurança
    if (!this.elements) return;
    
    // Atualiza estatísticas detalhadas
    this.updateDetailedStats();
  }

  /**
   * Validação do formulário
   */
  validateForm() {
    let isValid = true;
    
    // Valida título
    if (!this.validateField('title')) {
      isValid = false;
    }
    
    // Valida descrição (opcional)
    this.validateField('description');
    
    return isValid;
  }

  /**
   * Validação de campo específico
   */
  validateField(field) {
    let isValid = true;
    let errorElement;
    let inputElement;
    
    if (field === 'title') {
      errorElement = this.elements.titleError;
      inputElement = this.elements.taskTitle;
      
      const value = inputElement.value.trim();
      if (!value) {
        errorElement.textContent = 'O título é obrigatório';
        isValid = false;
      } else if (value.length < 3) {
        errorElement.textContent = 'O título deve ter pelo menos 3 caracteres';
        isValid = false;
      } else if (value.length > 100) {
        errorElement.textContent = 'O título deve ter no máximo 100 caracteres';
        isValid = false;
      } else {
        errorElement.textContent = '';
      }
    }
    
    if (field === 'description') {
      errorElement = this.elements.descError;
      inputElement = this.elements.taskDescription;
      
      const value = inputElement.value.trim();
      if (value && value.length > 500) {
        errorElement.textContent = 'A descrição deve ter no máximo 500 caracteres';
        isValid = false;
      } else {
        errorElement.textContent = '';
      }
    }
    
    // Atualiza classe de erro no input
    if (inputElement) {
      if (isValid) {
        inputElement.classList.remove('error');
      } else {
        inputElement.classList.add('error');
      }
    }
    
    return isValid;
  }

  /**
   * Limpa erros do formulário
   */
  clearFormErrors() {
    this.elements.titleError.textContent = '';
    this.elements.descError.textContent = '';
    this.elements.taskTitle.classList.remove('error');
    this.elements.taskDescription.classList.remove('error');
  }

  /**
   * Limpa formulário
   */
  clearForm() {
    this.elements.taskForm.reset();
    this.clearFormErrors();
  }

  /**
   * Configura estado de loading
   */
  setLoading(loading) {
    this.isLoading = loading;
    
    if (loading) {
      this.elements.loadingIndicator.style.display = 'flex';
      this.elements.tasksList.style.opacity = '0.5';
    } else {
      this.elements.loadingIndicator.style.display = 'none';
      this.elements.tasksList.style.opacity = '1';
    }
  }

  /**
   * Configura estado de loading do botão submit
   */
  setSubmitLoading(loading) {
    if (loading) {
      this.elements.submitBtn.disabled = true;
      this.elements.submitBtn.innerHTML = `
        <span class="material-icons animate-spin">pending</span>
        <span>Criando...</span>
      `;
    } else {
      this.elements.submitBtn.disabled = false;
      this.elements.submitBtn.innerHTML = `
        <span class="material-icons">add</span>
        <span>Adicionar Tarefa</span>
      `;
    }
  }

  /**
   * Mostra informações da API
   */
  async toggleApiInfo() {
    if (this.elements.apiInfoModal.getAttribute('aria-hidden') === 'false') {
      this.closeApiInfoModal();
      return;
    }
    
    this.elements.apiInfoModal.setAttribute('aria-hidden', 'false');
    
    try {
      const response = await fetch('/api/info');
      const data = await response.json();
      
      this.elements.apiInfoContent.innerHTML = `
        <div class="api-info">
          <h4>🚀 To-Do List API</h4>
          <p><strong>Status:</strong> <span class="status-success">Online</span></p>
          <p><strong>Documentação:</strong> <a href="${data.docs}" target="_blank">${data.docs}</a></p>
          
          <h5>Endpoints Disponíveis:</h5>
          <ul>
            <li><code>GET ${data.endpoints.tarefas}</code> - Listar todas as tarefas</li>
            <li><code>POST ${data.endpoints.tarefas}</code> - Criar nova tarefa</li>
            <li><code>PUT ${data.endpoints.tarefas}/:id</code> - Atualizar tarefa</li>
            <li><code>DELETE ${data.endpoints.tarefas}/:id</code> - Excluir tarefa</li>
          </ul>
          
          <h5>Estatísticas Atuais:</h5>
          <ul>
            <li>Total de tarefas: ${this.tasks.length}</li>
            <li>Tarefas concluídas: ${this.tasks.filter(t => t.status === 'concluida').length}</li>
            <li>Tarefas pendentes: ${this.tasks.filter(t => t.status === 'pendente').length}</li>
            <li>Tarefas em andamento: ${this.tasks.filter(t => t.status === 'em_andamento').length}</li>
          </ul>
        </div>
      `;
      
    } catch (error) {
      console.error('Erro ao carregar informações da API:', error);
      this.elements.apiInfoContent.innerHTML = `
        <div class="error-info">
          <p>❌ Não foi possível carregar as informações da API</p>
          <p>Tente novamente mais tarde.</p>
        </div>
      `;
    }
  }

  /**
   * Fecha modal de informações da API
   */
  closeApiInfoModal() {
    this.elements.apiInfoModal.setAttribute('aria-hidden', 'true');
  }

  /**
   * Mostra toast notification
   */
  showToast(message, type = 'info', title = null) {
    // Verificação de segurança para evitar erros durante inicialização
    if (!this.elements || !this.elements.toastContainer) {
      console.warn('Toast container não disponível, usando fallback:', message);
      // Fallback para console durante inicialização
      console.log(`[${type.toUpperCase()}] ${title ? title + ': ' : ''}${message}`);
      return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    
    const titles = {
      success: title || 'Sucesso',
      error: title || 'Erro',
      warning: title || 'Atenção',
      info: title || 'Informação'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">
        <span class="material-icons">${icons[type]}</span>
      </div>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Fechar notificação">
        <span class="material-icons">close</span>
      </button>
    `;
    
    // Adiciona evento de fechar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.removeToast(toast));
    
    // Adiciona ao container
    this.elements.toastContainer.appendChild(toast);
    
    // Auto remove após 5 segundos
    setTimeout(() => this.removeToast(toast), 5000);
  }

  /**
   * Remove toast notification
   */
  removeToast(toast) {
    if (!toast || !toast.parentNode) {
      return;
    }
    
    toast.style.animation = 'slideOut 300ms ease-in';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  /**
   * Retorna texto do status
   */
  getStatusText(status) {
    const statusMap = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída'
    };
    return statusMap[status] || status;
  }

  /**
   * Retorna ícone do status
   */
  getStatusIcon(status) {
    const iconMap = {
      'pendente': '<span class="material-icons">hourglass_empty</span>',
      'em_andamento': '<span class="material-icons">pending</span>',
      'concluida': '<span class="material-icons">check_circle</span>'
    };
    return iconMap[status] || '<span class="material-icons">help</span>';
  }

  /**
   * Abre modal de detalhes da tarefa
   */
  openTaskDetailModal(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Preenche formulário com dados da tarefa
    this.elements.editTaskId.value = task.id;
    this.elements.editTaskTitle.value = task.titulo;
    this.elements.editTaskDescription.value = task.descricao || '';
    this.elements.editTaskStatus.value = task.status;
    
    // Preenche informações da tarefa
    this.elements.infoTaskId.textContent = task.id;
    this.elements.infoCreatedDate.textContent = new Date(task.criado_em).toLocaleString('pt-BR');
    this.elements.infoUpdatedDate.textContent = new Date(task.atualizado_em).toLocaleString('pt-BR');
    
    // Limpa erros
    this.clearEditFormErrors();
    
    // Abre modal
    this.elements.taskDetailModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha modal de detalhes da tarefa
   */
  closeTaskDetailModal() {
    this.elements.taskDetailModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * Manipula submissão do formulário de edição
   */
  async handleEditFormSubmit(e) {
    e.preventDefault();
    
    if (!this.validateEditForm()) {
      return;
    }
    
    const taskId = parseInt(this.elements.editTaskId.value);
    const formData = {
      titulo: this.elements.editTaskTitle.value.trim(),
      descricao: this.elements.editTaskDescription.value.trim() || null,
      status: this.elements.editTaskStatus.value
    };
    
    this.setSaveLoading(true);
    
    try {
      const response = await fetch(`${this.apiBase}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const updatedTask = await response.json();
      const index = this.tasks.findIndex(t => t.id === taskId);
      this.tasks[index] = updatedTask;
      this.renderTasks();
      this.updateStats();
      this.closeTaskDetailModal();
      this.showToast('Tarefa atualizada com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      this.showToast(error.message || 'Erro ao atualizar tarefa', 'error');
    } finally {
      this.setSaveLoading(false);
    }
  }

  /**
   * Manipula exclusão do modal
   */
  async handleDeleteFromModal() {
    const taskId = parseInt(this.elements.editTaskId.value);
    const task = this.tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    if (!confirm(`Tem certeza que deseja excluir a tarefa "${task.titulo}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${this.apiBase}/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }
      
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.renderTasks();
      this.updateStats();
      this.closeTaskDetailModal();
      this.showToast('Tarefa excluída com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      this.showToast(error.message || 'Erro ao excluir tarefa', 'error');
    }
  }

  /**
   * Validação do formulário de edição
   */
  validateEditForm() {
    let isValid = true;
    
    // Valida título
    const titleValue = this.elements.editTaskTitle.value.trim();
    if (!titleValue) {
      this.elements.editTitleError.textContent = 'O título é obrigatório';
      isValid = false;
    } else if (titleValue.length < 3) {
      this.elements.editTitleError.textContent = 'O título deve ter pelo menos 3 caracteres';
      isValid = false;
    } else if (titleValue.length > 100) {
      this.elements.editTitleError.textContent = 'O título deve ter no máximo 100 caracteres';
      isValid = false;
    } else {
      this.elements.editTitleError.textContent = '';
    }
    
    // Valida descrição
    const descValue = this.elements.editTaskDescription.value.trim();
    if (descValue && descValue.length > 500) {
      this.elements.editDescError.textContent = 'A descrição deve ter no máximo 500 caracteres';
      isValid = false;
    } else {
      this.elements.editDescError.textContent = '';
    }
    
    return isValid;
  }

  /**
   * Limpa erros do formulário de edição
   */
  clearEditFormErrors() {
    this.elements.editTitleError.textContent = '';
    this.elements.editDescError.textContent = '';
    this.elements.editStatusError.textContent = '';
  }

  /**
   * Configura estado de loading do botão salvar
   */
  setSaveLoading(loading) {
    if (loading) {
      this.elements.saveTaskBtn.disabled = true;
      this.elements.saveTaskBtn.innerHTML = `
        <span class="material-icons animate-spin">pending</span>
        <span>Salvando...</span>
      `;
    } else {
      this.elements.saveTaskBtn.disabled = false;
      this.elements.saveTaskBtn.innerHTML = `
        <span class="material-icons">save</span>
        <span>Salvar Alterações</span>
      `;
    }
  }

  /**
   * Atualiza aparência do select de status
   */
  updateStatusSelectAppearance(select) {
    const selectedOption = select.options[select.selectedIndex];
    const color = selectedOption.getAttribute('data-color');
    const icon = selectedOption.getAttribute('data-icon');
    
    // Atualiza cor do select
    select.setAttribute('data-color', color);
    
    // Atualiza ícone
    const iconElement = select.parentElement.querySelector('.select-icon .material-icons');
    if (iconElement) {
      iconElement.textContent = icon;
      iconElement.setAttribute('data-color', color);
    }
  }

  /**
   * Escape HTML para prevenir XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Adiciona animação de slideOut
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TodoApp();
});

// Exporta para uso global
window.TodoApp = TodoApp;
