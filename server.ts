/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

const app = express();
const PORT = 3000;

// Resolve paths
const EXERCISES_FILE_PATH = path.join(process.cwd(), 'data', 'exercises.json');

// Body parser
app.use(express.json());

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Aviso: GEMINI_API_KEY não foi configurada. Funcionalidades de IA não estarão disponíveis.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'MOCK_KEY_FOR_SAFETY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --- Firebase Configuration & In-Memory Caching ---
let cachedExercises: any[] = [];
let db: any = null;

async function saveExerciseToFirestore(ex: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'exercises', ex.id), ex);
    console.log(`Exercício ${ex.nome} salvo no Firestore.`);
  } catch (error) {
    console.error(`Erro ao salvar ${ex.nome} no Firestore:`, error);
  }
}

async function deleteExerciseFromFirestore(id: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'exercises', id));
    console.log(`Exercício ${id} deletado do Firestore.`);
  } catch (error) {
    console.error(`Erro ao deletar ${id} do Firestore:`, error);
  }
}

async function initFirebaseAndCache() {
  // 1. Carregar do backup local como fallback inicial síncrono/imediato
  try {
    if (fs.existsSync(EXERCISES_FILE_PATH)) {
      const data = fs.readFileSync(EXERCISES_FILE_PATH, 'utf8');
      cachedExercises = JSON.parse(data);
      console.log(`Carregado backup local de ${cachedExercises.length} exercícios.`);
    }
  } catch (err) {
    console.error('Erro ao ler backup local inicial:', err);
  }

  // 2. Inicializar Firebase e sincronizar
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const firebaseApp = initializeApp(config);
      db = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
      console.log('Firebase Firestore inicializado com sucesso.');

      // Buscar exercícios do Firestore
      console.log('Carregando exercícios do Firestore...');
      const querySnapshot = await getDocs(collection(db, 'exercises'));
      
      if (querySnapshot.empty) {
        console.log('Firestore está vazio. Semeando com os exercícios do arquivo local...');
        // Semear banco de dados com os exercícios que já existem localmente
        for (const ex of cachedExercises) {
          await setDoc(doc(db, 'exercises', ex.id), ex);
        }
        console.log(`Semeado ${cachedExercises.length} exercícios no Firestore.`);
      } else {
        const firestoreExercises: any[] = [];
        querySnapshot.forEach((docSnap) => {
          firestoreExercises.push(docSnap.data());
        });
        cachedExercises = firestoreExercises;
        console.log(`Carregados ${cachedExercises.length} exercícios do Firestore com sucesso.`);
        
        // Atualizar o arquivo local de backup caso não esteja na Vercel
        if (!process.env.VERCEL) {
          try {
            const dir = path.dirname(EXERCISES_FILE_PATH);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(EXERCISES_FILE_PATH, JSON.stringify(cachedExercises, null, 2), 'utf8');
          } catch (e) {
            console.error('Erro ao atualizar backup local:', e);
          }
        }
      }
    } else {
      console.warn('Aviso: firebase-applet-config.json não encontrado. Firestore desabilitado.');
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase / carregar do Firestore:', error);
  }
}

// Inicializar imediatamente em segundo plano ao carregar o módulo
initFirebaseAndCache();

function readExercises(): any[] {
  return cachedExercises;
}

