import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface HunterStats {
    STR: number; // Fuerza (Trabajo / Gimnasio)
    INT: number; // Inteligencia (Lectura / Educación)
    AGI: number; // Agilidad (Ocio / Hábitos)
    VIT: number; // Vitalidad (Dieta / Salud)
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'BOSS';
    status: 'OPEN' | 'COMPLETED';
    category: 'Trabajo' | 'Lectura' | 'Dieta' | 'Gimnasio' | 'General';
    tags: string[];
    createdAt: string;
    completedAt?: string;
}

export interface CustomReward {
    id: string;
    title: string;
    cost: number;
    isSystem?: boolean;
}

export interface PurchasedItem {
    id: string;
    title: string;
    cost: number;
    purchasedAt: string;
}

export interface GameItem {
    id: string;
    title: string;
    platform: string;
    genre: string;
    status: 'PLAYING' | 'PENDING' | 'COMPLETED';
    score: number;
}

export interface PomodoroSession {
    completedAt: string;
    duration: number;
    xpEarned: number;
    gemsEarned: number;
}

export interface RewardDto {
    xpEarned: number;
    gemsEarned: number;
    newLevel: number;
    didLevelUp: boolean;
    statIncreased?: string;
    pomodoro?: boolean;
    newBadges?: any[];
    levelUpGemBonus?: number;
    boostConsumed?: boolean;
}

export interface GameState {
    userId: string;
    username: string;
    isAuthenticated: boolean;
    accessToken: string | null;
    level: number;
    currentXp: number;
    totalXp: number;
    xpToNextLevel: number;
    gemBalance: number;
    dailyStreak: number;
    longestDailyStreak: number;
    flowStreak: number;
    pomodoroFlowStreak: number;
    xpBoostActive: boolean;
    currentTheme: string;
    stats: HunterStats;
    tasks: Task[];
    activeTask: Task | null;
    errorMessage: string | null;
    sessionActive: boolean;
    sessionPaused: boolean;
    currentMultiplier: number;
    worstPauseTier: string | null;
    pomodoroHistory: PomodoroSession[];
    pendingReward: RewardDto | null;
    isLevelingUp: boolean;
    customRewards: CustomReward[];
    purchasedItems: PurchasedItem[];
    games: GameItem[];
    themesInventory: string[];
    
    // Hidden quest class change fields
    gymConsecutiveDays: number;
    classChangedToMonarcaDeLaNoche: boolean;

