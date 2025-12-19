'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { usuariosService } from '@/lib/services';

export default function CreateAdminPage() {
  const [email, setEmail] = useState('admin@oldtexas.local');
  const [password, setPassword] = useState('Admin1234!');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!auth) {
      setMessage('Firebase no está configurado');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      // Verificar si ya existe un admin
      // const admins = await usuariosService.getByRol('admin');
      // if (admins.length > 0) {
      //   setMessage('Ya existe un usuario administrador.');
      //   setLoading(false);
      //   return;
      // }

      // Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Crear documento en colección usuarios con el UID de Firebase Auth
      // Usar createWithId para usar el mismo ID que Firebase Auth
      await usuariosService.createWithId(cred.user.uid, {
        email,
        nombre: 'Admin',
        apellido: 'Principal',
        telefono: '',
        rol: 'admin',
        activo: true,
        fcmTokens: [],
        creadoPor: 'sistema',
        ultimaConexion: new Date() as any,
      } as any);

      // Iniciar sesión y redirigir al dashboard
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Administrador creado y autenticado. Redirigiendo al dashboard...');
      window.location.href = '/dashboard';
    } catch (e: any) {
      setMessage(e?.message || 'Error creando administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Crear Administrador</h1>
      <p className="text-sm text-muted-foreground">
        Uso de desarrollo. Crea un usuario administrador en Firebase Auth y lo registra en la colección `usuarios`.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <input
          className="border border-input rounded px-3 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Password</label>
        <input
          className="border border-input rounded px-3 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
        onClick={handleCreate}
      >
        {loading ? 'Creando...' : 'Crear administrador'}
      </button>
      {message && <div className="text-sm text-foreground bg-muted p-3 rounded">{message}</div>}
    </div>
  );
}