function writeExercises(exercises: any[]): boolean {
  cachedExercises = exercises;
  
  // Atualizar backup local (se não estiver na Vercel)
  try {
    if (!process.env.VERCEL) {
      const dir = path.dirname(EXERCISES_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(EXERCISES_FILE_PATH, JSON.stringify(exercises, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('Erro ao escrever backup local:', error);
  }

  return true;
}

// Helper to generate a slug from text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

// --- ExerciseDB Integration & Translations ---

const TRANSLATIONS: Record<string, string> = {
  // Muscle groups / Body parts
  'peito': 'chest',
  'costas': 'back',
  'ombros': 'shoulders',
  'ombro': 'shoulders',
  'trapézio': 'trapezius',
  'trapezio': 'trapezius',
  'bíceps': 'biceps',
  'biceps': 'biceps',
  'tríceps': 'triceps',
  'triceps': 'triceps',
  'antebraço': 'forearms',
  'antebramo': 'forearms',
  'abdômen': 'waist',
  'abdomen': 'waist',
  'abs': 'waist',
  'lombar': 'lower back',
  'quadríceps': 'quads',
  'quadriceps': 'quads',
  'posterior': 'hamstrings',
  'coxa': 'thighs',
  'glúteos': 'glutes',
  'gluteos': 'glutes',
  'adutores': 'adductors',
  'abdutores': 'abductors',
  'panturrilhas': 'calves',
  'panturrilha': 'calves',
  'pernas': 'legs',
  'perna': 'legs',

  // Equipments
  'barra': 'barbell',
  'halter': 'dumbbell',
  'halteres': 'dumbbell',
  'máquina': 'machine',
  'maquina': 'machine',
  'polia': 'cable',
  'cabo': 'cable',
  'banco': 'bench',
  'elástico': 'band',
  'elastico': 'band',
  'peso corporal': 'body weight',
  'articulado': 'machine',
  'smith': 'smith machine',
  'cross': 'cable',
  'cross over': 'cable',

  // Common movements / exercises
  'agachamento': 'squat',
  'rosca': 'curl',
  'supino': 'bench press',
  'remada': 'row',
  'desenvolvimento': 'shoulder press',
  'elevação': 'raise',
  'elevacao': 'raise',
  'coice': 'kickback',
  'stiff': 'romanian deadlift',
  'afundo': 'lunge',
  'passada': 'lunge',
  'flexão': 'push-up',
  'flexao': 'push-up',
  'barra fixa': 'pull-up',
  'puxada': 'pulldown',
  'crucifixo': 'fly',
  'tríceps testa': 'lying triceps extension',
  'encolhimento': 'shrug',
  'prancha': 'plank',
  'extensão': 'extension',
  'extensora': 'extension',
  'flexora': 'curl',
  'desenvolvimento militar': 'military press',
  'desenvolvimento de ombro': 'shoulder press',
  'abdução': 'abduction',
  'adução': 'adduction',
  'panturrilha em pé': 'standing calf raise',
  'panturrilha sentado': 'seated calf raise',
};

function translateExerciseName(name: string): string {
  let translated = name.toLowerCase();

  // Common exact full phrase mappings
  const fullPhrases: Record<string, string> = {
    'supino reto com barra': 'barbell bench press',
    'supino reto com halteres': 'dumbbell bench press',
    'supino reto': 'bench press',
    'supino inclinado com barra': 'barbell incline bench press',
    'supino inclinado com halteres': 'incline dumbbell bench press',
    'supino inclinado': 'incline bench press',
    'supino declinado com barra': 'barbell decline bench press',
    'supino declinado com halteres': 'decline dumbbell bench press',
    'rosca direta com barra': 'barbell curl',
    'rosca direta': 'barbell curl',
    'rosca martelo': 'hammer curl',
    'rosca alternada': 'dumbbell alternate bicep curl',
    'desenvolvimento com halteres': 'dumbbell shoulder press',
    'desenvolvimento de ombros com halteres': 'dumbbell shoulder press',
    'agachamento livre': 'barbell squat',
    'agachamento com barra': 'barbell squat',
    'agachamento': 'squat',
    'levantamento terra': 'deadlift',
    'remada curvada': 'barbell row',
    'remada baixa': 'cable row',
    'remada unilateral': 'dumbbell row',
    'elevação lateral': 'dumbbell lateral raise',
    'elevacao lateral': 'dumbbell lateral raise',
    'elevação frontal': 'dumbbell front raise',
    'elevacao frontal': 'dumbbell front raise',
    'tríceps na polia': 'cable triceps pushdown',
    'triceps na polia': 'cable triceps pushdown',
    'tríceps testa': 'lying triceps extension',
    'tríceps coice': 'dumbbell kickback',
    'puxada frente': 'cable pulldown',
    'puxada alta': 'cable pulldown',
    'crucifixo reto': 'dumbbell fly',
    'crucifixo inclinado': 'incline dumbbell fly',
    'stiff': 'romanian deadlift',
    'afundo': 'dumbbell lunge',
    'passada': 'dumbbell lunge',
    'leg press': 'leg press',
    'cadeira extensora': 'leg extension',
    'mesa flexora': 'lying leg curl',
    'cadeira flexora': 'seated leg curl',
    'panturrilha em pé': 'standing calf raise',
    'panturrilha sentado': 'seated calf raise',
    'flexão tradicional': 'push-up',
    'flexao tradicional': 'push-up',
    'flexão inclinada': 'incline push-up',
    'flexao inclinada': 'incline push-up',
    'flexão declinada': 'decline push-up',
    'flexao declinada': 'decline push-up',
    'barra fixa': 'pull-up',
    'barra fixa assistida': 'assisted pull-up',
    'peck deck': 'lever seated fly',
    'pec deck': 'lever seated fly',
    'paralelas': 'chest dip',
    'terra romeno': 'barbell romanian deadlift',
    'ponte de gluteo': 'barbell glute bridge',
    'ponte de glúteo': 'barbell glute bridge',
    'cadeira adutora': 'lever seated hip adduction',
    'cadeira abdutora': 'lever seated hip abduction',
    'caminhada (esteira)': 'walking on incline treadmill',
    'caminhada inclinada': 'walking on incline treadmill',
    'corrida leve (esteira)': 'run (equipment)',
    'corrida moderada (esteira)': 'run (equipment)',
    'farmer walk': 'farmers walk',
    'coice maquina': 'lever hip extension v. 2',
    'coice máquina': 'lever hip extension v. 2',
    'gluteo maquina': 'lever hip extension v. 2',
    'glúteo máquina': 'lever hip extension v. 2',
    'abdução máquina': 'lever seated hip abduction',
    'abdução maquina': 'lever seated hip abduction',
  };

  for (const [pt, en] of Object.entries(fullPhrases)) {
    if (translated.includes(pt)) {
      return en;
    }
  }

  // Tokenization word-by-word
  const words = translated
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '') // Keep hyphens for terms like push-up or pull-up
    .split(/\s+/);

  const translatedWords = words.map(word => TRANSLATIONS[word] || word);
  return translatedWords.join(' ');
}

let exerciseDbCache: any[] = [];
let lastCacheFetch = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function getExerciseDbData(): Promise<any[]> {
  const now = Date.now();
  if (exerciseDbCache.length > 0 && (now - lastCacheFetch) < CACHE_DURATION) {
    return exerciseDbCache;
  }

  // 1. Try reading the local downloaded file cache first (extremely fast and offline!)
  const EXERCISE_DB_CACHE_PATH = path.join(process.cwd(), 'data', 'exercisedb_cache.json');
  try {
    if (fs.existsSync(EXERCISE_DB_CACHE_PATH)) {
      const cacheRaw = fs.readFileSync(EXERCISE_DB_CACHE_PATH, 'utf8');
      const cacheParsed = JSON.parse(cacheRaw);
      if (Array.isArray(cacheParsed) && cacheParsed.length > 0) {
        exerciseDbCache = cacheParsed;
        lastCacheFetch = now;
        console.log(`Carregados ${exerciseDbCache.length} exercícios com sucesso do arquivo de cache local.`);
        return exerciseDbCache;
      }
    }
  } catch (err: any) {
    console.error('Falha ao ler cache local do ExerciseDB:', err.message);
  }

  const apiKey = process.env.EXERCISE_DB_API_KEY;
  if (apiKey && apiKey !== 'MY_EXERCISE_DB_API_KEY' && apiKey.trim() !== '') {
    try {
      console.log('Buscando exercícios da ExerciseDB API oficial...');
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises?limit=1500', {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          exerciseDbCache = data;
          lastCacheFetch = now;
          console.log(`Carregados ${data.length} exercícios com sucesso da API oficial.`);
          return exerciseDbCache;
        }
      } else {
        console.warn(`A API oficial retornou status ${response.status}. Tentando espelhos públicos...`);
      }
    } catch (err: any) {
      console.error('Erro ao conectar na API oficial do ExerciseDB:', err.message);
    }
  }

  // Try the free ExerciseDB V1 API
  try {
    console.log('Tentando buscar da ExerciseDB V1 API gratuita (https://oss.exercisedb.dev)...');
    const response = await fetch('https://oss.exercisedb.dev/api/v1/exercises');
    if (response.ok) {
      const json = await response.json();
      // Handle both raw array and { success: true, data: [...] } or { data: [...] }
      let data = Array.isArray(json) ? json : (json && typeof json === 'object' && json.data && Array.isArray(json.data) ? json.data : null);
      if (data && data.length > 0) {
        exerciseDbCache = data;
        lastCacheFetch = now;
        console.log(`Sucesso: carregados ${data.length} exercícios da API V1 gratuita.`);
        return exerciseDbCache;
      }
    } else {
      console.warn(`A API V1 gratuita retornou status ${response.status}. Tentando espelhos públicos...`);
    }
  } catch (err: any) {
    console.error('Falha ao carregar do ExerciseDB V1 gratuito:', err.message);
  }

  // Fallback to Public GitHub Mirrors
  const publicMirrors = [
    'https://raw.githubusercontent.com/yurace/ExerciseDB/master/exercises.json',
    'https://raw.githubusercontent.com/yurace/ExerciseDB/main/exercises.json'
  ];

  for (const mirror of publicMirrors) {
    try {
      console.log(`Tentando baixar base de dados do ExerciseDB via espelho público: ${mirror}`);
      const response = await fetch(mirror);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          exerciseDbCache = data;
          lastCacheFetch = now;
          console.log(`Sucesso: carregados ${data.length} exercícios do espelho público.`);
          return exerciseDbCache;
        }
      }
    } catch (err: any) {
      console.error(`Falha ao carregar do espelho ${mirror}:`, err.message);
    }
  }

  console.warn('Não foi possível obter dados do ExerciseDB. Retornando cache vazio.');
  return [];
}

