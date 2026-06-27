/**
 * create-admin.js
 * Old Texas BBQ - CRM
 *
 * Crea un usuario admin en Firebase Auth + documento en Firestore.
 *
 * Uso: node scripts/create-admin.js <email> <password> <nombre>
 * Ejemplo: node scripts/create-admin.js admin@oldtexas.mx MiPass123 "Pedro Durán"
 */

const admin = require('firebase-admin');
const sa = require('../docs/firebase-admin.json');

admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const [, , email, password, nombre] = process.argv;

if (!email || !password || !nombre) {
  console.error('❌ Uso: node scripts/create-admin.js <email> <password> <nombre>');
  console.error('   Ejemplo: node scripts/create-admin.js admin@oldtexas.mx MiPass123 "Pedro Durán"');
  process.exit(1);
}

async function main() {
  console.log(`\n👤 Creando usuario admin: ${email}`);
  console.log('─'.repeat(50));

  // 1. Crear en Firebase Auth
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nombre,
      emailVerified: true,
    });
    console.log(`  ✅ Auth creado: ${userRecord.uid}`);
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`  ⏭  Auth ya existe: ${userRecord.uid}`);
    } else {
      throw err;
    }
  }

  // 2. Crear documento en Firestore
  const userRef = db.collection('usuarios').doc(userRecord.uid);
  const exists = (await userRef.get()).exists;

  if (exists) {
    console.log(`  ⏭  Documento Firestore ya existe — omitido`);
  } else {
    await userRef.set({
      uid: userRecord.uid,
      email,
      nombre,
      rol: 'admin',
      activo: true,
      fechaCreacion: FieldValue.serverTimestamp(),
      fechaActualizacion: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Documento Firestore creado`);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('✅ Usuario admin listo');
  console.log(`   Email:  ${email}`);
  console.log(`   Nombre: ${nombre}`);
  console.log(`   UID:    ${userRecord.uid}`);
  console.log(`   Rol:    admin\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
