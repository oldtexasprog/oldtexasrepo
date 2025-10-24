# Cloudinary Usage Guide

Guia completa de uso del sistema de almacenamiento de imagenes con Cloudinary.

## Tabla de Contenidos

1. [Importar Utilidades](#importar-utilidades)
2. [Upload de Imagenes](#upload-de-imagenes)
3. [Obtener URLs Optimizadas](#obtener-urls-optimizadas)
4. [Eliminar Imagenes](#eliminar-imagenes)
5. [Transformaciones](#transformaciones)
6. [Imagenes Responsive](#imagenes-responsive)
7. [Ejemplos Completos](#ejemplos-completos)

## Importar Utilidades

```typescript
// Importar funciones especificas
import {
  uploadProductImage,
  uploadComprobante,
  uploadUserPhoto,
  getOptimizedImageUrl,
  getThumbnailUrl,
  deleteImage,
  CloudinaryPresets,
} from '@/lib/cloudinary';

// O importar todo
import * as Cloudinary from '@/lib/cloudinary';
```

## Upload de Imagenes

### Upload de Producto

```typescript
import { uploadProductImage } from '@/lib/cloudinary';

const handleUploadProduct = async (file: File, productId: string) => {
  // Con callback de progreso
  const result = await uploadProductImage(file, productId, (progress) => {
    console.log(`Progreso: ${progress.toFixed(2)}%`);
    // Actualizar UI de progreso
  });

  if (result.success) {
    console.log('URL segura:', result.secureUrl);
    console.log('Public ID:', result.publicId);
    console.log('Dimensiones:', result.width, 'x', result.height);
    console.log('Formato:', result.format);
    console.log('Tamano:', result.bytes, 'bytes');
  } else {
    console.error('Error:', result.message);
    console.error('Detalles:', result.error);
  }
};
```

### Upload de Comprobante de Pago

```typescript
import { uploadComprobante } from '@/lib/cloudinary';

const handleUploadComprobante = async (file: File, pedidoId: string) => {
  const result = await uploadComprobante(file, pedidoId);

  if (result.success) {
    // Guardar URL en Firestore
    await updateDocument('pedidos', pedidoId, {
      comprobante_url: result.secureUrl,
      comprobante_public_id: result.publicId,
    });
  }
};
```

### Upload de Foto de Perfil

```typescript
import { uploadUserPhoto } from '@/lib/cloudinary';

const handleUploadAvatar = async (file: File, userId: string) => {
  const result = await uploadUserPhoto(file, userId);

  if (result.success) {
    // Actualizar perfil de usuario
    await updateUserProfile({
      photoURL: result.secureUrl,
    });
  }
};
```

### Upload Generico con Validacion

```typescript
import { prepareImageForUpload, uploadToCloudinary } from '@/lib/cloudinary';
import { CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

const handleGenericUpload = async (file: File) => {
  // 1. Validar y crear preview
  const validation = await prepareImageForUpload(file, [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  // Mostrar preview
  const previewImage = document.querySelector('#preview') as HTMLImageElement;
  previewImage.src = validation.preview!;

  // 2. Subir archivo
  const result = await uploadToCloudinary(file, {
    folder: CLOUDINARY_FOLDERS.PRODUCTOS,
    id: 'custom-id',
    tags: ['tag1', 'tag2'],
    context: {
      alt: 'Descripcion de la imagen',
      caption: 'Titulo de la imagen',
    },
  });

  if (result.success) {
    console.log('Imagen subida:', result.secureUrl);
  }
};
```

## Obtener URLs Optimizadas

### URL Optimizada Basica

```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

// Imagen optimizada con tamano maximo
const imageUrl = getOptimizedImageUrl(
  'old-texas-bbq/productos/prod-123/image',
  {
    width: 800,
    quality: 'auto',
  }
);

// <img src={imageUrl} alt="Producto" />
```

### Thumbnail Cuadrado

```typescript
import { getThumbnailUrl } from '@/lib/cloudinary';

// Thumbnail de 200x200px
const thumbnailUrl = getThumbnailUrl(
  'old-texas-bbq/productos/prod-123/image',
  200
);

// <img src={thumbnailUrl} alt="Thumbnail" />
```

### Presets Predefinidos

```typescript
import { CloudinaryPresets } from '@/lib/cloudinary';

const publicId = 'old-texas-bbq/productos/prod-123/image';

// Thumbnail para listados
const thumb = CloudinaryPresets.thumbnail(publicId, 150);

// Optimizada para web (max 1200px)
const web = CloudinaryPresets.webOptimized(publicId);

// Para dispositivos moviles (max 768px)
const mobile = CloudinaryPresets.mobile(publicId);

// Para tablet (max 1024px)
const tablet = CloudinaryPresets.tablet(publicId);

// Para desktop (max 1920px)
const desktop = CloudinaryPresets.desktop(publicId);

// Avatar circular con deteccion de rostro
const avatar = CloudinaryPresets.avatar(publicId, 120);
```

## Eliminar Imagenes

**IMPORTANTE:** La eliminacion requiere API Secret, por lo que debe hacerse desde el backend.

### Crear API Route para Eliminacion

```typescript
// app/api/cloudinary/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Public ID requerido' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: result.result === 'ok',
      result: result.result,
      message:
        result.result === 'ok'
          ? 'Imagen eliminada correctamente'
          : 'Imagen no encontrada',
    });
  } catch (error: any) {
    console.error('Error al eliminar imagen:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

### Usar Funcion de Eliminacion

```typescript
import { deleteImage } from '@/lib/cloudinary';

const handleDelete = async (publicId: string) => {
  const result = await deleteImage(publicId);

  if (result.success) {
    console.log('Imagen eliminada');
  } else {
    console.error('Error:', result.message);
  }
};
```

## Transformaciones

### Transformaciones Personalizadas

```typescript
import { buildCloudinaryUrl } from '@/lib/cloudinary';

const publicId = 'old-texas-bbq/productos/prod-123/image';

// Redimensionar manteniendo aspecto
const url1 = buildCloudinaryUrl(publicId, {
  width: 500,
  crop: 'scale',
  quality: 'auto',
  format: 'webp',
});

// Recortar al centro
const url2 = buildCloudinaryUrl(publicId, {
  width: 400,
  height: 400,
  crop: 'fill',
  gravity: 'center',
});

// Recortar enfocando rostros
const url3 = buildCloudinaryUrl(publicId, {
  width: 300,
  height: 300,
  crop: 'thumb',
  gravity: 'face',
});
```

### Transformar URL Existente

```typescript
import { transformCloudinaryUrl } from '@/lib/cloudinary';

const originalUrl = 'https://res.cloudinary.com/...';

// Aplicar nueva transformacion
const newUrl = transformCloudinaryUrl(originalUrl, {
  width: 600,
  quality: 80,
  format: 'webp',
});
```

## Imagenes Responsive

### Generar srcset

```typescript
import { generateSrcSet, generateSizes } from '@/lib/cloudinary';

const publicId = 'old-texas-bbq/productos/prod-123/image';

// Generar srcset para diferentes tamanos
const srcSet = generateSrcSet(publicId, [400, 800, 1200, 1600]);

// Generar sizes attribute
const sizes = generateSizes([
  { maxWidth: '640px', size: '100vw' },
  { maxWidth: '1024px', size: '50vw' },
  { maxWidth: '1536px', size: '33vw' },
]);

// Usar en componente
<img
  src={getOptimizedImageUrl(publicId, { width: 800 })}
  srcSet={srcSet}
  sizes={sizes}
  alt="Producto"
/>
```

### Componente React Responsive

```typescript
import { CloudinaryPresets, generateSrcSet } from '@/lib/cloudinary';

interface ResponsiveImageProps {
  publicId: string;
  alt: string;
  className?: string;
}

export const ResponsiveImage = ({
  publicId,
  alt,
  className,
}: ResponsiveImageProps) => {
  const srcSet = generateSrcSet(publicId, [400, 800, 1200]);
  const src = CloudinaryPresets.webOptimized(publicId);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};
```

## Ejemplos Completos

### Form de Upload con Preview

```typescript
'use client';

import { useState } from 'react';
import { uploadProductImage } from '@/lib/cloudinary';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const result = await uploadProductImage(
      file,
      'producto-123',
      (prog) => setProgress(prog)
    );

    setUploading(false);

    if (result.success) {
      setUploadedUrl(result.secureUrl!);
      alert('Imagen subida correctamente');
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="max-w-xs" />
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 h-4 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>{progress.toFixed(2)}%</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {uploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-bold">URL de la imagen:</p>
          <a href={uploadedUrl} target="_blank" className="text-blue-500">
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
```

### Galeria de Imagenes

```typescript
import { CloudinaryPresets } from '@/lib/cloudinary';

interface ImageGalleryProps {
  images: Array<{ id: string; publicId: string; alt: string }>;
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square">
          <img
            src={CloudinaryPresets.thumbnail(image.publicId, 300)}
            alt={image.alt}
            className="w-full h-full object-cover rounded"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
```

## Best Practices

1. **Siempre valida archivos antes de subir:**

   ```typescript
   const validation = await prepareImageForUpload(file, allowedTypes);
   if (!validation.valid) {
     // Manejar error
   }
   ```

2. **Usa transformaciones para optimizar:**
   - Siempre especifica `quality: 'auto'`
   - Usa `fetch_format: 'auto'` para formato automatico (WebP cuando sea posible)
   - Limita el tamano maximo con `width` y `height`

3. **Guarda el public_id en Firestore:**

   ```typescript
   await updateDocument('productos', productId, {
     imagen_url: result.secureUrl,
     imagen_public_id: result.publicId, // Para eliminar despues
   });
   ```

4. **Elimina imagenes no utilizadas:**

   ```typescript
   // Al eliminar un producto
   if (producto.imagen_public_id) {
     await deleteImage(producto.imagen_public_id);
   }
   ```

5. **Usa lazy loading:**
   ```html
   <img src="..." loading="lazy" />
   ```

## Recursos

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