function calculateMatchScore(exerciseName: string, translatedName: string, dbExercise: any, pMuscle: string, pEquipments: string[]): number {
  let score = 0;

  const dbName = (dbExercise.name || '').toLowerCase();

  // Handle both string and array for target
  const dbTargets: string[] = [];
  if (typeof dbExercise.target === 'string' && dbExercise.target) {
    dbTargets.push(dbExercise.target.toLowerCase());
  }
  if (Array.isArray(dbExercise.targetMuscles)) {
    dbExercise.targetMuscles.forEach((t: any) => {
      if (typeof t === 'string') dbTargets.push(t.toLowerCase());
    });
  }

  // Handle both string and array for equipment
  const dbEquipments: string[] = [];
  if (typeof dbExercise.equipment === 'string' && dbExercise.equipment) {
    dbEquipments.push(dbExercise.equipment.toLowerCase());
  }
  if (Array.isArray(dbExercise.equipments)) {
    dbExercise.equipments.forEach((e: any) => {
      if (typeof e === 'string') dbEquipments.push(e.toLowerCase());
    });
  }

  // Handle both string and array for body part
  const dbBodyParts: string[] = [];
  if (typeof dbExercise.bodyPart === 'string' && dbExercise.bodyPart) {
    dbBodyParts.push(dbExercise.bodyPart.toLowerCase());
  }
  if (Array.isArray(dbExercise.bodyParts)) {
    dbExercise.bodyParts.forEach((bp: any) => {
      if (typeof bp === 'string') dbBodyParts.push(bp.toLowerCase());
    });
  }

  // --- Strict Name Matching Requirement ---
  let nameScore = 0;

  // Exact or substring match
  if (dbName === translatedName) {
    nameScore += 100;
  } else if (dbName.includes(translatedName) || translatedName.includes(dbName)) {
    nameScore += 50;
  }

  // Token overlap on name
  const translatedTokens = translatedName.split(/[\s-]+/);
  const dbTokens = dbName.split(/[\s-]+/);

  // Exclude common stop words
  const stopWords = new Set(['with', 'on', 'in', 'of', 'for', 'by', 'the', 'and', 'style', 'to', 'at']);

  let tokenMatches = 0;
  for (const token of translatedTokens) {
    if (token.length > 2 && !stopWords.has(token) && dbTokens.includes(token)) {
      tokenMatches++;
    }
  }

  nameScore += tokenMatches * 20;

  // CRITICAL: If there is zero name match (no exact, substring, or token overlap),
  // we do not allow it to match under any circumstances.
  if (nameScore === 0) {
    return 0;
  }

  score += nameScore;

  // 2. Muscle recruitment mapping
  const muscleMap: Record<string, { bodyPart: string; target: string }> = {
    'peito': { bodyPart: 'chest', target: 'pectorals' },
    'costas': { bodyPart: 'back', target: 'lats' },
    'ombros': { bodyPart: 'shoulders', target: 'delts' },
    'trapézio': { bodyPart: 'back', target: 'traps' },
    'trapezio': { bodyPart: 'back', target: 'traps' },
    'bíceps': { bodyPart: 'upper arms', target: 'biceps' },
    'biceps': { bodyPart: 'upper arms', target: 'biceps' },
    'tríceps': { bodyPart: 'upper arms', target: 'triceps' },
    'triceps': { bodyPart: 'upper arms', target: 'triceps' },
    'antebraço': { bodyPart: 'lower arms', target: 'forearms' },
    'antebramo': { bodyPart: 'lower arms', target: 'forearms' },
    'abdômen': { bodyPart: 'waist', target: 'abs' },
    'abdomen': { bodyPart: 'waist', target: 'abs' },
    'lombar': { bodyPart: 'back', target: 'spine' },
    'quadríceps': { bodyPart: 'upper legs', target: 'quads' },
    'quadriceps': { bodyPart: 'upper legs', target: 'quads' },
    'posterior': { bodyPart: 'upper legs', target: 'hamstrings' },
    'glúteos': { bodyPart: 'upper legs', target: 'glutes' },
    'gluteos': { bodyPart: 'upper legs', target: 'glutes' },
    'adutores': { bodyPart: 'upper legs', target: 'adductors' },
    'abdutores': { bodyPart: 'upper legs', target: 'abductors' },
    'panturrilhas': { bodyPart: 'lower legs', target: 'calves' },
    'panturrilha': { bodyPart: 'lower legs', target: 'calves' },
  };

  const mapped = muscleMap[pMuscle.toLowerCase()];
  if (mapped) {
    if (dbBodyParts.includes(mapped.bodyPart)) score += 10;
    if (dbTargets.includes(mapped.target)) score += 15;
  }

  // 3. Equipment mapping
  const equipmentMap: Record<string, string> = {
    'barra': 'barbell',
    'halteres': 'dumbbell',
    'halter': 'dumbbell',
    'polia': 'cable',
    'máquina': 'machine',
    'maquina': 'machine',
    'cabo': 'cable',
    'elástico': 'band',
    'elastico': 'band',
    'peso corporal': 'body weight',
    'nenhum': 'body weight',
    'kettlebell': 'kettlebell',
    'banco': 'bench',
    'smith': 'smith machine',
  };

  for (const eq of pEquipments) {
    const eqMapped = equipmentMap[eq.toLowerCase()];
    if (eqMapped && dbEquipments.includes(eqMapped)) {
      score += 20;
    }
  }

  return score;
}

