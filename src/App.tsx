/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Exercicio, CategoriaType, GrupoMuscularType, NivelType } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ExerciseCard from './components/ExerciseCard';
import ExerciseDetail from './components/ExerciseDetail';
import AdminPanel from './components/AdminPanel';
import AnatomicalBody from './components/AnatomicalBody';
import { Search, RotateCcw, Filter, UserCheck, Sparkles, HelpCircle, Dumbbell, Play, Shield, Grid, Lock, User, Loader2, X } from 'lucide-react';

export default function App() {
  // Main lists & view states
  const [exercises, setExercises] = useState<Exercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercicio | null>(null);
  const [activeView, setActiveView] = useState<'library' | 'detail' | 'admin'>('library');
  const [isAdmin, setIsAdmin] = useState(false);

  // Login States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<string>('Todos');
  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Todos');
  
  // Display categories with icons
  const categoriesWithIcons = [
    { name: 'Todos', icon: '📋' },
    { name: 'Musculação', icon: '🏋️' },
    { name: 'Alongamentos', icon: '🤸' },
    { name: 'Cardio', icon: '🏃' },
    { name: 'Funcional', icon: '💪' },
    { name: 'Mobilidade', icon: '🧘' },
    { name: 'Reabilitação', icon: '❤️' }
  ];

  // Dynamic muscles group list
  const muscleGroupsList = [
    'Todos', 'Peito', 'Costas', 'Ombros', 'Trapézio', 'Bíceps', 'Tríceps', 'Antebraço', 
    'Abdômen', 'Lombar', 'Quadríceps', 'Posterior', 'Glúteos', 'Adutores', 'Abdutores', 'Panturrilhas'
  ];

  // Fetch exercises from the Express backend API on mount
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exercises');
      if (response.ok) {
        const data = await response.json();
        setExercises(data);
      } else {
        console.error('Falha ao buscar exercícios da API.');
      }
    } catch (err) {
      console.error('Erro de conexão com o servidor:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique equipments from current exercises database to populate the equipment filter dynamically
  const uniqueEquipments = ['Todos', ...Array.from(
    new Set(exercises.flatMap(ex => ex.equipamentos))
  ).sort()];

  // Ends the admin session (used both for manual logout and expired/invalid tokens)
  const endAdminSession = (message?: string) => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    setActiveView('library');
    if (message) setLoginError(message);
  };

  // Wraps fetch to attach the admin session token to write requests and auto-logout on 401
  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('admin_token');
    const headers = new Headers(options.headers || {});
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      endAdminSession('Sessão expirada. Faça login novamente.');
    }
    return response;
  };

  // API Integration: Add new exercise to backend
  const handleAddExercise = async (newEx: Partial<Exercicio>): Promise<Exercicio | null> => {
    try {
      const response = await authFetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEx)
      });
      if (response.ok) {
        const added = await response.json();
        setExercises(prev => [...prev, added]);
        return added;
      }
    } catch (err) {
      console.error('Erro ao adicionar exercício:', err);
    }
    return null;
  };

  // API Integration: Update existing exercise
  const handleUpdateExercise = async (id: string, updatedEx: Partial<Exercicio>): Promise<Exercicio | null> => {
    try {
      const response = await authFetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEx)
      });
      if (response.ok) {
        const updated = await response.json();
        setExercises(prev => prev.map(ex => ex.id === id ? updated : ex));
        if (selectedExercise && selectedExercise.id === id) {
          setSelectedExercise(updated);
        }
        return updated;
      }
    } catch (err) {
      console.error('Erro ao atualizar exercício:', err);
    }
    return null;
  };

  // API Integration: Delete exercise
  const handleDeleteExercise = async (id: string): Promise<boolean> => {
    try {
      const response = await authFetch(`/api/exercises/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setExercises(prev => prev.filter(ex => ex.id !== id));
        if (selectedExercise && selectedExercise.id === id) {
          setSelectedExercise(null);
          setActiveView('library');
        }
        return true;
      }
    } catch (err) {
      console.error('Erro ao excluir exercício:', err);
    }
    return false;
  };

  // Handle Admin Login Submission - verified server-side, the real password never touches the client
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        setIsAdmin(true);
        setActiveView('admin');
        setShowLoginModal(false);
        setUsername('');
        setPassword('');
      } else {
        const errData = await response.json().catch(() => ({}));
        setLoginError(errData.error || 'Usuário ou senha incorretos. Verifique suas credenciais.');
      }
    } catch (err) {
      setLoginError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Reset all search search & filters
  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('Todos');
    setActiveMuscleGroup('Todos');
    setSelectedLevel('Todos');
    setSelectedEquipment('Todos');
  };

  // Helper to remove Portuguese accents and normalize search
  const normalizeStr = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Interactive Smart Search & Filtering Logic
  const filteredExercises = exercises.filter(ex => {
    // Hide deactivated exercises in the library view
    if (ex.ativo === false) {
      return false;
    }

    // 1. Category Filter
    if (activeCategory !== 'Todos' && ex.categoria !== activeCategory) {
      return false;
    }

    // 2. Muscle Group Filter
    if (activeMuscleGroup !== 'Todos' && ex.grupoMuscular !== activeMuscleGroup) {
      return false;
    }

    // 3. Difficulty Level Filter
    if (selectedLevel !== 'Todos' && ex.nivel !== selectedLevel) {
      return false;
    }

    // 4. Equipment Filter
    if (selectedEquipment !== 'Todos' && !ex.equipamentos.includes(selectedEquipment)) {
      return false;
    }

    // 5. Smart Search Bar Filter (Instant match on: Name, description, muscle, equipments, objectives, tags)
    if (searchQuery.trim() !== '') {
      const normQuery = normalizeStr(searchQuery);
      
      const matchName = normalizeStr(ex.nome).includes(normQuery);
      const matchDesc = normalizeStr(ex.descricao).includes(normQuery);
      const matchObjective = normalizeStr(ex.objetivo).includes(normQuery);
      const matchMuscleGroup = normalizeStr(ex.grupoMuscular).includes(normQuery);
      const matchSubgroup = ex.subGrupo ? normalizeStr(ex.subGrupo).includes(normQuery) : false;
      
      const matchSpecificMuscles = ex.musculos.some(m => normalizeStr(m).includes(normQuery));
      const matchEquip = ex.equipamentos.some(e => normalizeStr(e).includes(normQuery));
      const matchTags = ex.tags.some(t => normalizeStr(t).includes(normQuery));

      return (
        matchName || 
        matchDesc || 
        matchObjective || 
        matchMuscleGroup || 
        matchSubgroup || 
        matchSpecificMuscles || 
        matchEquip || 
        matchTags
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#08080A] flex flex-col selection:bg-[#39FF14]/20 selection:text-[#39FF14]" id="app-root">
      {/* Top Header */}
      <Header
        isAdmin={isAdmin}
        onLogout={() => endAdminSession()}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenLogin={() => {
          setLoginError(null);
          setUsername('');
          setPassword('');
          setShowLoginModal(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-grow" id="app-main-content">
        {activeView === 'admin' && isAdmin ? (
          /* Render the professional admin panel */
          <AdminPanel
            exercises={exercises}
            onAddExercise={handleAddExercise}
            onUpdateExercise={handleUpdateExercise}
            onDeleteExercise={handleDeleteExercise}
            onRefreshExercises={fetchExercises}
            authFetch={authFetch}
          />
        ) : activeView === 'detail' && selectedExercise ? (
          /* Render detail tutorial page */
          <ExerciseDetail 
            exercise={selectedExercise}
            onBack={() => {
              setSelectedExercise(null);
              setActiveView('library');
            }}
          />
        ) : (
          /* Render student library home page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn" id="library-view">
            
            {/* Hero Brand Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4" id="library-hero">
              <span className="text-[11px] tracking-[0.3em] text-[#39FF14] uppercase font-bold block animate-pulse">
                Área de Treino & Consciência Corporal
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-white font-bold tracking-tight">
                Biblioteca de Exercícios
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-light">
                Aprenda a executar cada exercício corretamente através de demonstrações interativas, dicas biomecânicas do treinador, respiração adequada e alinhamento postural perfeito.
              </p>
            </div>

            {/* Main Library Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="library-bento-grid">
              
              {/* Left/Center side: Search and Exercise Cards Grid (8 Cols) */}
              <div className="lg:col-span-8 space-y-8" id="cards-column">
                
                {/* Search & Advanced filters Controls block */}
                <div className="bg-[#121214]/60 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md" id="filter-controls-card">
                  {/* Search Bar Input */}
                  <div className="relative" id="search-bar-wrapper">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar por exercício, músculo, equipamento ou palavra-chave..."
                      className="w-full pl-12 pr-4 py-4 bg-zinc-950/80 border border-zinc-900 focus:border-[#39FF14] rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all duration-300 shadow-inner"
                      id="smart-search-input"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
                        id="clear-search-btn"
                      >
                        [Limpar]
                      </button>
                    )}
                  </div>

                  {/* Category Pill Buttons */}
                  <div className="space-y-3" id="categories-wrapper">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Filtrar por Categoria
                    </span>
                    <div className="flex flex-wrap gap-2" id="category-pills-list">
                      {categoriesWithIcons.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setActiveCategory(cat.name)}
                          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
                            activeCategory === cat.name
                              ? 'bg-gradient-to-r from-[#39FF14] to-[#2DE600] text-black border-transparent shadow-lg shadow-[#39FF14]/15'
                              : 'bg-zinc-900/60 text-zinc-400 border-zinc-850 hover:text-white hover:border-zinc-700'
                          }`}
                          id={`cat-pill-${cat.name}`}
                        >
                          <span className="text-sm leading-none">{cat.icon}</span>
                          <span>{cat.name === 'Todos' ? 'Todas' : cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dropdowns filters row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-900/60" id="dropdown-filters-row">
                    {/* Level Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Dificuldade / Nível
                      </label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-900 text-zinc-300 text-xs rounded-2xl focus:outline-none focus:border-[#39FF14] transition-colors"
                        id="filter-level-select"
                      >
                        <option value="Todos">Todos os Níveis</option>
                        <option value="Iniciante">Iniciante</option>
                        <option value="Intermediário">Intermediário</option>
                        <option value="Avançado">Avançado</option>
                      </select>
                    </div>

                    {/* Equipment Selector */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Aparelho ou Equipamento
                      </label>
                      <select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-900 text-zinc-300 text-xs rounded-2xl focus:outline-none focus:border-[#39FF14] transition-colors"
                        id="filter-equipment-select"
                      >
                        <option value="Todos">Todos os Equipamentos</option>
                        {uniqueEquipments.filter(eq => eq !== 'Todos').map((eq) => (
                          <option key={eq} value={eq}>{eq}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(searchQuery || activeCategory !== 'Todos' || activeMuscleGroup !== 'Todos' || selectedLevel !== 'Todos' || selectedEquipment !== 'Todos') && (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-900/60 text-xs" id="filters-summary">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-zinc-500 mr-1.5">Filtros ativos:</span>
                        {activeCategory !== 'Todos' && (
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px]">Categoria: {activeCategory}</span>
                        )}
                        {activeMuscleGroup !== 'Todos' && (
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px]">Músculo: {activeMuscleGroup}</span>
                        )}
                        {selectedLevel !== 'Todos' && (
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px]">Nível: {selectedLevel}</span>
                        )}
                        {selectedEquipment !== 'Todos' && (
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px]">Aparelho: {selectedEquipment}</span>
                        )}
                        {searchQuery && (
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 font-mono text-[10px]">Busca: "{searchQuery}"</span>
                        )}
                      </div>

                      <button
                        onClick={resetFilters}
                        className="text-xs font-semibold text-[#39FF14] hover:underline flex items-center space-x-1"
                        id="reset-filters-btn"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Redefinir Filtros</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Cards List Grid */}
                {loading ? (
                  /* Loading placeholders shimmer state */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="loading-shimmer-grid">
                    {[1, 2, 4, 5].map((idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-3xl h-64 p-6 flex flex-col space-y-4">
                        <div className="h-4 w-1/3 rounded bg-zinc-900 animate-shimmer"></div>
                        <div className="h-6 w-3/4 rounded bg-zinc-900 animate-shimmer"></div>
                        <div className="h-16 w-full rounded bg-zinc-900 animate-shimmer"></div>
                        <div className="h-10 mt-auto w-full rounded bg-zinc-900 animate-shimmer"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredExercises.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="exercises-cards-grid">
                    {filteredExercises.map((ex) => (
                      <ExerciseCard 
                        key={ex.id}
                        exercise={ex}
                        onSelect={(selected) => {
                          setSelectedExercise(selected);
                          setActiveView('detail');
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty state */
                  <div className="bg-[#121214]/20 border border-zinc-900 rounded-3xl p-12 text-center" id="empty-state-container">
                    <HelpCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="font-serif text-lg text-white font-bold mb-2">Nenhum exercício localizado</h3>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed mb-6">
                      Não encontramos exercícios que correspondam aos filtros selecionados. Altere os filtros anatômicos ou clique abaixo para ver todos.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                      id="empty-reset-btn"
                    >
                      Ver Todos os Exercícios
                    </button>
                  </div>
                )}
              </div>

              {/* Right side: Interactive Anatomical Body Map sidebar (4 Cols) */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28" id="anatomical-column">
                <div className="bg-[#121214]/60 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md" id="sidebar-anatomical-card">
                  <div>
                    <h3 className="font-serif text-lg text-white font-bold flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14]"></span>
                      <span>Exploração Anatômica</span>
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">
                      Toque diretamente no músculo desejado na ilustração abaixo para filtrar instantaneamente os exercícios de musculação focados naquele grupo.
                    </p>
                  </div>

                  {/* Muscle Filter Label helper */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Músculo Selecionado:
                    </label>
                    <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-xl border border-zinc-900" id="selected-muscle-display">
                      <span className="text-xs font-semibold text-zinc-300">
                        {activeMuscleGroup === 'Todos' ? '🔍 Toque para filtrar...' : `💪 ${activeMuscleGroup}`}
                      </span>
                      {activeMuscleGroup !== 'Todos' && (
                        <button
                          onClick={() => setActiveMuscleGroup('Todos')}
                          className="text-[10px] font-mono text-[#39FF14] hover:underline"
                          id="clear-muscle-btn"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive human model */}
                  <AnatomicalBody 
                    activeMuscles={activeMuscleGroup !== 'Todos' ? [activeMuscleGroup] : []}
                    onMuscleClick={(muscle) => {
                      // Toggle muscle group filter
                      if (activeMuscleGroup === muscle) {
                        setActiveMuscleGroup('Todos');
                      } else {
                        setActiveMuscleGroup(muscle);
                        // Also automatically reset to "Musculação" if user filters by muscle
                        setActiveCategory('Musculação');
                      }
                    }}
                    interactive={true}
                  />

                  {/* Quick tips label */}
                  <div className="p-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 text-[10px] text-zinc-500 leading-relaxed font-mono" id="sidebar-anatomical-footer">
                    * Dica de Biomecânica: A ativação ideal e postura correta garantem estímulo estrito no músculo-alvo sem sobrecarregar as articulações adjacentes.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Admin Restrict Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" id="login-modal">
          <div className="w-full max-w-md bg-[#0D0D11] border border-[#39FF14]/20 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_15px_50px_rgba(57,255,20,0.1)] relative animate-scaleUp">
            
            {/* Close button */}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setUsername('');
                setPassword('');
                setLoginError(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200"
              title="Fechar"
              id="close-login-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-[20px] bg-[#0F2A12] flex items-center justify-center text-[#39FF14] border border-[rgba(57,255,20,0.2)] mx-auto">
                <Lock className="w-5 h-5 text-[#39FF14]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-white font-bold tracking-tight">Área do Professor</h3>
                <p className="text-[10px] tracking-[0.2em] text-[#39FF14] uppercase font-bold">Acesso Restrito</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 text-center animate-shake" id="login-error-msg">
                  {loginError}
                </div>
              )}

              {/* Username field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Usuário de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#131317] border border-zinc-800 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 rounded-[16px] text-xs text-white placeholder-zinc-600 focus:outline-none transition-all duration-300"
                    placeholder="Digite o usuário"
                    autoFocus
                    id="login-username-input"
                    disabled={isLoggingIn}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#131317] border border-zinc-800 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 rounded-[16px] text-xs text-white placeholder-zinc-600 focus:outline-none transition-all duration-300"
                    placeholder="Digite a senha"
                    id="login-password-input"
                    disabled={isLoggingIn}
                  />
                </div>
              </div>



              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#39FF14] hover:bg-[#2DE600] text-black text-xs font-bold uppercase tracking-wider rounded-[16px] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(57,255,20,0.25)] flex items-center justify-center space-x-2"
                id="login-submit-btn"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <span>Entrar no Painel</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
