/**
 * Script de prueba de conexión a Firebase
 * Verifica que todos los servicios estén configurados correctamente
 *
 * Uso:
 * npx tsx scripts/test-firebase-connection.ts
 */

import { app, auth, db, storage, firebaseInfo } from '../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll } from 'firebase/storage';

console.log('\n🔥 Testing Firebase Connection...\n');
console.log('━'.repeat(50));

/**
 * Verificar configuración
 */
function testConfig() {
  console.log('\n1. Configuration');
  console.log('   Project ID:', firebaseInfo.projectId || '❌ Missing');
  console.log('   Environment:', firebaseInfo.environment);
  console.log('   Using Emulator:', firebaseInfo.usingEmulator ? 'Yes' : 'No');

  if (!firebaseInfo.projectId) {
    console.log('   ❌ Firebase not configured properly');
    return false;
  }

  console.log('   ✅ Configuration loaded');
  return true;
}

/**
 * Verificar Firebase App
 */
function testApp() {
  console.log('\n2. Firebase App');
  console.log('   App Name:', app.name);
  console.log('   ✅ App initialized');
  return true;
}

/**
 * Verificar Authentication
 */
function testAuth() {
  console.log('\n3. Authentication');
  console.log('   Auth Domain:', auth.config.authDomain || '❌ Missing');
  console.log('   Current User:', auth.currentUser ? auth.currentUser.email : 'None (not logged in)');
  console.log('   ✅ Auth service available');
  return true;
}

/**
 * Verificar Firestore
 */
async function testFirestore() {
  console.log('\n4. Cloud Firestore');

  try {
    // Intentar obtener una colección (cualquiera)
    const testRef = collection(db, 'usuarios');
    await getDocs(testRef);

    console.log('   Database:', db.type);
    console.log('   ✅ Firestore connection successful');
    return true;
  } catch (error: any) {
    console.log('   ❌ Firestore connection failed');
    console.log('   Error:', error.message);

    if (error.code === 'permission-denied') {
      console.log('   💡 Tip: This is normal if you haven\'t deployed security rules yet.');
      console.log('   💡 Deploy rules: firebase deploy --only firestore:rules');
      return true; // Connection works, just permission issue
    }

    return false;
  }
}

/**
 * Verificar Storage
 */
async function testStorage() {
  console.log('\n5. Cloud Storage');

  try {
    const storageRef = ref(storage, '/');
    await listAll(storageRef);

    console.log('   Bucket:', storage.app.options.storageBucket || '❌ Missing');
    console.log('   ✅ Storage connection successful');
    return true;
  } catch (error: any) {
    console.log('   ❌ Storage connection failed');
    console.log('   Error:', error.message);

    if (error.code === 'storage/unauthorized') {
      console.log('   💡 Tip: This is normal if you haven\'t deployed security rules yet.');
      console.log('   💡 Deploy rules: firebase deploy --only storage:rules');
      return true; // Connection works, just permission issue
    }

    return false;
  }
}

/**
 * Verificar variables de entorno
 */
function testEnvVars() {
  console.log('\n6. Environment Variables');

  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  let allPresent = true;

  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} - Missing!`);
      allPresent = false;
    }
  });

  // Opcional
  const optionalVars = [
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    'NEXT_PUBLIC_FIREBASE_VAPID_KEY',
  ];

  optionalVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName} (optional)`);
    } else {
      console.log(`   ⚠️  ${varName} - Not set (optional for FCM)`);
    }
  });

  return allPresent;
}

/**
 * Main test runner
 */
async function runTests() {
  const results = {
    config: false,
    app: false,
    auth: false,
    firestore: false,
    storage: false,
    envVars: false,
  };

  try {
    results.config = testConfig();
    results.app = testApp();
    results.auth = testAuth();
    results.firestore = await testFirestore();
    results.storage = await testStorage();
    results.envVars = testEnvVars();

    // Summary
    console.log('\n' + '━'.repeat(50));
    console.log('\n📊 Test Summary\n');

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    console.log(`   Tests Passed: ${passed}/${total}`);
    console.log('');

    Object.entries(results).forEach(([test, result]) => {
      const icon = result ? '✅' : '❌';
      const label = test.charAt(0).toUpperCase() + test.slice(1);
      console.log(`   ${icon} ${label}`);
    });

    console.log('');

    if (passed === total) {
      console.log('🎉 All tests passed! Firebase is ready to use.');
      console.log('');
      console.log('Next steps:');
      console.log('1. Deploy security rules (see docs/firebase/DEPLOY_RULES.md)');
      console.log('2. Create first admin user (see docs/firebase/QUICK_START.md)');
      console.log('3. Start building your app!');
    } else {
      console.log('⚠️  Some tests failed. Please check the errors above.');
      console.log('');
      console.log('Common issues:');
      console.log('1. Missing environment variables in .env.local');
      console.log('2. Firebase services not enabled in Console');
      console.log('3. Security rules not deployed');
      console.log('');
      console.log('See docs/firebase/FIREBASE_SETUP_GUIDE.md for help.');
    }

    console.log('\n' + '━'.repeat(50) + '\n');

    process.exit(passed === total ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
