/**
 * Script para configurar automáticamente el Upload Preset en Cloudinary
 *
 * Este script crea un preset "unsigned" con toda la configuración avanzada
 * recomendada para el proyecto Old Texas BBQ CRM.
 *
 * REQUISITOS:
 * 1. Tener una cuenta en Cloudinary (https://cloudinary.com/users/register/free)
 * 2. Configurar las variables de entorno en .env.local:
 *    - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *    - NEXT_PUBLIC_CLOUDINARY_API_KEY
 *    - CLOUDINARY_API_SECRET
 *
 * USO:
 * npx tsx scripts/setup-cloudinary-preset.ts
 */

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  log(
    '\n╔════════════════════════════════════════════════════════════╗',
    'cyan'
  );
  log('║   🔧 Cloudinary Upload Preset - Configuración Automática  ║', 'cyan');
  log(
    '╚════════════════════════════════════════════════════════════╝\n',
    'cyan'
  );

  log(
    'Este script creará un Upload Preset en tu cuenta de Cloudinary con:',
    'bright'
  );
  log('  ✓ Modo "Unsigned" para uploads desde el frontend', 'green');
  log('  ✓ Formatos permitidos: jpg, png, webp, pdf', 'green');
  log('  ✓ Tamaño máximo: 10 MB', 'green');
  log('  ✓ Optimización automática de imágenes', 'green');
  log('  ✓ Carpeta de organización: old-texas-bbq/', 'green');
  log('  ✓ Transformaciones automáticas\n', 'green');

  // Paso 1: Solicitar credenciales
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('📋 PASO 1: Ingresa tus credenciales de Cloudinary', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  log('Puedes encontrar estas credenciales en:', 'yellow');
  log('👉 https://cloudinary.com/console\n', 'cyan');

  const cloudName = await question(
    `${colors.bright}Cloud Name:${colors.reset} `
  );
  const apiKey = await question(`${colors.bright}API Key:${colors.reset} `);
  const apiSecret = await question(
    `${colors.bright}API Secret:${colors.reset} `
  );

  if (!cloudName || !apiKey || !apiSecret) {
    log('\n❌ Error: Todas las credenciales son requeridas', 'red');
    rl.close();
    return;
  }

  // Paso 2: Solicitar nombre del preset
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('📝 PASO 2: Nombre del Upload Preset', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  const defaultPresetName = 'old-texas-bbq-unsigned';
  const presetName =
    (await question(
      `${colors.bright}Nombre del preset${colors.reset} (default: ${defaultPresetName}): `
    )) || defaultPresetName;

  // Paso 3: Crear el preset
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('🚀 PASO 3: Creando Upload Preset...', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'blue');

  const presetConfig = {
    name: presetName,
    unsigned: true,
    folder: 'old-texas-bbq',
    allowed_formats: ['jpg', 'png', 'webp', 'pdf'],
    max_file_size: 10485760, // 10 MB
    access_mode: 'public',
    unique_filename: true,
    use_filename: true,
    tags: ['old-texas-bbq', 'crm'],
    // Transformaciones automáticas
    transformation: [
      {
        width: 2000,
        height: 2000,
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
    // Contexto adicional
    context: {
      source: 'old-texas-bbq-crm',
    },
  };

  try {
    log('Enviando configuración a Cloudinary...', 'yellow');

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload_presets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(presetConfig),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error al crear el preset');
    }

    const result = await response.json();

    log('\n✅ ¡Upload Preset creado exitosamente!', 'green');
    log(
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'green'
    );
    log('📄 CONFIGURACIÓN CREADA', 'green');
    log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
      'green'
    );

    log(`Preset Name:       ${colors.bright}${result.name}${colors.reset}`);
    log(`Signing Mode:      ${colors.bright}Unsigned${colors.reset}`);
    log(
      `Folder:            ${colors.bright}${result.settings?.folder || 'old-texas-bbq'}${colors.reset}`
    );
    log(
      `Formatos:          ${colors.bright}jpg, png, webp, pdf${colors.reset}`
    );
    log(`Tamaño máximo:     ${colors.bright}10 MB${colors.reset}`);
    log(`Access Mode:       ${colors.bright}public${colors.reset}`);

    // Paso 4: Generar variables de entorno
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('📦 PASO 4: Variables de Entorno', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    log('Agrega estas variables a tu archivo .env.local:\n', 'yellow');

    const envVars = `# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${cloudName}
NEXT_PUBLIC_CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${result.name}`;

    log('─────────────────────────────────────────────────────────────');
    log(envVars, 'bright');
    log('─────────────────────────────────────────────────────────────\n');

    // Paso 5: Verificación
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('✔️  PASO 5: Verificación', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    log('Para verificar que todo funciona:', 'yellow');
    log('1. Copia las variables de entorno a tu .env.local', 'bright');
    log('2. Reinicia tu servidor de desarrollo (npm run dev)', 'bright');
    log('3. Prueba subir una imagen usando:', 'bright');
    log('\n   import { uploadProductImage } from "@/lib/cloudinary";', 'cyan');
    log(
      '   const result = await uploadProductImage(file, "test-123");',
      'cyan'
    );
    log('\n4. Verifica en tu dashboard de Cloudinary:', 'bright');
    log(
      `   👉 https://cloudinary.com/console/c-${cloudName.substring(0, 10)}/media_library\n`,
      'cyan'
    );

    // Resumen final
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'green');
    log('🎉 ¡CONFIGURACIÓN COMPLETADA!', 'green');
    log(
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n',
      'green'
    );

    log('✓ Upload Preset creado', 'green');
    log('✓ Configuración avanzada aplicada', 'green');
    log('✓ Optimización automática habilitada', 'green');
    log('✓ Listo para usar en tu aplicación\n', 'green');

    log('📚 Documentación:', 'yellow');
    log('  • Guía de setup: docs/cloudinary/SETUP.md', 'bright');
    log('  • Ejemplos de uso: docs/cloudinary/USAGE.md', 'bright');
    log('  • API Reference: https://cloudinary.com/documentation\n', 'bright');
  } catch (error) {
    log('\n❌ Error al crear el Upload Preset:', 'red');

    if (error instanceof Error) {
      log(`\n${error.message}\n`, 'red');

      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        log('Posibles causas:', 'yellow');
        log(
          '  • Verifica que tu API Key y API Secret sean correctos',
          'bright'
        );
        log(
          '  • Asegúrate de no tener espacios extra en las credenciales',
          'bright'
        );
        log('  • Confirma que tu cuenta de Cloudinary esté activa\n', 'bright');
      } else if (error.message.includes('already exists')) {
        log('El preset ya existe. Opciones:', 'yellow');
        log('  1. Usa un nombre diferente', 'bright');
        log('  2. Elimina el preset existente desde:', 'bright');
        log(
          `     https://cloudinary.com/console/lui/settings/upload\n`,
          'cyan'
        );
      }
    }
  } finally {
    rl.close();
  }
}

// Ejecutar el script
main().catch((error) => {
  log('\n❌ Error inesperado:', 'red');
  console.error(error);
  rl.close();
  process.exit(1);
});
