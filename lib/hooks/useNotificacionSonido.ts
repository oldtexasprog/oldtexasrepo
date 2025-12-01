'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook para reproducir sonidos de notificación
 * Puede usar Web Audio API o un archivo de audio remoto
 */
export function useNotificacionSonido() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Inicializar AudioContext solo en el cliente
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    return () => {
      // Cleanup
      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current.close();
      }
    };
  }, []);

  /**
   * Reproduce un sonido de alerta generado con Web Audio API
   * Este método no requiere archivos externos
   */
  const reproducirAlerta = () => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      // Reanudar el contexto si está suspendido (por políticas del navegador)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Crear oscilador para el tono
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar sonido de alerta agradable
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Tono inicial

      // Envelope para el volumen (fade in/out)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

      // Reproducir
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      // Segundo tono (como un "ding-dong")
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);

        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);

        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.3);
      }, 150);
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
    }
  };

  /**
   * Reproduce un sonido de éxito (tono más alto y corto)
   */
  const reproducirExito = () => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.error('Error reproduciendo sonido de éxito:', error);
    }
  };

  /**
   * Reproduce un sonido de urgencia (más intenso)
   */
  const reproducirUrgente = () => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Tres tonos rápidos
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(900, audioContext.currentTime);

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        }, i * 250);
      }
    } catch (error) {
      console.error('Error reproduciendo sonido urgente:', error);
    }
  };

  return {
    reproducirAlerta,
    reproducirExito,
    reproducirUrgente,
  };
}
