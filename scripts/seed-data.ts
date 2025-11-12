/**
 * Script para crear datos de prueba en Firestore
 * Old Texas BBQ - CRM
 *
 * Ejecutar con: npm run seed
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  connectFirestoreEmulator,
} from 'firebase/firestore';

// Cargar variables de entorno desde .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuración para mejorar la conexión (forzar REST en lugar de gRPC si hay problemas)
// @ts-ignore - Configuración experimental para evitar errores de gRPC
db._settings = { ...db._settings, experimentalForceLongPolling: true };

// Datos de prueba
const categorias = [
  {
    nombre: 'Hamburguesas',
    descripcion: 'Deliciosas hamburguesas BBQ',
    icono: '🍔',
    orden: 1,
    activo: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Costillas',
    descripcion: 'Costillas ahumadas',
    icono: '🍖',
    orden: 2,
    activo: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Bebidas',
    descripcion: 'Refrescos y bebidas',
    icono: '🥤',
    orden: 3,
    activo: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Guarniciones',
    descripcion: 'Acompañamientos',
    icono: '🍟',
    orden: 4,
    activo: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const productos = [
  // Hamburguesas
  {
    nombre: 'Texas Burger',
    descripcion: 'Hamburguesa con tocino ahumado, queso cheddar y salsa BBQ',
    precio: 120,
    categoriaId: '', // Se llenará después
    categoriaNombre: 'Hamburguesas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    orden: 1,
    personalizaciones: {
      salsas: ['BBQ', 'Picante', 'Ranch'],
      extras: ['Queso extra', 'Tocino', 'Aguacate'],
      presentaciones: ['Para llevar', 'Para aquí'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'BBQ Classic',
    descripcion: 'Hamburguesa clásica con carne ahumada y vegetales frescos',
    precio: 100,
    categoriaId: '',
    categoriaNombre: 'Hamburguesas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    orden: 2,
    personalizaciones: {
      salsas: ['BBQ', 'Chipotle', 'Miel Mostaza'],
      extras: ['Queso extra', 'Cebolla caramelizada', 'Jalapeños'],
      presentaciones: ['Para llevar', 'Para aquí'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Smokey Deluxe',
    descripcion: 'Hamburguesa premium con doble carne y queso',
    precio: 150,
    categoriaId: '',
    categoriaNombre: 'Hamburguesas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400',
    orden: 3,
    personalizaciones: {
      salsas: ['BBQ', 'Habanero', 'Ajo'],
      extras: ['Queso extra', 'Tocino', 'Aguacate', 'Champiñones'],
      presentaciones: ['Para llevar', 'Para aquí'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Costillas
  {
    nombre: 'Costillas BBQ',
    descripcion: 'Costillas de cerdo ahumadas con salsa BBQ',
    precio: 200,
    categoriaId: '',
    categoriaNombre: 'Costillas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    orden: 4,
    personalizaciones: {
      salsas: ['BBQ', 'Picante', 'Miel Mostaza'],
      extras: [],
      presentaciones: ['Para llevar', 'Para aquí', 'En caja'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Costillas Picantes',
    descripcion: 'Costillas con salsa habanero extra picante',
    precio: 220,
    categoriaId: '',
    categoriaNombre: 'Costillas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
    orden: 5,
    personalizaciones: {
      salsas: ['Habanero', 'Chipotle', 'Picante'],
      extras: [],
      presentaciones: ['Para llevar', 'Para aquí', 'En caja'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Bebidas
  {
    nombre: 'Coca Cola',
    descripcion: 'Refresco 355ml',
    precio: 25,
    categoriaId: '',
    categoriaNombre: 'Bebidas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    orden: 6,
    personalizaciones: {
      salsas: [],
      extras: [],
      presentaciones: ['Fría', 'Natural'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Agua Mineral',
    descripcion: 'Agua embotellada 500ml',
    precio: 20,
    categoriaId: '',
    categoriaNombre: 'Bebidas',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    orden: 7,
    personalizaciones: {
      salsas: [],
      extras: [],
      presentaciones: ['Fría', 'Natural'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  // Guarniciones
  {
    nombre: 'Papas Fritas',
    descripcion: 'Papas fritas crujientes con sal',
    precio: 40,
    categoriaId: '',
    categoriaNombre: 'Guarniciones',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    orden: 8,
    personalizaciones: {
      salsas: ['BBQ', 'Ranch', 'Chipotle'],
      extras: ['Queso extra'],
      presentaciones: ['Para llevar', 'Para aquí'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Aros de Cebolla',
    descripcion: 'Aros de cebolla empanizados',
    precio: 45,
    categoriaId: '',
    categoriaNombre: 'Guarniciones',
    disponible: true,
    imagen: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400',
    orden: 9,
    personalizaciones: {
      salsas: ['Ranch', 'Chipotle', 'BBQ'],
      extras: [],
      presentaciones: ['Para llevar', 'Para aquí'],
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const repartidores = [
  {
    nombre: 'Carlos Méndez',
    telefono: '5551234567',
    vehiculo: 'Moto Honda',
    placas: 'ABC-123',
    disponible: true,
    activo: true,
    comisionPorcentaje: 10,
    pedidosEntregados: 0,
    calificacionPromedio: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Luis Rodríguez',
    telefono: '5559876543',
    vehiculo: 'Moto Yamaha',
    placas: 'XYZ-789',
    disponible: true,
    activo: true,
    comisionPorcentaje: 10,
    pedidosEntregados: 0,
    calificacionPromedio: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    nombre: 'Miguel Torres',
    telefono: '5554445566',
    vehiculo: 'Bicicleta',
    placas: 'N/A',
    disponible: false,
    activo: true,
    comisionPorcentaje: 12,
    pedidosEntregados: 0,
    calificacionPromedio: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function seedData() {
  try {
    console.log('🌱 Iniciando seed de datos...\n');

    // 1. Crear categorías
    console.log('📁 Creando categorías...');
    const categoriaIds: { [key: string]: string } = {};

    for (const categoria of categorias) {
      const docRef = await addDoc(collection(db, 'categorias'), categoria);
      categoriaIds[categoria.nombre] = docRef.id;
      console.log(`   ✓ ${categoria.nombre} - ID: ${docRef.id}`);
    }

    // 2. Crear productos
    console.log('\n🍔 Creando productos...');
    for (const producto of productos) {
      const productoConCategoria = {
        ...producto,
        categoriaId: categoriaIds[producto.categoriaNombre] || '',
      };
      const docRef = await addDoc(collection(db, 'productos'), productoConCategoria);
      console.log(`   ✓ ${producto.nombre} - $${producto.precio} - ID: ${docRef.id}`);
    }

    // 3. Crear repartidores
    console.log('\n🛵 Creando repartidores...');
    for (const repartidor of repartidores) {
      const docRef = await addDoc(collection(db, 'repartidores'), repartidor);
      console.log(`   ✓ ${repartidor.nombre} - ${repartidor.vehiculo} - ID: ${docRef.id}`);
    }

    console.log('\n✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - ${categorias.length} categorías creadas`);
    console.log(`   - ${productos.length} productos creados`);
    console.log(`   - ${repartidores.length} repartidores creados`);
    console.log('\n🎉 Ahora puedes probar el formulario en: http://localhost:3001/pedidos/nuevo\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seedData();