function syncSingleExerciseWithDb(exercise: any, dbExercises: any[]): any {
  if (!dbExercises || dbExercises.length === 0) {
    return exercise;
  }

  const translatedName = translateExerciseName(exercise.nome);
  let bestMatch: any = null;
  let bestScore = -1;

  for (const dbEx of dbExercises) {
    const score = calculateMatchScore(exercise.nome, translatedName, dbEx, exercise.grupoMuscular, exercise.equipamentos || []);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = dbEx;
    }
  }

  // Minimum score threshold of 30 to consider it a reliable match
  if (bestMatch && bestScore >= 30) {
    let rawGif = bestMatch.gifUrl || '';
    if (rawGif.startsWith('http://')) {
      rawGif = rawGif.replace('http://', 'https://');
    }

    // Extract values with schema compatibility:
    const matchedId = bestMatch.exerciseId || bestMatch.id;
    const matchedTarget = Array.isArray(bestMatch.targetMuscles) ? bestMatch.targetMuscles[0] : bestMatch.target;
    const matchedEquipment = Array.isArray(bestMatch.equipments) ? bestMatch.equipments[0] : bestMatch.equipment;

    return {
      ...exercise,
      exerciseDbId: matchedId,
      gifUrl: rawGif,
      exerciseDbName: bestMatch.name,
      exerciseDbEquipment: matchedEquipment,
      exerciseDbTarget: matchedTarget,
      exerciseDbSecondaryMuscles: bestMatch.secondaryMuscles || [],
      lastSync: new Date().toISOString()
    };
  }

  // Safely clear out old mismatched synchronization fields to prevent displaying incorrect animations!
  const copy = { ...exercise };
  delete copy.exerciseDbId;
  delete copy.gifUrl;
  delete copy.exerciseDbName;
  delete copy.exerciseDbEquipment;
  delete copy.exerciseDbTarget;
  delete copy.exerciseDbSecondaryMuscles;
  delete copy.lastSync;
  return copy;
}

