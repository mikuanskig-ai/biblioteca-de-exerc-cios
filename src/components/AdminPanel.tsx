/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { Exercicio, CategoriaType, GrupoMuscularType, NivelType } from '../types';
import { Sparkles, Trash2, Edit2, Plus, Save, RotateCcw, AlertCircle, CheckCircle, Search, HelpCircle, Loader2, ChevronDown, ChevronUp, BookOpen, Lock } from 'lucide-react';
import { CATALOG_EXERCISES, CatalogExercise } from '../data/catalog';

interface AdminPanelProps {
  exercises: Exercicio[];
  onAddExercise: (ex: Partial<Exercicio>) => Promise<Exercicio | null>;
  onUpdateExercise: (id: string, ex: Partial<Exercicio>) => Promise<Exercicio | null>;
  onDeleteExercise: (id: string) => Promise<boolean>;
  onRefreshExercises?: () => void;
}

export default function AdminPanel({ exercises, onAddExercise, onUpdateExercise, onDeleteExercise, onRefreshExercises }: AdminPanelProps) {
  // Sync state tracking
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTotal, setSyncTotal] = useState(0);
  const [syncCurrent, setSyncCurrent] = useState(0);
  const [syncCompleted, setSyncCompleted] = useState(0);
  const [syncFailed, setSyncFailed] = useState(0);

  // Poll sync status from server
  const pollSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/status');
      if (response.ok) {
        const data = await response.json();
        setIsSyncing(data.isSyncing);
        setSyncTotal(data.total);
        setSyncCurrent(data.current);
        setSyncCompleted(data.completed);
        setSyncFailed(data.failed);

        if (!data.isSyncing && isSyncing) {
          // Completed just now!
          if (onRefreshExercises) onRefreshExercises();
          triggerSuccess(`Sincronização em massa concluída! ${data.completed} GIFs vinculados com sucesso.`);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar status da sincronização:', err);
    }
  };

  // Check sync status on mount and set interval if active
  useEffect(() => {
    pollSyncStatus();
    const interval = setInterval(pollSyncStatus, 1500);
    return () => clearInterval(interval);
  }, [isSyncing]);

  const handleSyncAllGifs = async () => {
    if (isSyncing) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      const response = await fetch('/api/sync/all', { method: 'POST' });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Não foi possível iniciar a sincronização.');
      }
      
      const data = await response.json();
      setIsSyncing(true);
      triggerSuccess('Sincronização iniciada em plano de fundo! Acompanhe o progresso na barra abaixo.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao conectar ao servidor para iniciar sincronização.');
    }
  };

  // Navigation inside Admin
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'security'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Security and Password Change States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [customUsername, setCustomUsername] = useState(() => localStorage.getItem('admin_username') || 'BiaTisatto');

  // Search in Admin
  const [searchQuery, setSearchQuery] = useState('');

  // AI Generation State
  const [aiPromptName, setAiPromptName] = useState('');
  const [aiCategory, setAiCategory] = useState<CategoriaType>('Musculação');
  const [aiMuscle, setAiMuscle] = useState<GrupoMuscularType>('Glúteos');
  const [isGenerating, setIsGenerating] = useState(false);

  // Catalog Explorer State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<CategoriaType | 'Todos'>('Todos');
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaType>('Musculação');
  const [grupoMuscular, setGrupoMuscular] = useState<GrupoMuscularType>('Glúteos');
  const [subGrupo, setSubGrupo] = useState('');
  const [nivel, setNivel] = useState<NivelType>('Iniciante');
  const [descricao, setDescricao] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [respiracao, setRespiracao] = useState('');
  const [beneficios, setBeneficios] = useState('');
  const [contraindicacoes, setContraindicacoes] = useState('');
  const [gif, setGif] = useState('');
  const [video, setVideo] = useState('');
  const [ativo, setAtivo] = useState(true);

  // Form arrays represented as textareas (one per line)
  const [equipamentosText, setEquipamentosText] = useState('');
  const [musculosText, setMusculosText] = useState('');
  const [execucaoText, setExecucaoText] = useState('');
  const [dicasText, setDicasText] = useState('');
  const [errosText, setErrosText] = useState('');
  const [variacoesText, setVariacoesText] = useState('');
  const [tagsText, setTagsText] = useState('');

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Deletion confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const categories: CategoriaType[] = ['Musculação', 'Alongamentos', 'Cardio', 'Funcional', 'Mobilidade', 'Reabilitação'];
  
  const muscleGroups: GrupoMuscularType[] = [
    'Peito', 'Costas', 'Ombros', 'Trapézio', 'Bíceps', 'Tríceps', 'Antebraço', 
    'Abdômen', 'Lombar', 'Quadríceps', 'Posterior', 'Glúteos', 'Adutores', 'Abdutores', 'Panturrilhas'
  ];

  // Helper to trigger temporary success messages
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Reset form to blank
  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setCategoria('Musculação');
    setGrupoMuscular('Glúteos');
    setSubGrupo('');
    setNivel('Iniciante');
    setDescricao('');
    setObjetivo('');
    setRespiracao('');
    setBeneficios('');
    setContraindicacoes('');
    setGif('');
    setVideo('');
    setAtivo(true);
    setEquipamentosText('');
    setMusculosText('');
    setExecucaoText('');
    setDicasText('');
    setErrosText('');
    setVariacoesText('');
    setTagsText('');
    setErrorMsg(null);
  };

  // Populate form with existing exercise for editing
  const loadExerciseToForm = (ex: Exercicio) => {
    setEditingId(ex.id);
    setNome(ex.nome);
    setCategoria(ex.categoria);
    setGrupoMuscular(ex.grupoMuscular);
    setSubGrupo(ex.subGrupo || '');
    setNivel(ex.nivel);
    setDescricao(ex.descricao);
    setObjetivo(ex.objetivo);
    setRespiracao(ex.respiracao);
    setBeneficios(ex.beneficios);
    setContraindicacoes(ex.contraindicacoes || '');
    setGif(ex.gif || '');
    setVideo(ex.video || '');
    setAtivo(ex.ativo !== false);
    
    setEquipamentosText(ex.equipamentos.join('\n'));
    setMusculosText(ex.musculos.join('\n'));
    setExecucaoText(ex.execucao.join('\n'));
    setDicasText(ex.dicas.join('\n'));
    setErrosText(ex.erros.join('\n'));
    setVariacoesText(ex.variacoes ? ex.variacoes.join('\n') : '');
    setTagsText(ex.tags.join('\n'));
    
    setErrorMsg(null);
    setActiveTab('form');
  };

  // Parse lines to array
  const textToArray = (text: string) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  // Trigger Gemini AI generation
  const handleAIGenerate = async (customNome?: string, customCategoria?: CategoriaType, customGrupoMuscular?: GrupoMuscularType) => {
    const searchNome = customNome || aiPromptName;
    const searchCategoria = customCategoria || aiCategory;
    const searchGrupoMuscular = customGrupoMuscular || aiMuscle;

    if (!searchNome.trim()) {
      setErrorMsg('Por favor, informe o nome do exercício para que o Gemini consiga analisar.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/exercises/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: searchNome,
          categoria: searchCategoria,
          grupoMuscular: searchGrupoMuscular
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao comunicar com a inteligência artificial.');
      }

      const data = await response.json();

      // Populate form fields with AI generated contents
      setNome(data.nome || searchNome);
      setCategoria(data.categoria || searchCategoria);
      setGrupoMuscular(data.grupoMuscular || searchGrupoMuscular);
      setSubGrupo(data.subGrupo || '');
      setNivel((data.nivel as NivelType) || 'Iniciante');
      setDescricao(data.descricao || '');
      setObjetivo(data.objetivo || '');
      setRespiracao(data.respiracao || '');
      setBeneficios(data.beneficios || '');
      setContraindicacoes(data.contraindicacoes || '');
      setGif(data.gif || '');
      setVideo(data.video || '');

      setEquipamentosText(Array.isArray(data.equipamentos) ? data.equipamentos.join('\n') : '');
      setMusculosText(Array.isArray(data.musculos) ? data.musculos.join('\n') : '');
      setExecucaoText(Array.isArray(data.execucao) ? data.execucao.join('\n') : '');
      setDicasText(Array.isArray(data.dicas) ? data.dicas.join('\n') : '');
      setErrosText(Array.isArray(data.erros) ? data.erros.join('\n') : '');
      setVariacoesText(Array.isArray(data.variacoes) ? data.variacoes.join('\n') : '');
      setTagsText(Array.isArray(data.tags) ? data.tags.join('\n') : '');

      triggerSuccess('Ficha gerada biomecanicamente pelo Gemini! Ajuste os detalhes abaixo e salve.');
      if (!customNome) {
        setAiPromptName('');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Erro na IA: ${err.message || 'Verifique se a sua chave de API está configurada.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit form (Save or Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setErrorMsg('O nome do exercício é um campo obrigatório.');
      return;
    }

    const payload: Partial<Exercicio> = {
      nome: nome.trim(),
      categoria,
      grupoMuscular,
      subGrupo: subGrupo.trim() || undefined,
      nivel,
      descricao: descricao.trim(),
      objetivo: objetivo.trim(),
      respiracao: respiracao.trim(),
      beneficios: beneficios.trim(),
      contraindicacoes: contraindicacoes.trim() || undefined,
      gif: gif.trim(),
      video: video.trim() || undefined,
      ativo,
      equipamentos: textToArray(equipamentosText),
      musculos: textToArray(musculosText),
      execucao: textToArray(execucaoText),
      dicas: textToArray(dicasText),
      erros: textToArray(errosText),
      variacoes: textToArray(variacoesText),
      tags: textToArray(tagsText)
    };

    if (payload.execucao!.length === 0) {
      setErrorMsg('Por favor, adicione pelo menos um passo de execução.');
      return;
    }

    try {
      if (editingId) {
        const updated = await onUpdateExercise(editingId, payload);
        if (updated) {
          triggerSuccess('Exercício atualizado com absoluto sucesso!');
          setActiveTab('list');
          resetForm();
        } else {
          setErrorMsg('Ocorreu um erro ao atualizar o exercício no banco de dados.');
        }
      } else {
        const added = await onAddExercise(payload);
        if (added) {
          triggerSuccess('Novo exercício cadastrado e salvo na biblioteca!');
          setActiveTab('list');
          resetForm();
        } else {
          setErrorMsg('Ocorreu um erro ao salvar o novo exercício.');
        }
      }
    } catch (err: any) {
      setErrorMsg(`Erro: ${err.message}`);
    }
  };

  // Handle Security Credential Changes
  const handleSecuritySubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 4) {
      setErrorMsg('A nova senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem. Por favor, verifique.');
      return;
    }

    // Save user configuration to localStorage
    const trimmedUsername = customUsername.trim();
    localStorage.setItem('admin_username', trimmedUsername || 'BiaTisatto');
    localStorage.setItem('admin_password', newPassword);

    triggerSuccess(`Credenciais salvas! Usuário de acesso: "${trimmedUsername || 'BiaTisatto'}". Use a nova senha para o próximo login.`);
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Delete
  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(name);
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const ok = await onDeleteExercise(deleteConfirmId);
      if (ok) {
        triggerSuccess('Exercício excluído da biblioteca.');
        setDeleteConfirmId(null);
        setDeleteConfirmName('');
      } else {
        setErrorMsg('Não foi possível excluir o exercício do banco de dados.');
      }
    } catch (err: any) {
      setErrorMsg(`Erro ao deletar: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter list in Admin
  const filteredExercises = exercises.filter(ex => {
    const query = searchQuery.toLowerCase();
    return (
      ex.nome.toLowerCase().includes(query) ||
      ex.grupoMuscular.toLowerCase().includes(query) ||
      ex.categoria.toLowerCase().includes(query) ||
      ex.equipamentos.some(eq => eq.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="admin-panel">
      {/* Banner */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="admin-banner">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#39FF14] uppercase font-bold">Painel de Gestão</span>
          <h1 className="font-sans text-3xl text-white font-extrabold mt-1">Área do Profissional</h1>
          <p className="text-zinc-500 text-xs mt-1">
            Cadastre, edite e organize os exercícios que os seus alunos visualizam na planilha de treinos.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#111111] p-1.5 rounded-full border border-[rgba(57,255,20,0.15)] overflow-x-auto max-w-full" id="admin-tab-switcher">
          <button
            onClick={() => {
              setActiveTab('list');
              resetForm();
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
              activeTab === 'list' 
                ? 'bg-[#39FF14] text-[#050505] shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                : 'text-zinc-400 hover:text-[#39FF14]'
            }`}
            id="tab-list-btn"
          >
            Lista de Exercícios ({exercises.length})
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab('form');
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'form' 
                ? 'bg-[#39FF14] text-[#050505] shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                : 'text-zinc-400 hover:text-[#39FF14]'
            }`}
            id="tab-create-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Novo</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab('security');
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'security' 
                ? 'bg-[#39FF14] text-[#050505] shadow-[0_0_15px_rgba(57,255,20,0.3)]' 
                : 'text-zinc-400 hover:text-[#39FF14]'
            }`}
            id="tab-security-btn"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Alterar Senha</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start space-x-3 text-rose-400" id="admin-err-box">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">{errorMsg}</div>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-[#39FF14]/20 rounded-2xl flex items-start space-x-3 text-[#39FF14] animate-fadeIn" id="admin-success-box">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">{successMsg}</div>
        </div>
      )}

      {/* Content tabs */}
      {activeTab === 'list' ? (
        <div className="space-y-6" id="admin-tab-list">
          {/* List Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between" id="list-toolbar">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome, grupo, equipamento..."
                className="w-full pl-11 pr-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#39FF14] focus:shadow-[0_0_10px_rgba(57,255,20,0.15)] transition-all"
                id="admin-search-input"
              />
            </div>
            
            <div className="text-xs text-zinc-500 font-mono">
              Mostrando {filteredExercises.length} de {exercises.length} cadastrados
            </div>
          </div>

          {/* Sync Progress Bar or Sync All Button */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" id="admin-sync-section">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                  <span>Sincronização de GIFs (ExerciseDB)</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Integração automática para buscar e vincular GIFs reais de exercícios a partir da biblioteca cinesiológica ExerciseDB.
                </p>
              </div>

              {!isSyncing ? (
                <button
                  onClick={handleSyncAllGifs}
                  className="px-5 py-3 rounded-[16px] bg-[#0D0D0D] hover:bg-[#39FF14] text-[#D1D5DB] hover:text-[#050505] text-xs font-bold uppercase tracking-wider transition-all duration-300 border border-[rgba(57,255,20,0.15)] hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)] flex items-center space-x-2"
                  id="start-bulk-sync-btn"
                >
                  <span>🔄 Sincronizar Todos os GIFs</span>
                </button>
              ) : (
                <div className="text-xs text-zinc-400 font-mono flex items-center space-x-2 bg-[#0D0D0D] px-4 py-2.5 rounded-xl border border-[rgba(57,255,20,0.1)]">
                  <Loader2 className="w-3.5 h-3.5 text-[#39FF14] animate-spin" />
                  <span>Sincronizando banco de dados...</span>
                </div>
              )}
            </div>

            {isSyncing && (
              <div className="mt-6 space-y-3" id="sync-progress-details">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="text-[#39FF14] font-bold">{syncCurrent}</span>
                    <span>/</span>
                    <span className="text-zinc-500">{syncTotal}</span>
                    <span>exercícios analisados</span>
                  </div>
                  <span className="font-bold text-[#39FF14]">
                    {syncTotal > 0 ? Math.round((syncCurrent / syncTotal) * 100) : 0}%
                  </span>
                </div>

                {/* Progress bar tracks */}
                <div className="h-2 w-full bg-[#0D0D0D] rounded-full overflow-hidden border border-[rgba(57,255,20,0.1)]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-[#39FF14] to-lime-400 rounded-full transition-all duration-300"
                    style={{ width: `${syncTotal > 0 ? (syncCurrent / syncTotal) * 100 : 0}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span className="text-emerald-400 font-bold">✔️ Vinculados com Sucesso: {syncCompleted}</span>
                  <span className="text-zinc-500">❌ Não Encontrados/Mantidos: {syncFailed}</span>
                </div>
              </div>
            )}
          </div>

          {/* Table list */}
          <div className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)]" id="admin-table-container">
            {filteredExercises.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="admin-exercises-table">
                  <thead>
                    <tr className="border-b border-[rgba(57,255,20,0.15)] bg-[#0D0D0D] text-[10px] font-bold uppercase tracking-[0.15em] text-[#39FF14]">
                      <th className="py-4 px-6">Nome do Exercício</th>
                      <th className="py-4 px-4">Categoria</th>
                      <th className="py-4 px-4">Grupo Muscular</th>
                      <th className="py-4 px-4">Nível</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Equipamentos</th>
                      <th className="py-4 px-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(57,255,20,0.1)] text-xs text-zinc-300">
                    {filteredExercises.map((ex) => (
                      <tr key={ex.id} className="hover:bg-[#161616] text-zinc-350 transition-colors" id={`table-row-${ex.id}`}>
                        <td className="py-4 px-6 font-semibold text-white">
                          {ex.nome}
                          <span className="block text-[10px] text-zinc-500 font-mono font-normal mt-0.5">slug: {ex.slug}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] text-[#39FF14] text-[10px]">
                            {ex.categoria}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">{ex.grupoMuscular}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold ${
                            ex.nivel === 'Iniciante' ? 'text-[#39FF14]' : ex.nivel === 'Intermediário' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {ex.nivel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={async () => {
                              const newStatus = ex.ativo === false ? true : false;
                              await onUpdateExercise(ex.id, { ...ex, ativo: newStatus });
                              triggerSuccess(`Exercício "${ex.nome}" foi ${newStatus ? 'ativado' : 'desativado'} com sucesso!`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                              ex.ativo !== false 
                                ? 'bg-[#0F2A12] text-[#39FF14] border-[rgba(57,255,20,0.25)] hover:bg-[#1a441e]' 
                                : 'bg-zinc-900 text-zinc-500 border-zinc-850 hover:bg-zinc-800'
                            }`}
                            title={ex.ativo !== false ? "Clique para desativar o exercício" : "Clique para ativar o exercício"}
                            id={`toggle-status-btn-${ex.id}`}
                          >
                            {ex.ativo !== false ? '🟢 Ativo' : '🔴 Inativo'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-zinc-500 truncate max-w-[150px]">
                          {ex.equipamentos.join(', ') || 'Nenhum'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => loadExerciseToForm(ex)}
                              className="p-2 rounded-[12px] bg-[#0D0D0D] hover:bg-[#161616] border border-[rgba(57,255,20,0.15)] text-zinc-300 hover:text-[#39FF14] transition-colors"
                              title="Editar Exercício"
                              id={`edit-btn-${ex.id}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(ex.id, ex.nome)}
                              className="p-2 rounded-[12px] bg-[#0D0D0D] hover:bg-rose-950/20 border border-[rgba(57,255,20,0.15)] text-zinc-400 hover:text-rose-500 transition-colors"
                              title="Excluir Exercício"
                              id={`delete-btn-${ex.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-6" id="empty-table-state">
                <HelpCircle className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">Nenhum exercício localizado</h3>
                <p className="text-xs text-zinc-500">Tente buscar por termos diferentes ou adicione um novo exercício.</p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-tab-form">
          {/* Left Column: AI Assistant Generator */}
          {!editingId && (
            <div className="lg:col-span-4 bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 h-fit space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] animate-fadeIn" id="ai-generator-panel">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#0F2A12]">
                  <Sparkles className="w-5 h-5 text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="font-sans text-lg text-white font-bold">Assistente de IA</h3>
                  <p className="text-[10px] tracking-wider text-[#39FF14] uppercase font-bold">Gerador Biomecânico</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Digite o nome de um exercício (ex: <span className="text-zinc-300 italic">"Afundo com Halteres"</span>, <span className="text-zinc-300 italic">"Elevação Pélvica"</span>, <span className="text-zinc-300 italic">"Crucifixo Invertido"</span>). O Gemini irá elaborar a descrição anatômica, execução, dicas e respiração de forma profissional.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Nome do Exercício
                  </label>
                  <input
                    type="text"
                    value={aiPromptName}
                    onChange={(e) => setAiPromptName(e.target.value)}
                    placeholder="Ex: Agachamento Búlgaro"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="ai-prompt-input"
                    disabled={isGenerating}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Categoria Alvo
                    </label>
                    <select
                      value={aiCategory}
                      onChange={(e) => setAiCategory(e.target.value as CategoriaType)}
                      className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                      id="ai-category-select"
                      disabled={isGenerating}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Grupo Muscular
                    </label>
                    <select
                      value={aiMuscle}
                      onChange={(e) => setAiMuscle(e.target.value as GrupoMuscularType)}
                      className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                      id="ai-muscle-select"
                      disabled={isGenerating}
                    >
                      {muscleGroups.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAIGenerate}
                  className="w-full py-3.5 rounded-[16px] bg-[#39FF14] hover:bg-[#2DE600] text-[#050505] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-md shadow-[0_0_15px_rgba(57,255,20,0.25)] disabled:opacity-50"
                  disabled={isGenerating}
                  id="trigger-ai-generate-btn"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                      <span>Analisando Biomecânica...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-current text-[#050505]" />
                      <span>Gerar Ficha com IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive Catalog Suggestions */}
              <div className="border-t border-zinc-800/80 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
                  className="w-full flex items-center justify-between text-left text-zinc-350 hover:text-[#39FF14] transition-colors"
                  id="toggle-catalog-btn"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-[#39FF14]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Biblioteca de Sugestões (150+)</span>
                  </div>
                  {isCatalogExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </button>

                {isCatalogExpanded && (
                  <div className="mt-4 space-y-3 animate-fadeIn" id="catalog-explorer-content">
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Selecione qualquer exercício abaixo para preencher os campos do gerador de forma instantânea.
                    </p>

                    {/* Search in Catalog */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Buscar no catálogo de 150+..."
                        className="w-full pl-9 pr-3 py-2.5 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#39FF14] transition-all"
                        id="catalog-search-input"
                      />
                    </div>

                    {/* Category quick filters */}
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none" id="catalog-category-filters">
                      {(['Todos', 'Musculação', 'Cardio', 'Alongamentos', 'Mobilidade', 'Funcional', 'Reabilitação'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCatalogCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-md text-[9px] font-semibold whitespace-nowrap transition-colors ${
                            catalogCategoryFilter === cat
                              ? 'bg-[#0F2A12] text-[#39FF14] border border-[#39FF14]/30'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Catalog items list */}
                    <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1 border border-zinc-800/80 rounded-xl p-2 bg-[#080808]" id="catalog-items-list">
                      {(() => {
                        const filtered = CATALOG_EXERCISES.filter((item) => {
                          const matchesSearch = item.nome.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                                                item.subGrupo.toLowerCase().includes(catalogSearch.toLowerCase());
                          const matchesCategory = catalogCategoryFilter === 'Todos' || item.categoria === catalogCategoryFilter;
                          return matchesSearch && matchesCategory;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-6 text-[10px] text-zinc-600 font-mono">
                              Nenhuma sugestão encontrada
                            </div>
                          );
                        }

                        return filtered.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setAiPromptName(item.nome);
                              setAiCategory(item.categoria);
                              setAiMuscle(item.grupoMuscular);
                              
                              // Focus target and apply subtle flash effect
                              const target = document.getElementById('ai-prompt-input');
                              if (target) {
                                target.focus();
                                target.classList.add('border-[#39FF14]');
                                setTimeout(() => {
                                  target.classList.remove('border-[#39FF14]');
                                }, 800);
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg bg-[#0F0F12] hover:bg-[#121216] border border-zinc-800/50 hover:border-[#39FF14]/30 group transition-all flex flex-col space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors truncate max-w-[70%]">
                                {item.nome}
                              </span>
                              <span className="text-[8px] text-[#39FF14] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#0F2A12] border border-[#39FF14]/10 rounded">
                                {item.categoria}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                              <span>{item.subGrupo}</span>
                              <span>Foco: {item.grupoMuscular}</span>
                            </div>
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {isGenerating && (
                <div className="p-4 bg-[#0D0D0D] rounded-[16px] border border-[rgba(57,255,20,0.15)] animate-pulse text-zinc-500 text-[11px] leading-relaxed" id="ai-generating-feedback">
                  <span className="font-semibold text-zinc-400 block mb-1">Como funciona?</span>
                  O modelo <span className="text-[#39FF14] font-mono">Gemini</span> está gerando uma prescrição contendo grupos musculares corretos, erros biomecânicos e instruções de respiração de forma profissional. Isso pode levar alguns segundos.
                </div>
              )}
            </div>
          )}

          {/* Right Column: Standard Manual Form */}
          <div className={editingId ? "lg:col-span-12 animate-fadeIn" : "lg:col-span-8 animate-fadeIn"} id="manual-form-container">
            <form onSubmit={handleSubmit} className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" id="exercise-editor-form">
              <h3 className="font-sans text-lg text-white font-bold pb-4 border-b border-[rgba(57,255,20,0.15)]" id="form-heading">
                {editingId ? `Editar: ${nome}` : 'Prescrever Novo Exercício'}
              </h3>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="form-fields-grid">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Nome Completo do Exercício *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAIGenerate(nome, categoria, grupoMuscular)}
                      className="text-[10px] font-bold text-[#39FF14] hover:text-[#2DE600] flex items-center space-x-1.5 uppercase tracking-wider transition-colors disabled:opacity-50"
                      id="form-generate-ai-inline-btn"
                      disabled={isGenerating || !nome.trim()}
                      title="Preencher automaticamente todos os campos abaixo usando o Gemini para o exercício informado"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analisando...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Preencher com IA</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Leg Press 45 Graus"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-name-input"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaType)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-category-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Grupo Muscular */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Grupo Muscular Principal
                  </label>
                  <select
                    value={grupoMuscular}
                    onChange={(e) => setGrupoMuscular(e.target.value as GrupoMuscularType)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-muscle-select"
                  >
                    {muscleGroups.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Subgrupo */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Subgrupo Muscular / Articulação (Opcional)
                  </label>
                  <input
                    type="text"
                    value={subGrupo}
                    onChange={(e) => setSubGrupo(e.target.value)}
                    placeholder="Ex: Coxas e Glúteos"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-subgroup-input"
                  />
                </div>

                {/* Nível */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Nível de Dificuldade
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as NivelType)}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-level-select"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>

                {/* Status na Biblioteca */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Status na Biblioteca
                  </label>
                  <select
                    value={ativo ? 'true' : 'false'}
                    onChange={(e) => setAtivo(e.target.value === 'true')}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-zinc-300 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-status-select"
                  >
                    <option value="true">🟢 Ativo (Visível para alunos)</option>
                    <option value="false">🔴 Inativo (Oculto para alunos)</option>
                  </select>
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Descrição Didática / Introdução
                  </label>
                  <textarea
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Escreva uma introdução leve, acolhedora e inspiradora sobre o exercício..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-desc-textarea"
                  />
                </div>

                {/* Objetivo */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Objetivo do Movimento
                  </label>
                  <input
                    type="text"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    placeholder="Ex: Desenvolver a força máxima de quadríceps de maneira segura e postural."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-objective-input"
                  />
                </div>

                {/* Equipamentos (one per line) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Equipamentos Requeridos
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Um por linha</span>
                  <textarea
                    rows={3}
                    value={equipamentosText}
                    onChange={(e) => setEquipamentosText(e.target.value)}
                    placeholder="Ex:&#10;Banco Inclinado&#10;Halteres"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y font-mono"
                    id="form-equip-textarea"
                  />
                </div>

                {/* Musculos detalhados (one per line) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Músculos Recrutados
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Um por linha</span>
                  <textarea
                    rows={3}
                    value={musculosText}
                    onChange={(e) => setMusculosText(e.target.value)}
                    placeholder="Ex:&#10;Glúteo Máximo&#10;Quadríceps Femoral"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y font-mono"
                    id="form-muscles-textarea"
                  />
                </div>

                {/* Como Executar (step by step, one per line) */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Como Executar (Passo a Passo) *
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Escreva cada passo ou instrução em uma nova linha</span>
                  <textarea
                    rows={4}
                    required
                    value={execucaoText}
                    onChange={(e) => setExecucaoText(e.target.value)}
                    placeholder="Ex:&#10;Deite no banco alinhando os ombros...&#10;Segure firme as cargas mantendo o peito inflado...&#10;Realize a flexão de forma controlada até as laterais..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-execution-textarea"
                  />
                </div>

                {/* Respiração */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Instruções de Respiração & Cadência
                  </label>
                  <input
                    type="text"
                    value={respiracao}
                    onChange={(e) => setRespiracao(e.target.value)}
                    placeholder="Ex: Inspire na descida (fase excêntrica) acumulando pressão no abdômen. Expire na subida."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-breathing-input"
                  />
                </div>

                {/* Dicas (one per line) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Dicas de Execução (3 a 8)
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Uma por linha</span>
                  <textarea
                    rows={4}
                    value={dicasText}
                    onChange={(e) => setDicasText(e.target.value)}
                    placeholder="Ex:&#10;Mantenha as escápulas conectadas&#10;O calcanhar empurra firme o solo&#10;Olhar neutro"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-tips-textarea"
                  />
                </div>

                {/* Erros Comuns (one per line) */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Erros Comuns (3 a 8)
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Um por linha</span>
                  <textarea
                    rows={4}
                    value={errosText}
                    onChange={(e) => setErrosText(e.target.value)}
                    placeholder="Ex:&#10;Projetar o joelho para dentro&#10;Arredondar a coluna lombar&#10;Tirar os calcanhares do chão"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-errors-textarea"
                  />
                </div>

                {/* Benefícios */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Benefícios do Movimento
                  </label>
                  <textarea
                    rows={2}
                    value={beneficios}
                    onChange={(e) => setBeneficios(e.target.value)}
                    placeholder="Benefícios posturais, metabólicos ou de hipertrofia do exercício..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-benefits-textarea"
                  />
                </div>

                {/* Contraindicações */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Restrições / Contraindicações (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={contraindicacoes}
                    onChange={(e) => setContraindicacoes(e.target.value)}
                    placeholder="Casos em que o aluno deve evitar ou adaptar este exercício (hérnias agudas, lesão de manguito rotador, etc.)..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-contraindications-textarea"
                  />
                </div>

                {/* Variações */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Variações Anatômicas / Substitutos
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Uma por linha</span>
                  <textarea
                    rows={3}
                    value={variacoesText}
                    onChange={(e) => setVariacoesText(e.target.value)}
                    placeholder="Ex:&#10;Agachamento Taça&#10;Agachamento Smith"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-variations-textarea"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Tags de Busca Inteligente
                  </label>
                  <span className="block text-[9px] text-zinc-600 mb-2 font-mono">Uma por linha (sem hash)</span>
                  <textarea
                    rows={3}
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    placeholder="Ex:&#10;pernas&#10;quadril&#10;agachamento"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors resize-y"
                    id="form-tags-textarea"
                  />
                </div>

                {/* GIF / Mídia URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    URL do GIF de Demonstração (Opcional)
                  </label>
                  <input
                    type="url"
                    value={gif}
                    onChange={(e) => setGif(e.target.value)}
                    placeholder="https://exemplo.com/demonstracao.gif"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-gif-input"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    URL do Vídeo Explicativo YouTube (Opcional)
                  </label>
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => setVideo(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-colors"
                    id="form-video-input"
                  />
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[rgba(57,255,20,0.15)]" id="form-actions-footer">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('list');
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-[16px] border border-[rgba(57,255,20,0.15)] text-xs font-semibold text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14] transition-colors"
                  id="cancel-btn"
                >
                  Cancelar & Voltar
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-[16px] border border-[rgba(57,255,20,0.15)] text-xs font-semibold text-zinc-400 hover:text-[#39FF14] hover:border-[#39FF14] transition-colors flex items-center justify-center space-x-1.5"
                  id="reset-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Campos</span>
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-[16px] bg-[#39FF14] hover:bg-[#2DE600] text-[#050505] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 font-extrabold shadow-md shadow-[0_0_15px_rgba(57,255,20,0.25)]"
                  id="save-exercise-btn"
                >
                  <Save className="w-4 h-4 text-[#050505]" />
                  <span>{editingId ? 'Salvar Alterações' : 'Salvar Exercício'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {activeTab === 'security' && (
        <div className="max-w-md mx-auto animate-fadeIn" id="admin-security-tab">
          <form onSubmit={handleSecuritySubmit} className="bg-[#111111] border border-[rgba(57,255,20,0.15)] rounded-[24px] p-6 sm:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)]" id="security-credentials-form">
            <div className="flex items-center space-x-3 pb-4 border-b border-[rgba(57,255,20,0.15)]">
              <div className="p-2.5 rounded-xl bg-[#0F2A12] border border-[#39FF14]/20 text-[#39FF14]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans text-lg text-white font-bold">Alterar Senha e Acesso</h3>
                <p className="text-[9px] text-[#39FF14] uppercase font-bold tracking-wider">Configurações de Segurança</p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Usuário de Acesso
              </label>
              <input
                type="text"
                required
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                placeholder="Digite o novo usuário"
                id="sec-username-input"
              />
              <span className="text-[9px] text-zinc-500 font-mono block mt-1">Defina o nome de usuário utilizado para entrar nesta área do professor.</span>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Nova Senha
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                placeholder="Mínimo de 4 caracteres"
                id="sec-password-input"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-[rgba(57,255,20,0.15)] rounded-[16px] text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#39FF14] transition-all duration-300"
                placeholder="Digite a nova senha novamente"
                id="sec-confirm-password-input"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[rgba(57,255,20,0.15)]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('list');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-[16px] border border-[rgba(57,255,20,0.15)] text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                id="sec-cancel-btn"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-[16px] bg-[#39FF14] hover:bg-[#2DE600] text-[#050505] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 font-extrabold shadow-md shadow-[0_0_15px_rgba(57,255,20,0.25)]"
                id="sec-save-btn"
              >
                <Save className="w-4 h-4 text-[#050505]" />
                <span>Salvar Credenciais</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" id="delete-confirm-modal">
          <div className="w-full max-w-md bg-[#111111] border border-rose-500/30 rounded-[28px] p-6 sm:p-8 space-y-6 shadow-[0_15px_50px_rgba(244,63,94,0.15)] animate-scaleUp">
            <div className="flex items-center space-x-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-sans text-lg text-white font-extrabold">Excluir Exercício</h3>
                <p className="text-[10px] tracking-wider text-rose-500 uppercase font-bold">Ação Irreversível</p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Tem certeza absoluta de que deseja excluir o exercício <strong className="text-white">"{deleteConfirmName}"</strong> da biblioteca? Essa ação removerá permanentemente o registro do banco de dados de treinos.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteConfirmName('');
                }}
                className="w-full sm:w-1/2 px-5 py-3 rounded-[16px] border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                id="cancel-delete-btn"
                disabled={isDeleting}
              >
                Voltar / Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="w-full sm:w-1/2 px-5 py-3.5 rounded-[16px] bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2"
                id="confirm-delete-btn"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <span>Excluir para Sempre</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
