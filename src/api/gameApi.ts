import useGameStore from '../store/useGameStore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from 'firebase/auth'
import { auth, db, isFirebaseConfigured } from './firebase'

// Delay simulation helper for realism on local fallback
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to save entire state to Firestore
export const syncToFirebase = async () => {
    if (!isFirebaseConfigured || !auth || !auth.currentUser || !db) return;
    const userId = auth.currentUser.uid;
    const store = useGameStore.getState();
    const dataToSync = {
        userId,
        username: store.username,
        level: store.level,
        currentXp: store.currentXp,
        totalXp: store.totalXp,
        xpToNextLevel: store.xpToNextLevel,
        gemBalance: store.gemBalance,
        dailyStreak: store.dailyStreak,
        longestDailyStreak: store.longestDailyStreak,
        flowStreak: store.flowStreak,
        pomodoroFlowStreak: store.pomodoroFlowStreak,
        xpBoostActive: store.xpBoostActive,
        currentTheme: store.currentTheme,
        stats: store.stats,
        tasks: store.tasks,
        customRewards: store.customRewards,
        purchasedItems: store.purchasedItems,
        games: store.games,
        themesInventory: store.themesInventory,
        pomodoroHistory: store.pomodoroHistory,
        gymConsecutiveDays: store.gymConsecutiveDays,
        classChangedToMonarcaDeLaNoche: store.classChangedToMonarcaDeLaNoche
    };
    try {
        await setDoc(doc(db, "users", userId), dataToSync);
    } catch (e) {
        console.error("Error syncing to Firestore:", e);
    }
};

export interface GetTasksParams {
    status?: string;
    priority?: string;
    search?: string;
    tag?: string;
    page?: number;
    size?: number;
}

export const authApi = {
    register: async (data: any) => {
        if (isFirebaseConfigured && auth) {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            const initialProfile = {
                userId: user.uid,
                username: data.username || 'Cazador',
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
                stats: { STR: 10, INT: 10, AGI: 10, VIT: 10 },
                tasks: useGameStore.getState().tasks,
                customRewards: useGameStore.getState().customRewards,
                purchasedItems: [],
                games: [],
                themesInventory: ['solo-leveling'],
                pomodoroHistory: [],
                gymConsecutiveDays: 0,
                classChangedToMonarcaDeLaNoche: false
            };
            await setDoc(doc(db, "users", user.uid), initialProfile);
            return { data: initialProfile };
        } else {
            await delay();
            useGameStore.setState({ username: data.username || 'Cazador', isAuthenticated: true });
            return {
                data: {
                    accessToken: 'mock-local-token',
                    username: data.username || 'Cazador',
                    level: 1,
                    currentXp: 0,
                    totalXp: 0,
                    xpToNextLevel: 500,
                    gemBalance: 50,
                    currentDailyStreak: 0,
                    longestDailyStreak: 0,
                    pomodoroFlowStreak: 0,
                    xpBoostActive: false,
                    currentTheme: 'solo-leveling'
                }
            };
        }
    },
    login: async (data: any) => {
        if (isFirebaseConfigured && auth) {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                return { data: snap.data() };
            }
            throw new Error("User profile not found in database.");
        } else {
            await delay();
            const store = useGameStore.getState();
            useGameStore.setState({ isAuthenticated: true });
            return {
                data: {
                    accessToken: 'mock-local-token',
                    username: store.username,
                    level: store.level,
                    currentXp: store.currentXp,
                    totalXp: store.totalXp,
                    xpToNextLevel: store.xpToNextLevel,
                    gemBalance: store.gemBalance,
                    currentDailyStreak: store.dailyStreak,
                    longestDailyStreak: store.longestDailyStreak,
                    pomodoroFlowStreak: store.flowStreak,
                    xpBoostActive: store.xpBoostActive,
                    currentTheme: store.currentTheme
                }
            };
        }
    },
    refresh: async () => {
        await delay();
        return { data: { accessToken: 'mock-local-token' } };
    },
    logout: async () => {
        if (isFirebaseConfigured && auth) {
            await signOut(auth);
        }
        return { data: { success: true } };
    }
}