// Progress state tracking for batch sync
let syncProgress = {
  isSyncing: false,
  total: 0,
  current: 0,
  completed: 0,
  failed: 0,
  startTime: null as string | null,
};

// API Routes
app.get('/api/exercises', (req, res) => {
  const exercises = readExercises();
  res.json(exercises);
});

app.get('/api/sync/status', (req, res) => {
  res.json(syncProgress);
});

app.get('/api/proxy-gif', async (req, res) => {
  const gifUrl = req.query.url as string;
  if (!gifUrl) {
    return res.status(400).send('URL do GIF não informada.');
  }

  try {
    const urlObj = new URL(gifUrl);
    
    // Allow typical domains for ExerciseDB images and mirrors
    const allowedHosts = [
      'cloudfront.net',
      'api.exercisedb.io',
      'v2.api-olympians.com',
      'raw.githubusercontent.com',
      'exercisedb.p.rapidapi.com',
      'github.com',
      'exercisedb.dev'
    ];

    const host = urlObj.hostname;
    const isAllowed = allowedHosts.some(allowed => host.endsWith(allowed));

    if (!isAllowed) {
      return res.status(403).send('Domínio não autorizado.');
    }

    const response = await fetch(gifUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Erro ao buscar o GIF: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/gif';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);
  } catch (err: any) {
    console.error('Erro ao fazer proxy do GIF:', err.message);
    res.status(500).send(`Erro ao processar o GIF: ${err.message}`);
  }
});

app.post('/api/sync/all', async (req, res) => {
  if (syncProgress.isSyncing) {
    return res.status(400).json({ error: 'Sincronização já está em andamento.' });
  }

  const exercises = readExercises();
  if (exercises.length === 0) {
    return res.json({ message: 'Nenhum exercício para sincronizar.' });
  }

  // Load ExerciseDB data
  const dbData = await getExerciseDbData();
  if (dbData.length === 0) {
    return res.status(503).json({ 
      error: 'Não foi possível carregar a base de dados do ExerciseDB. Verifique a conexão com a internet ou se a chave API é válida.' 
    });
  }

  // Reset progress
  syncProgress = {
    isSyncing: true,
    total: exercises.length,
    current: 0,
    completed: 0,
    failed: 0,
    startTime: new Date().toISOString(),
  };

  // Start background process
  (async () => {
    try {
      const updatedExercises = [];
      for (const ex of exercises) {
        // Increment progress index
        syncProgress.current++;

        try {
          const synced = syncSingleExerciseWithDb(ex, dbData);
          if (synced.gifUrl && synced.gifUrl !== ex.gifUrl) {
            syncProgress.completed++;
          } else {
            syncProgress.failed++;
          }
          updatedExercises.push(synced);
        } catch (err) {
          console.error(`Erro ao sincronizar exercício ${ex.nome}:`, err);
          syncProgress.failed++;
          updatedExercises.push(ex);
        }

        // yield to event loop periodically
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      writeExercises(updatedExercises);
      // Salvar os exercícios atualizados no Firestore também
      for (const ex of updatedExercises) {
        await saveExerciseToFirestore(ex);
      }
    } catch (err) {
      console.error('Erro na sincronização em lote:', err);
    } finally {
      syncProgress.isSyncing = false;
    }
  })();

  res.json({ message: 'Sincronização iniciada em plano de fundo.', total: exercises.length });
});

app.get('/api/exercises/:slug', (req, res) => {
  const exercises = readExercises();
  const exercise = exercises.find(ex => ex.slug === req.params.slug);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercício não encontrado' });
  }
  res.json(exercise);
});

app.post('/api/exercises', async (req, res) => {
  const exercises = readExercises();
  const newEx = req.body;

  if (!newEx.nome) {
    return res.status(404).json({ error: 'O nome do exercício é obrigatório.' });
  }

  // Set default values and generate id/slug/timestamps
  const slug = slugify(newEx.nome);
  const existingWithSlug = exercises.find(ex => ex.slug === slug);
  const finalSlug = existingWithSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

  let exerciseToSave = {
    ...newEx,
    id: newEx.id || `ex_${Date.now()}`,
    slug: finalSlug,
    categoria: newEx.categoria || 'Musculação',
    grupoMuscular: newEx.grupoMuscular || 'Pernas',
    nivel: newEx.nivel || 'Iniciante',
    equipamentos: Array.isArray(newEx.equipamentos) ? newEx.equipamentos : [],
    musculos: Array.isArray(newEx.musculos) ? newEx.musculos : [],
    descricao: newEx.descricao || '',
    objetivo: newEx.objetivo || '',
    execucao: Array.isArray(newEx.execucao) ? newEx.execucao : [],
    respiracao: newEx.respiracao || '',
    dicas: Array.isArray(newEx.dicas) ? newEx.dicas : [],
    erros: Array.isArray(newEx.erros) ? newEx.erros : [],
    beneficios: newEx.beneficios || '',
    contraindicacoes: newEx.contraindicacoes || '',
    variacoes: Array.isArray(newEx.variacoes) ? newEx.variacoes : [],
    gif: newEx.gif || '',
    video: newEx.video || '',
    tags: Array.isArray(newEx.tags) ? newEx.tags : [slug],
    ativo: typeof newEx.ativo === 'boolean' ? newEx.ativo : true,
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  // Auto-sync with ExerciseDB
  try {
    const dbData = await getExerciseDbData();
    if (dbData && dbData.length > 0) {
      exerciseToSave = syncSingleExerciseWithDb(exerciseToSave, dbData);
    }
  } catch (err) {
    console.error('Erro ao sincronizar exercício recém-criado:', err);
  }

  exercises.push(exerciseToSave);
  if (writeExercises(exercises)) {
    saveExerciseToFirestore(exerciseToSave);
    res.status(201).json(exerciseToSave);
  } else {
    res.status(500).json({ error: 'Não foi possível salvar o exercício no banco de dados.' });
  }
});

app.put('/api/exercises/:id', async (req, res) => {
  const exercises = readExercises();
  const index = exercises.findIndex(ex => ex.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Exercício não encontrado.' });
  }

  const updatedEx = req.body;
  const currentEx = exercises[index];

  // Keep slug based on name if name changed, otherwise preserve it
  let finalSlug = currentEx.slug;
  if (updatedEx.nome && updatedEx.nome !== currentEx.nome) {
    const slug = slugify(updatedEx.nome);
    const existingWithSlug = exercises.find(ex => ex.slug === slug && ex.id !== req.params.id);
    finalSlug = existingWithSlug ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
  }

  let exerciseToSave = {
    ...currentEx,
    ...updatedEx,
    slug: finalSlug,
    atualizadoEm: new Date().toISOString()
  };

  // Auto-sync with ExerciseDB on update
  try {
    const dbData = await getExerciseDbData();
    if (dbData && dbData.length > 0) {
      exerciseToSave = syncSingleExerciseWithDb(exerciseToSave, dbData);
    }
  } catch (err) {
    console.error('Erro ao sincronizar exercício atualizado:', err);
  }

  exercises[index] = exerciseToSave;

  if (writeExercises(exercises)) {
    saveExerciseToFirestore(exerciseToSave);
    res.json(exercises[index]);
  } else {
    res.status(500).json({ error: 'Não foi possível atualizar o exercício no banco de dados.' });
  }
});

app.delete('/api/exercises/:id', (req, res) => {
  const exercises = readExercises();
  const filtered = exercises.filter(ex => ex.id !== req.params.id);

  if (filtered.length === exercises.length) {
    return res.status(404).json({ error: 'Exercício não encontrado.' });
  }

  if (writeExercises(filtered)) {
    deleteExerciseFromFirestore(req.params.id);
    res.json({ success: true, message: 'Exercício excluído com sucesso.' });
  } else {
    res.status(500).json({ error: 'Não foi possível salvar a alteração no banco de dados.' });
  }
});

// AI generation endpoint
app.post('/api/exercises/generate', async (req, res) => {
  const { nome, categoria, grupoMuscular } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'O nome do exercício é necessário para a geração por IA.' });
  }

  try {
    const ai = getAiClient();
    const systemInstruction = `Você é Bia Tisatto, uma personal trainer experiente, pós-graduada em Cinesiologia e Biomecânica da Musculação. 
Sua voz é acolhedora, incentivadora e baseada em evidência científica clara, sem complicação técnica exagerada. 
Você SEMPRE preza pela execução correta perfeita de cada movimento e NUNCA incentiva o uso de cargas absurdas ou ego-lifting.
Sua missão é gerar uma análise detalhada, biomecanicamente correta e extremamente didática para o exercício solicitado em formato JSON estruturado. 
Todo o conteúdo DEVE ser escrito em Português do Brasil.`;

    const prompt = `Gere uma análise de treino completa para o exercício físico: "${nome}".
Categoria aproximada: "${categoria || 'Musculação'}".
Grupo muscular alvo principal: "${grupoMuscular || 'Geral'}".

Foque em fornecer dados biomecanicamente corretos, com passo a passo didático, erros comuns, dicas de respiração e variações anatômicas.`;

    const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
    let response = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      let attempt = 0;
      const maxAttempts = 3;
      while (attempt < maxAttempts) {
        try {
          console.log(`Tentando gerar exercício com o modelo: ${modelName} (tentativa ${attempt + 1}/${maxAttempts})`);
          response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING, description: "Nome correto em português" },
                  categoria: { type: Type.STRING, description: "Categoria do exercício (Musculação, Alongamentos, Cardio, Funcional, Mobilidade, Reabilitação)" },
                  grupoMuscular: { type: Type.STRING, description: "Grupo muscular principal trabalhado (Peito, Costas, Ombros, Trapézio, Bíceps, Tríceps, Antebraço, Abdômen, Lombar, Quadríceps, Posterior, Glúteos, Adutores, Abdutores, Panturrilhas)" },
                  subGrupo: { type: Type.STRING, description: "Subgrupo muscular ou articulação principal, ex: Coxas e Glúteos, Cadeia Posterior, Deltoides" },
                  nivel: { type: Type.STRING, description: "Nível sugerido: Iniciante, Intermediário ou Avançado" },
                  equipamentos: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "Equipamentos necessários, ex: ['Halteres', 'Banco Reto']" 
                  },
                  musculos: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Músculos recrutados principais e secundários, ex: ['Peitoral Maior', 'Deltoide Anterior', 'Tríceps']" 
                  },
                  descricao: { type: Type.STRING, description: "Uma breve introdução sobre o movimento, sua origem ou utilidade de maneira elegante e incentivadora" },
                  objetivo: { type: Type.STRING, description: "O objetivo funcional e estético do exercício" },
                  execucao: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Instruções passo a passo detalhadas e numeradas (gerar de 4 a 7 passos bem explicados)" 
                  },
                  respiracao: { type: Type.STRING, description: "Instruções precisas de respiração (fase concêntrica e excêntrica)" },
                  dicas: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Dicas de execução, postura e foco mental (gerar de 3 a 6 dicas)" 
                  },
                  erros: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Erros comuns de execução para o aluno evitar (gerar de 3 a 6 erros comuns)" 
                  },
                  beneficios: { type: Type.STRING, description: "Os benefícios funcionais e de saúde de praticar este movimento" },
                  contraindicacoes: { type: Type.STRING, description: "Contraindicações ou quem deve evitar ou adaptar este exercício" },
                  variacoes: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Variações comuns de execução ou equipamentos diferentes para o mesmo estímulo" 
                  },
                  tags: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Tags para busca inteligente em minúsculas" 
                  }
                },
                required: [
                  "nome", "categoria", "grupoMuscular", "subGrupo", "nivel", 
                  "equipamentos", "musculos", "descricao", "objetivo", 
                  "execucao", "respiracao", "dicas", "erros", "beneficios", "tags"
                ]
              }
            }
          });
          if (response) {
            console.log(`Sucesso na geração com o modelo: ${modelName}`);
            break;
          }
        } catch (err: any) {
          attempt++;
          console.warn(`Erro com o modelo ${modelName} na tentativa ${attempt}/${maxAttempts}:`, err.message || err);
          lastError = err;
          if (attempt < maxAttempts) {
            const delay = attempt * 1200; // 1200ms, 2400ms...
            console.log(`Aguardando ${delay}ms antes de tentar novamente o modelo ${modelName}...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      if (response) {
        break;
      }
    }

    if (!response) {
      throw lastError || new Error("Nenhum dos modelos de IA disponíveis conseguiu gerar a resposta.");
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Resposta do modelo de IA vazia.");
    }

    const generatedExercise = JSON.parse(resultText);
    res.json(generatedExercise);
  } catch (error: any) {
    console.error('Erro na geração com Gemini:', error);
    res.status(500).json({ 
      error: 'Ocorreu um erro ao gerar o exercício utilizando inteligência artificial.',
      details: error.message 
    });
  }
});

// Vite middleware setup or production static files serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express] Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`);
  });
}

if (!process.env.VERCEL) {
  setupServer();
}

export default app;