    // Actions
    setAuth: (authData: any) => void;
    clearAuth: () => void;
    initializePlayer: (userData: any) => void;
    incrementStat: (category: string, value?: number) => void;
    completeQuestLocal: (taskId: string) => void;
    applyReward: (rewardDto: any) => void;
    setTasks: (tasks: Task[]) => void;
    addTask: (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => Task;
    removeTask: (taskId: string) => void;
    updateTask: (updatedTask: Partial<Task> & { id: string }) => void;
    setActiveTask: (task: Task | null) => void;
    addCustomReward: (reward: Omit<CustomReward, 'id'>) => void;
    removeCustomReward: (id: string) => void;
    purchaseRewardLocal: (rewardId: string) => boolean;
    purchaseThemeLocal: (themeName: string, cost: number) => boolean;
    setCurrentTheme: (theme: string) => void;
    updateGemBalance: (newBalance: number) => void;
    setXpBoostActive: (active: boolean) => void;
    addGame: (game: Omit<GameItem, 'id'>) => void;
    updateGame: (id: string, updatedGame: Partial<GameItem>) => void;
    deleteGame: (id: string) => void;
    completePomodoroLocal: (timeMinutes: number) => void;
    setError: (msg: string | null) => void;
    clearError: () => void;
    setSessionActive: (active: boolean) => void;
    setSessionPaused: (paused: boolean) => void;
    setMultiplier: (multiplier: number) => void;
    clearPendingReward: () => void;
    getLevelName: () => string;
    triggerClassChange: () => void;
}

const useGameStore = create<GameState>()(devtools(persist(
    (set, get) => ({
        // --- Auth & Identity State ---
        userId: '1',
        username: 'Cazador Novato',
        isAuthenticated: false, // Default is logged out, wait for login
        accessToken: null,
        level: 1,
        currentXp: 0,
        totalXp: 0,
        xpToNextLevel: 500,
        gemBalance: 50,
        dailyStreak: 0,
        longestDailyStreak: 0,
        flowStreak: 0,
        pomodoroFlowStreak: 0,
        xpBoostActive: false,
        currentTheme: 'solo-leveling',

        // --- Hunter Stats ---
        stats: {
            STR: 10,
            INT: 10,
            AGI: 10,
            VIT: 10,
        },

        // --- Task / Quest State (Spanish default) ---
        tasks: [
            {
                id: '1',
                title: 'Entrenamiento Diario de Fuerza',
                description: 'Realiza 30 flexiones, 30 sentadillas y 30 abdominales.',
                priority: 'MEDIUM',
                status: 'OPEN',
                category: 'Gimnasio',
                tags: ['Gimnasio', 'Rutina'],
                createdAt: new Date().toISOString(),
            },
            {
                id: '2',
                title: 'Estudiar / Trabajar en el Proyecto Principal',
                description: 'Avanza en la codificación del Task Tracker y las integraciones con Firebase.',
                priority: 'HIGH',
                status: 'OPEN',
                category: 'Trabajo',
                tags: ['Trabajo', 'Desarrollo'],
                createdAt: new Date().toISOString(),
            },
            {
                id: '3',
                title: 'Leer 10 Páginas de un Libro',
                description: 'Lectura diaria para mejorar habilidades e incorporar nuevos conocimientos.',
                priority: 'LOW',
                status: 'OPEN',
                category: 'Lectura',
                tags: ['Lectura', 'Mental'],
                createdAt: new Date().toISOString(),
            }
        ],
        activeTask: null,
        errorMessage: null,

        // --- Session State (Pomodoro) ---
        sessionActive: false,
        sessionPaused: false,
        currentMultiplier: 1.0,
        worstPauseTier: null,
        pomodoroHistory: [],

        // --- Reward State ---
        pendingReward: null,
        isLevelingUp: false,

        // --- Real-Life Rewards Store (Spanish incentives) ---
        customRewards: [
            { id: 'r1', title: 'Comida Chatarra / Cheat Meal (Incentivo Especial)', cost: 100, isSystem: true },
            { id: 'r2', title: 'Ver 1 capítulo de Anime (One Piece / Bleach / Solo Leveling)', cost: 50, isSystem: true },
            { id: 'r3', title: '1 hora libre de videojuegos favoritos', cost: 100, isSystem: true },
            { id: 'r4', title: 'Comprar un antojo dulce / postre premium', cost: 75, isSystem: true },
            { id: 'r5', title: 'Día de descanso total (Sin entrenar ni trabajar)', cost: 200, isSystem: true },
        ],
        purchasedItems: [],

        // --- Game Tracker (Biblioteca de Videojuegos) ---
        games: [
            { id: 'g1', title: 'Elden Ring', platform: 'PC', genre: 'RPG', status: 'PLAYING', score: 10 },
            { id: 'g2', title: 'Hades II', platform: 'PC', genre: 'Roguelike', status: 'PLAYING', score: 9 }
        ],

        // --- Theme Store ---
        themesInventory: ['solo-leveling'],

        // --- Hidden Quest Class Change ---
        gymConsecutiveDays: 0,
        classChangedToMonarcaDeLaNoche: false,

        // --- Auth Actions ---
        setAuth: (authData) => {
            set({
                isAuthenticated: true,
                accessToken: authData.accessToken || 'mock-local-token',
                userId: authData.userId || '1',
                username: authData.username || 'Cazador',
            })
            if (authData.level) {
                set({
                    level: authData.level,
                    currentXp: authData.currentXp || 0,
                    totalXp: authData.totalXp || 0,
                    xpToNextLevel: authData.xpToNextLevel || 500,
                    gemBalance: authData.gemBalance || 50,
                    dailyStreak: authData.dailyStreak || 0,
                    longestDailyStreak: authData.longestDailyStreak || 0,
                    stats: authData.stats || { STR: 10, INT: 10, AGI: 10, VIT: 10 },
                    tasks: authData.tasks || get().tasks,
                    customRewards: authData.customRewards || get().customRewards,
                    purchasedItems: authData.purchasedItems || [],
                    games: authData.games || [],
                    themesInventory: authData.themesInventory || ['solo-leveling'],
                    gymConsecutiveDays: authData.gymConsecutiveDays || 0,
                    classChangedToMonarcaDeLaNoche: authData.classChangedToMonarcaDeLaNoche || false,
                })
            }
        },
        clearAuth: () => {
            set({
                isAuthenticated: false,
                accessToken: null,
                userId: '1',
                username: 'Cazador Novato',
                level: 1,
                currentXp: 0,
                totalXp: 0,
                xpToNextLevel: 500,
                gemBalance: 50,
                dailyStreak: 0,
                longestDailyStreak: 0,
                stats: { STR: 10, INT: 10, AGI: 10, VIT: 10 },
                tasks: [
                    {
                        id: '1',
                        title: 'Entrenamiento Diario de Fuerza',
                        description: 'Realiza 30 flexiones, 30 sentadillas y 30 abdominales.',
                        priority: 'MEDIUM',
                        status: 'OPEN',
                        category: 'Gimnasio',
                        tags: ['Gimnasio', 'Rutina'],
                        createdAt: new Date().toISOString(),
                    }
                ],
                customRewards: [
                    { id: 'r1', title: 'Comida Chatarra / Cheat Meal (Incentivo Especial)', cost: 100, isSystem: true },
                    { id: 'r2', title: 'Ver 1 capítulo de Anime (One Piece / Bleach / Solo Leveling)', cost: 50, isSystem: true },
                    { id: 'r3', title: '1 hora libre de videojuegos favoritos', cost: 100, isSystem: true },
                ],
                purchasedItems: [],
                games: [],
                themesInventory: ['solo-leveling'],
                gymConsecutiveDays: 0,
                classChangedToMonarcaDeLaNoche: false,
            })
        },
        initializePlayer: (userData) => {
            set(userData)
        },

        // --- Stats & Level Actions ---
        incrementStat: (category, value = 1) => {
            set((state) => {
                const newStats = { ...state.stats }
                if (category === 'Trabajo' || category === 'Gimnasio') newStats.STR += value
                else if (category === 'Lectura') newStats.INT += value
                else if (category === 'Dieta') newStats.VIT += value
                else newStats.AGI += value
                return { stats: newStats }
            })
        },

        // --- Game Core Actions (Local Game Engine) ---
        completeQuestLocal: (taskId) => {
            const state = get()
            const taskIndex = state.tasks.findIndex(t => t.id === taskId)
            if (taskIndex === -1) return

            const task = state.tasks[taskIndex]
            if (task.status === 'COMPLETED') return

            let baseXp = 10
            let baseGems = 5

            if (task.priority === 'MEDIUM') {
                baseXp = 25
                baseGems = 12
            } else if (task.priority === 'HIGH') {
                baseXp = 50
                baseGems = 25
            } else if (task.priority === 'BOSS') {
                baseXp = 100
                baseGems = 50
            }

            let multiplier = 1.0
            if (state.xpBoostActive) multiplier += 0.5
            if (state.dailyStreak >= 7) multiplier += 0.2

            const xpEarned = Math.round(baseXp * multiplier)
            const gemsEarned = baseGems

            let newXp = state.currentXp + xpEarned
            let newLevel = state.level
            let neededXp = state.xpToNextLevel
            let didLevelUp = false

            while (newXp >= neededXp) {
                newXp -= neededXp
                newLevel += 1
                neededXp = newLevel * 500
                didLevelUp = true
            }

            const updatedTasks = state.tasks.map(t => 
                t.id === taskId ? { ...t, status: 'COMPLETED' as const, completedAt: new Date().toISOString() } : t
            )

            // Dynamic gym streak tracking
            let newGymConsecutiveDays = state.gymConsecutiveDays;
            if (task.category === 'Gimnasio') {
                newGymConsecutiveDays += 1;
            }

            // Hidden Quest: Clase Cambio "Monarca de la Noche"
            // Valid only after Level 30 (S-Rank) and Gym Consecutive Days >= 15
            let classChanged = state.classChangedToMonarcaDeLaNoche;
            let classChangeNotification = false;
            if (!classChanged && newLevel >= 30 && newGymConsecutiveDays >= 15) {
                classChanged = true;
                classChangeNotification = true;
            }

            const statToInc = task.category || 'General'
            const newStats = { ...state.stats }
            const incrementAmount = task.priority === 'HIGH' ? 3 : task.priority === 'MEDIUM' ? 2 : 1
            
            if (statToInc === 'Trabajo' || statToInc === 'Gimnasio') newStats.STR += incrementAmount
            else if (statToInc === 'Lectura') newStats.INT += incrementAmount
            else if (statToInc === 'Dieta') newStats.VIT += incrementAmount
            else newStats.AGI += incrementAmount

            set({
                tasks: updatedTasks,
                currentXp: newXp,
                totalXp: state.totalXp + xpEarned,
                level: newLevel,
                xpToNextLevel: neededXp,
                gemBalance: state.gemBalance + gemsEarned,
                stats: newStats,
                gymConsecutiveDays: newGymConsecutiveDays,
                classChangedToMonarcaDeLaNoche: classChanged,
                isLevelingUp: didLevelUp,
                pendingReward: {
                    xpEarned,
                    gemsEarned,
                    newLevel,
                    didLevelUp,
                    statIncreased: statToInc,
                    boostConsumed: state.xpBoostActive,
                    newBadges: classChangeNotification ? [{ name: 'Monarca de la Noche 👤', icon: '👤', description: '¡Has despertado como Monarca de la Noche tras 15 días consecutivos de entrenamiento!' }] : undefined
                }
            })

            // Trigger confetti dynamically if leveled up
            if (didLevelUp) {
                import('canvas-confetti').then((confetti) => {
                    confetti.default({
                        particleCount: 150,
                        spread: 80,
                        origin: { y: 0.6 }
                    })
                }).catch(() => {})
            }
        },

        applyReward: (rewardDto) => {
            set((state) => ({
                currentXp:         rewardDto.currentXp ?? state.currentXp,
                totalXp:           rewardDto.totalXp ?? state.totalXp,
                xpToNextLevel:     rewardDto.xpToNextLevel ?? state.xpToNextLevel,
                level:             rewardDto.newLevel ?? state.level,
                gemBalance:        state.gemBalance +
                                   (rewardDto.gemsEarned || 0) +
                                   (rewardDto.levelUpGemBonus || 0),
                dailyStreak:       rewardDto.dailyStreak ?? state.dailyStreak,
                longestDailyStreak: rewardDto.longestDailyStreak ?? state.longestDailyStreak,
                flowStreak:        rewardDto.flowStreak ?? state.flowStreak,
                pomodoroFlowStreak: rewardDto.flowStreak ?? state.pomodoroFlowStreak,
                xpBoostActive:     rewardDto.boostConsumed
                                   ? false : state.xpBoostActive,
                pendingReward:     rewardDto,
                isLevelingUp:      rewardDto.didLevelUp || false,
            }))
        },

        // --- Tasks Actions ---
        setTasks: (tasks) => set({ tasks }),
        addTask: (taskData) => {
            const newTask: Task = {
                id: Date.now().toString(),
                status: 'OPEN' as const,
                createdAt: new Date().toISOString(),
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                category: taskData.category as any,
                tags: taskData.tags || [taskData.category]
            }
            set((state) => ({ tasks: [...state.tasks, newTask] }))
            return newTask
        },
        removeTask: (taskId) => set((state) => ({
            tasks: state.tasks.filter(t => t.id !== taskId)
        })),
        updateTask: (updatedTask) => set((state) => ({
            tasks: state.tasks.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } as Task : t)
        })),
        setActiveTask: (task) => set({ activeTask: task }),

        // --- Store / Rewards Actions ---
        addCustomReward: (reward) => set((state) => ({
            customRewards: [...state.customRewards, { id: Date.now().toString(), ...reward }]
        })),
        removeCustomReward: (id) => set((state) => ({
            customRewards: state.customRewards.filter(r => r.id !== id)
        })),
        purchaseRewardLocal: (rewardId) => {
            const state = get()
            const reward = state.customRewards.find(r => r.id === rewardId)
            if (!reward || state.gemBalance < reward.cost) return false

            set({
                gemBalance: state.gemBalance - reward.cost,
                purchasedItems: [...state.purchasedItems, { 
                    id: reward.id, 
                    title: reward.title, 
                    cost: reward.cost, 
                    purchasedAt: new Date().toISOString() 
                }]
            })
            return true
        },

        // --- Themes Shop Actions ---
        purchaseThemeLocal: (themeName, cost) => {
            const state = get()
            if (state.themesInventory.includes(themeName)) return true
            if (state.gemBalance < cost) return false

            set({
                gemBalance: state.gemBalance - cost,
                themesInventory: [...state.themesInventory, themeName]
            })
            return true
        },

        setCurrentTheme: (theme) => {
            document.documentElement.setAttribute('data-theme', theme)
            set({ currentTheme: theme })
        },

        updateGemBalance: (newBalance) => set({ gemBalance: newBalance }),
        setXpBoostActive: (active) => set({ xpBoostActive: active }),

        // --- Game Tracker (Videogames) Actions ---
        addGame: (game) => set((state) => ({
            games: [...state.games, { id: Date.now().toString(), ...game }]
        })),
        updateGame: (id, updatedGame) => set((state) => ({
            games: state.games.map(g => g.id === id ? { ...g, ...updatedGame } as GameItem : g)
        })),
        deleteGame: (id) => set((state) => ({
            games: state.games.filter(g => g.id !== id)
        })),

        // --- Pomodoro local actions ---
        completePomodoroLocal: (timeMinutes) => {
            const state = get()
            const xpEarned = timeMinutes * 2
            const gemsEarned = Math.round(timeMinutes / 2)

            let newXp = state.currentXp + xpEarned
            let newLevel = state.level
            let neededXp = state.xpToNextLevel
            let didLevelUp = false

            while (newXp >= neededXp) {
                newXp -= neededXp
                newLevel += 1
                neededXp = newLevel * 500
                didLevelUp = true
            }

            set({
                currentXp: newXp,
                totalXp: state.totalXp + xpEarned,
                level: newLevel,
                xpToNextLevel: neededXp,
                gemBalance: state.gemBalance + gemsEarned,
                isLevelingUp: didLevelUp,
                pomodoroHistory: [...state.pomodoroHistory, {
                    completedAt: new Date().toISOString(),
                    duration: timeMinutes,
                    xpEarned,
                    gemsEarned
                }],
                pendingReward: {
                    xpEarned,
                    gemsEarned,
                    newLevel,
                    didLevelUp,
                    pomodoro: true
                }
            })

            if (didLevelUp) {
                import('canvas-confetti').then((confetti) => {
                    confetti.default({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
                }).catch(() => {})
            }
        },

        // --- UI Actions ---
        setError: (msg) => set({ errorMessage: msg }),
        clearError: () => set({ errorMessage: null }),
        setSessionActive: (active) => set({ sessionActive: active }),
        setSessionPaused: (paused) => set({ sessionPaused: paused }),
        setMultiplier: (multiplier) => set({ currentMultiplier: multiplier }),
        clearPendingReward: () => set({ pendingReward: null, isLevelingUp: false }),
        
        triggerClassChange: () => {
            set({ classChangedToMonarcaDeLaNoche: true });
        },

        // --- RPG Titles based on Level & Theme ---
        getLevelName: () => {
            const level = get().level
            const theme = get().currentTheme
            const classChanged = get().classChangedToMonarcaDeLaNoche

            if (theme === 'one-piece') {
                if (level >= 80) return 'Rey de los Piratas 🏴‍☠️'
                if (level >= 50) return 'Yonko (Emperador del Mar)'
                if (level >= 30) return 'Shichibukai (Guerrero del Mar)'
                if (level >= 15) return 'Supernova del Nuevo Mundo'
                if (level >= 5)  return 'Pirata Novato Destacado'
                return 'Grumete de Cubierta'
            }

            if (theme === 'bleach') {
                if (level >= 80) return 'Miembro de la División Cero ⚔️'
                if (level >= 50) return 'Capitán de Escuadrón'
                if (level >= 30) return 'Teniente del Gotei 13'
                if (level >= 15) return 'Oficial Sentado'
                if (level >= 5)  return 'Shinigami Sustituto'
                return 'Alma Errante (Plus)'
            }

            // Default / Solo Leveling Theme titles
            if (classChanged) {
                if (level >= 80) return 'Rey Monarca 👑'
                if (level >= 50) return 'Monarca S+ 🔥'
                return 'Monarca de la Noche 👤'
            }
            if (level >= 50) return 'Cazador Legendario'
            if (level >= 30) return 'Cazador Rango S'
            if (level >= 20) return 'Cazador Rango A'
            if (level >= 15) return 'Cazador Rango B'
            if (level >= 10) return 'Cazador Rango C'
            if (level >= 5)  return 'Cazador Rango D'
            return 'Cazador Rango E (El Más Débil)'
        },
    }),
    {
        name: 'solo-leveling-gaming-store',
        partialize: (state) => ({
            userId: state.userId,
            username: state.username,
            level: state.level,
            currentXp: state.currentXp,
            totalXp: state.totalXp,
            xpToNextLevel: state.xpToNextLevel,
            gemBalance: state.gemBalance,
            dailyStreak: state.dailyStreak,
            longestDailyStreak: state.longestDailyStreak,
            flowStreak: state.flowStreak,
            pomodoroFlowStreak: state.pomodoroFlowStreak,
            xpBoostActive: state.xpBoostActive,
            currentTheme: state.currentTheme,
            stats: state.stats,
            tasks: state.tasks,
            customRewards: state.customRewards,
            purchasedItems: state.purchasedItems,
            games: state.games,
            themesInventory: state.themesInventory,
            pomodoroHistory: state.pomodoroHistory,
            gymConsecutiveDays: state.gymConsecutiveDays,
            classChangedToMonarcaDeLaNoche: state.classChangedToMonarcaDeLaNoche
        })
    }
)))

export default useGameStore