export const userApi = {
    getProfile: async () => {
        if (isFirebaseConfigured && auth && auth.currentUser) {
            const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (snap.exists()) {
                return { data: snap.data() };
            }
        }
        await delay();
        const store = useGameStore.getState();
        return {
            data: {
                userId: store.userId,
                username: store.username,
                level: store.level,
                currentXp: store.currentXp,
                totalXp: store.totalXp,
                xpToNextLevel: store.xpToNextLevel,
                gemBalance: store.gemBalance,
                currentDailyStreak: store.dailyStreak,
                longestDailyStreak: store.longestDailyStreak,
                pomodoroFlowStreak: store.flowStreak,
                xpBoostActive: store.xpBoostActive,
                currentTheme: store.currentTheme,
                stats: store.stats
            }
        };
    }
}

export const taskApi = {
    getAll: async (params: GetTasksParams = {}) => {
        await delay(100);
        const store = useGameStore.getState();
        let list = [...store.tasks];

        if (params.status && params.status !== 'ALL') {
            list = list.filter(t => t.status === params.status);
        }
        if (params.priority && params.priority !== 'ALL') {
            list = list.filter(t => t.priority === params.priority);
        }
        if (params.search) {
            const query = params.search.toLowerCase();
            list = list.filter(t => 
                (t.title && t.title.toLowerCase().includes(query)) ||
                (t.description && t.description.toLowerCase().includes(query))
            );
        }
        if (params.tag && params.tag !== 'ALL') {
            list = list.filter(t => 
                t.category === params.tag || 
                (t.tags && t.tags.includes(params.tag))
            );
        }

        if (params.page !== undefined && params.size !== undefined) {
            const start = params.page * params.size;
            const end = start + params.size;
            const paginated = list.slice(start, end);
            return {
                data: {
                    content: paginated,
                    last: end >= list.length,
                    totalPages: Math.ceil(list.length / params.size),
                    totalElements: list.length
                }
            };
        }

        return { data: list };
    },
    create: async (data: any) => {
        const newTask = useGameStore.getState().addTask(data);
        await syncToFirebase();
        return { data: newTask };
    },
    update: async (taskId: string, data: any) => {
        useGameStore.getState().updateTask({ id: taskId, ...data });
        await syncToFirebase();
        const updated = useGameStore.getState().tasks.find(t => t.id === taskId);
        return { data: updated };
    },
    updateStatus: async (taskId: string, status: string) => {
        useGameStore.getState().updateTask({ id: taskId, status: status as any });
        await syncToFirebase();
        const updated = useGameStore.getState().tasks.find(t => t.id === taskId);
        return { data: updated };
    },
    complete: async (taskId: string) => {
        useGameStore.getState().completeQuestLocal(taskId);
        await syncToFirebase();
        const reward = useGameStore.getState().pendingReward;
        return { data: reward };
    },
    completePomodoro: async (taskId: string) => {
        useGameStore.getState().completeQuestLocal(taskId);
        await syncToFirebase();
        const reward = useGameStore.getState().pendingReward;
        return { data: reward };
    },
    delete: async (taskId: string) => {
        useGameStore.getState().removeTask(taskId);
        await syncToFirebase();
        return { data: { success: true } };
    }
}

export const pomodoroApi = {
    start: async () => {
        return { data: { success: true } };
    },
    pause: async () => {
        return { data: { success: true } };
    },
    resume: async () => {
        return { data: { success: true } };
    },
    complete: async () => {
        useGameStore.getState().completePomodoroLocal(25);
        await syncToFirebase();
        const reward = useGameStore.getState().pendingReward;
        return { data: reward };
    },
    forfeit: async () => {
        return { data: { success: true } };
    }
}

