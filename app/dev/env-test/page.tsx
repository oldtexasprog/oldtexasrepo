'use client';

export default function EnvTestPage() {
  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🔍 Test de Variables de Entorno</h1>

        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Variables NEXT_PUBLIC_FIREBASE_*</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="p-3 bg-muted rounded">
              <strong>API_KEY:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '❌ NO DEFINIDA'}
            </div>
            <div className="p-3 bg-muted rounded">
              <strong>AUTH_DOMAIN:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ NO DEFINIDA'}
            </div>
            <div className="p-3 bg-muted rounded">
              <strong>PROJECT_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ NO DEFINIDA'}
            </div>
            <div className="p-3 bg-muted rounded">
              <strong>STORAGE_BUCKET:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '❌ NO DEFINIDA'}
            </div>
            <div className="p-3 bg-muted rounded">
              <strong>MESSAGING_SENDER_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '❌ NO DEFINIDA'}
            </div>
            <div className="p-3 bg-muted rounded">
              <strong>APP_ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '❌ NO DEFINIDA'}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📝 Instrucciones</h3>
          <p className="text-sm">
            Si todas las variables muestran valores (no "❌ NO DEFINIDA"), entonces Next.js está leyendo correctamente el archivo .env.local
          </p>
        </div>
      </div>
    </div>
  );
}
