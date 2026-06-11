import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import { SkeletonBox } from '../components/ui/Skeleton';
import useGameStore from '../store/useGameStore';

const FocusPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  const { pomodoroFlowStreak, sessionActive, activeTask } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12">
        <div className="flex flex-col items-center mb-10">
          <SkeletonBox width="20rem" height="3rem" className="mb-4 rounded-xl" />
          <SkeletonBox width="28rem" height="1.5rem" className="mb-2 rounded-md" />
          <SkeletonBox width="24rem" height="1.5rem" className="rounded-md" />
        </div>
        
        <div className="flex justify-center mb-12">
          <SkeletonBox width="300px" height="300px" className="rounded-full" />
        </div>
 
        <div className="max-w-md mx-auto">
          <SkeletonBox width="100%" height="14rem" className="rounded-2xl" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
          Protocolo de Trabajo Profundo
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Completa sesiones consecutivas de 25 minutos para aumentar tu Racha de Flujo. <br/>
          <span style={{ color: 'var(--flow-green)' }}>Cada sesión completada aumenta tu multiplicador de XP global.</span>
        </p>
      </div>

      {/* ✨ UPDATE: Passed the active task ID down to the timer */}
      <PomodoroTimer activeTaskId={activeTask?.id} />

      {pomodoroFlowStreak === 0 && !sessionActive && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-5 rounded-2xl text-center text-sm max-w-md mx-auto"
              style={{
                  backgroundColor: 'var(--surface-base)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
              }}>
              🎯 Completa tu primera sesión para comenzar a acumular tu Racha de Flujo y ganar multiplicadores de XP adicionales.
          </motion.div>
      )}

      <div 
        className="mt-12 max-w-md mx-auto text-sm p-5 rounded-2xl border" 
        style={{ 
          backgroundColor: 'var(--surface-raised)', 
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)' 
        }}
      >
        <h4 className="font-bold mb-3 text-white">Cómo funciona:</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>Completa una sesión de 25m para ganar XP Base + Gemas.</li>
          <li>Cada sesión consecutiva añade +0.2x a tu multiplicador de XP.</li>
          <li>
            <span style={{ color: 'var(--flow-green)' }}>Pausa &lt; 15 mins:</span> Gracia total — la racha continúa.
          </li>
          <li>
            <span style={{ color: 'var(--streak-orange)' }}>Pausa 15–30 mins:</span> Racha congelada — sin progreso, sin reinicio.
          </li>
          <li>
            <span style={{ color: 'var(--danger-red)' }}>Pausa &gt; 30 mins:</span> La racha se restablece a cero.
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default FocusPage;