export const storeApi = {
    getInventory: async () => {
        const store = useGameStore.getState();
        const themes = [
            { name: 'solo-leveling', displayName: 'Solo Leveling Theme', cost: 0, unlocked: true },
            { name: 'one-piece', displayName: 'One Piece Theme', cost: 150, unlocked: store.themesInventory.includes('one-piece') },
            { name: 'bleach', displayName: 'Bleach Theme', cost: 150, unlocked: store.themesInventory.includes('bleach') }
        ];

        return {
            data: {
                availableThemes: themes,
                inventory: store.purchasedItems || [],
                customRewards: store.customRewards || []
            }
        };
    },
    purchaseItem: async (data: any) => {
        const store = useGameStore.getState();
        const cost = data.expectedCost || 0;
        
        let success = false;
        let boostActivated = false;
        let themeUnlocked = false;

        if (store.gemBalance >= cost) {
            success = true;
            if (data.itemId === 'XP_BOOST') {
                useGameStore.setState({ xpBoostActive: true });
                boostActivated = true;
            } else if (data.itemId === 'STREAK_FREEZE') {
                // mock streak freeze
            } else if (data.itemId && data.itemId.startsWith('r')) {
                // Purchase custom reward
                store.purchaseRewardLocal(data.itemId);
            } else {
                store.purchaseThemeLocal(data.themeName, cost);
                themeUnlocked = true;
            }
        }

        await syncToFirebase();

        return {
            data: {
                success,
                newGemBalance: useGameStore.getState().gemBalance,
                boostActivated,
                themeUnlocked
            }
        };
    },
    equipTheme: async (themeName: string) => {
        useGameStore.getState().setCurrentTheme(themeName);
        await syncToFirebase();
        return { data: { success: true } };
    }
}

export const tagApi = {
    getAll: async () => {
        return { data: ['Trabajo', 'Lectura', 'Dieta', 'Gimnasio', 'General'] };
    },
    create: async (data: any) => {
        return { data: data.name };
    },
    delete: async (tagId: string) => {
        return { data: { success: true } };
    }
}

export const analyticsApi = {
    getSummary: async () => {
        const store = useGameStore.getState();
        const completed = store.tasks.filter(t => t.status === 'COMPLETED').length;
        const total = store.tasks.length;
        return {
            data: {
                totalTasksCompleted: completed,
                totalPomodoroSessions: (store.pomodoroHistory || []).length,
                currentLevel: store.level,
                levelTitle: store.getLevelName(),
                totalXp: store.totalXp,
                totalQuests: total,
                questsCompleted: completed,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
                currentDailyStreak: store.dailyStreak,
                longestDailyStreak: store.longestDailyStreak,
                gemsBalance: store.gemBalance,
                xpBoostActive: store.xpBoostActive
            }
        };
    },
    getTasks: async (period?: string) => {
        const store = useGameStore.getState();
        const completedCount = store.tasks.filter(t => t.status === 'COMPLETED').length;
        const openCount = store.tasks.filter(t => t.status === 'OPEN').length;

        // Group by priority
        const byPriority = {
            HIGH: store.tasks.filter(t => t.priority === 'HIGH').length,
            MEDIUM: store.tasks.filter(t => t.priority === 'MEDIUM').length,
            LOW: store.tasks.filter(t => t.priority === 'LOW').length,
        };

        // Extract top tags
        const tagMap: any = {};
        store.tasks.forEach(t => {
            t.tags.forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        });
        const topTags = Object.entries(tagMap).map(([tagName, count]) => ({ tagName, count: count as number })).sort((a,b) => b.count - a.count).slice(0, 5);

        return {
            data: {
                dailyCompletions: [
                    { date: new Date().toISOString(), count: completedCount }
                ],
                byPriority,
                topTags
            }
        };
    },
    getPomodoro: async (period?: string) => {
        const store = useGameStore.getState();
        return {
            data: {
                dailySessions: [
                    { date: new Date().toISOString(), count: (store.pomodoroHistory || []).length }
                ],
                bestFlowStreak: store.flowStreak,
                averageMultiplier: 1.2,
                totalXpFromPomodoros: (store.pomodoroHistory || []).reduce((acc, p) => acc + p.xpEarned, 0)
            }
        };
    },
    getProgression: async (period?: string) => {
        const store = useGameStore.getState();
        return {
            data: {
                xpByPeriod: [
                    { label: 'Total XP', xp: store.totalXp }
                ],
                levelUps: store.level > 1 ? [
                    { level: store.level, triggeredBy: 'Desafíos Completados' }
                ] : []
            }
        };
    }
}

