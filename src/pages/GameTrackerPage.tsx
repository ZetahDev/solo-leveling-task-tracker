import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore, { GameItem } from '../store/useGameStore';

const PLATFORMS = ['ALL', 'PC', 'PS5', 'Xbox', 'Nintendo Switch', 'Mobile', 'Other'];
const STATUSES = [
    { label: 'All Games', value: 'ALL' },
    { label: 'Playing', value: 'PLAYING' },
    { label: 'Backlog', value: 'PENDING' },
    { label: 'Completed / Platinado', value: 'COMPLETED' }
];

const GameTrackerPage = () => {
    const { games, addGame, updateGame, deleteGame } = useGameStore();

    // Filters state
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal state
    const [isOpen, setIsOpen] = useState(false);
    const [editingGame, setEditingGame] = useState<GameItem | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('PC');
    const [genre, setGenre] = useState('RPG');
    const [status, setStatus] = useState<'PLAYING' | 'PENDING' | 'COMPLETED'>('PLAYING');
    const [score, setScore] = useState(10);

    const handleOpenModal = (game: GameItem | null = null) => {
        if (game) {
            setEditingGame(game);
            setTitle(game.title);
            setPlatform(game.platform);
            setGenre(game.genre);
            setStatus(game.status);
            setScore(game.score);
        } else {
            setEditingGame(null);
            setTitle('');
            setPlatform('PC');
            setGenre('RPG');
            setStatus('PLAYING');
            setScore(10);
        }
        setIsOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const payload = { title: title.trim(), platform, genre, status, score };

        if (editingGame) {
            updateGame(editingGame.id, payload);
        } else {
            addGame(payload);
        }
        setIsOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Seguro que deseas eliminar este videojuego de tu biblioteca?')) {
            deleteGame(id);
        }
    };

    // Filter games
    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase()) || 
                             game.genre.toLowerCase().includes(search.toLowerCase());
        const matchesPlatform = platformFilter === 'ALL' || game.platform === platformFilter;
        const matchesStatus = statusFilter === 'ALL' || game.status === statusFilter;
        return matchesSearch && matchesPlatform && matchesStatus;
    });

    const getStatusLabel = (s: string) => {
        if (s === 'PLAYING') return { text: '⚔️ JUGANDO', color: 'var(--flow-green)', bg: 'rgba(46,204,113,0.15)' };
        if (s === 'COMPLETED') return { text: '🏆 PLATINADO', color: 'var(--level-gold)', bg: 'rgba(241,196,15,0.15)' };
        return { text: '⏳ PENDIENTE', color: 'var(--text-secondary)', bg: 'rgba(255,255,255,0.05)' };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto py-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-black text-[var(--text-primary)]">Biblioteca de Videojuegos</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Organiza tu colección y registra tus logros cazando monstruos digitales.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[var(--xp-blue)] rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(79,142,247,0.3)]"
                >
                    + Registrar Juego
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 bg-[var(--surface-base)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-lg">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por título o género..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl text-sm font-normal text-white placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--xp-blue)] transition-colors"
                    />
                </div>

                <div>
                    <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl text-sm font-normal text-white focus:outline-none focus:border-[var(--xp-blue)] transition-colors"
                    >
                        <option value="ALL">Todas las Plataformas</option>
                        {PLATFORMS.filter(p => p !== 'ALL').map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-xl text-sm font-normal text-white focus:outline-none focus:border-[var(--xp-blue)] transition-colors"
                    >
                        {STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
                <div
                    className="text-center py-16 rounded-2xl border border-dashed"
                    style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
                >
                    <div className="text-5xl mb-4">🎮</div>
                    <p className="font-bold text-xl mb-2 text-[var(--text-primary)]">No hay videojuegos que mostrar</p>
                    <p className="text-sm text-[var(--text-secondary)]">Registra un juego para empezar a organizar tu biblioteca gaming.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGames.map((game) => {
                        const statusBadge = getStatusLabel(game.status);
                        return (
                            <motion.div
                                layout
                                key={game.id}
                                className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white leading-tight">{game.title}</h3>
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider"
                                              style={{ color: statusBadge.color, backgroundColor: statusBadge.bg }}>
                                            {statusBadge.text}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-4">
                                        <span>📟 {game.platform}</span>
                                        <span>•</span>
                                        <span>🏷️ {game.genre}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
                                    <div className="text-sm">
                                        Puntuación: <strong className="text-[var(--level-gold)]">⭐ {game.score}/10</strong>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(game)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--xp-blue)] hover:border-[var(--xp-blue)] transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(game.id)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950/20 border border-red-900/50 text-[var(--danger-red)] hover:bg-[var(--danger-red)] hover:text-white transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal Add/Edit */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl border"
                            style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-white">{editingGame ? 'Editar Videojuego' : 'Registrar Videojuego'}</h2>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-[var(--text-secondary)]">Título *</label>
                                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: God of War Ragnarök" className="w-full p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-white focus:outline-none focus:border-[var(--xp-blue)]" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-[var(--text-secondary)]">Plataforma</label>
                                        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-white focus:outline-none focus:border-[var(--xp-blue)]">
                                            {PLATFORMS.filter(p => p !== 'ALL').map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-[var(--text-secondary)]">Género</label>
                                        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Ej: RPG, Acción" className="w-full p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-white focus:outline-none focus:border-[var(--xp-blue)]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-[var(--text-secondary)]">Estado</label>
                                        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-white focus:outline-none focus:border-[var(--xp-blue)]">
                                            <option value="PLAYING">Jugando ⚔️</option>
                                            <option value="PENDING">Pendiente ⏳</option>
                                            <option value="COMPLETED">Platinado 🏆</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1 text-[var(--text-secondary)]">Puntuación (0-10)</label>
                                        <input type="number" min="0" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-white focus:outline-none focus:border-[var(--xp-blue)]" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-subtle)]">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 rounded-lg font-bold text-[var(--text-secondary)] hover:text-white transition-colors">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-[var(--xp-blue)] transition-transform hover:scale-105 active:scale-95">
                                        {editingGame ? 'Guardar Cambios' : 'Registrar'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GameTrackerPage;