export const badgeApi = {
    getMyBadges: async () => {
        const store = useGameStore.getState();
        const completedQuests = store.tasks.filter(t => t.status === 'COMPLETED').length;
        const badges = [
            { badgeKey: 'b1', name: 'Despertar del Cazador', icon: '💀', description: 'Has iniciado tu viaje como Cazador.', earnedAt: 'Día 1', unlocked: true },
            { badgeKey: 'b2', name: 'Esfuerzo de Acero', icon: '🏋️', description: 'Completaste 10 misiones.', earnedAt: 'Hito', unlocked: completedQuests >= 10 },
            { badgeKey: 'b3', name: 'Monarca de la Noche', icon: '👤', description: 'Desbloqueaste la Clase Especial Monarca de la Noche.', earnedAt: 'Hito', unlocked: store.classChangedToMonarcaDeLaNoche },
            { badgeKey: 'b4', name: 'Enfoque Absoluto', icon: '🍅', description: 'Completaste tu primer Pomodoro.', earnedAt: 'Hito', unlocked: (store.pomodoroHistory || []).length >= 1 }
        ];
        return { data: badges.filter(b => b.unlocked) };
    }
}

export const leaderboardApi = {
    getWeekly: async () => {
        const store = useGameStore.getState();
        const list = [
            { id: 'l1', username: 'Sung Jin-Woo 👤', level: 99, weeklyScore: 1250 },
            { id: 'l2', username: 'Monkey D. Luffy 🏴‍☠️', level: 48, weeklyScore: 680 },
            { id: 'l3', username: 'Ichigo Kurosaki ⚔️', level: 45, weeklyScore: 540 },
            { id: 'l4', username: `${store.username} (Tú)`, level: store.level, weeklyScore: store.totalXp > 0 ? Math.round(store.totalXp / 2) : 50 },
            { id: 'l5', username: 'Cha Hae-In ✨', level: 42, weeklyScore: 480 },
            { id: 'l6', username: 'Roronoa Zoro ⚔️', level: 32, weeklyScore: 310 }
        ];
        return { data: list.sort((a, b) => b.weeklyScore - a.weeklyScore) };
    },
    getSeason: async () => {
        const store = useGameStore.getState();
        const list = [
            { id: 'l1', username: 'Sung Jin-Woo 👤', level: 99, weeklyScore: 8900 },
            { id: 'l2', username: 'Monkey D. Luffy 🏴‍☠️', level: 48, weeklyScore: 4200 },
            { id: 'l3', username: 'Ichigo Kurosaki ⚔️', level: 45, weeklyScore: 3500 },
            { id: 'l4', username: `${store.username} (Tú)`, level: store.level, weeklyScore: store.totalXp },
            { id: 'l5', username: 'Cha Hae-In ✨', level: 42, weeklyScore: 3100 }
        ];
        return { data: list.sort((a, b) => b.weeklyScore - a.weeklyScore) };
    },
    getProfile: async (username: string) => {
        return {
            data: {
                username,
                level: 30,
                stats: { STR: 50, INT: 32, AGI: 45, VIT: 40 },
                badgesCount: 5,
                questsCompletedCount: 120
            }
        };
    }
}