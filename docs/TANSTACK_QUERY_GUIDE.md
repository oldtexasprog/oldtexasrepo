# 🚀 Guía de TanStack Query para Firebase

Esta guía explica cómo usar TanStack Query (React Query) para consumir Firebase de manera óptima en producción.

## 📦 Instalación

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

✅ Ya instalado en el proyecto

## ⚙️ Configuración

### 1. QueryClient ([lib/react-query/client.ts](../lib/react-query/client.ts))

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min - datos frescos
      gcTime: 1000 * 60 * 30, // 30 min - garbage collection
      retry: 3, // Reintentar 3 veces
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
```

### 2. Provider ([lib/react-query/provider.tsx](../lib/react-query/provider.tsx))

Envuelve tu app en el provider (ya configurado en `app/layout.tsx`):

```typescript
import { ReactQueryProvider } from '@/lib/react-query/provider';

<ReactQueryProvider>
  {children}
</ReactQueryProvider>
```

## 🎣 Uso de Hooks

### Queries (Lectura de Datos)

#### useOrders - Lista de pedidos con filtros

```typescript
import { useOrders } from '@/lib/hooks/useOrders';

function OrdersPage() {
  const { data, isLoading, error } = useOrders({
    estado: 'recibido',
    limit: 20,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

#### useOrder - Pedido individual

```typescript
import { useOrder } from '@/lib/hooks/useOrders';

function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) return <Skeleton />;
  if (!order) return <NotFound />;

  return <OrderDetails order={order} />;
}
```

#### useTodayOrders - Pedidos de hoy (refetch automático)

```typescript
import { useTodayOrders } from '@/lib/hooks/useOrders';

function TodayDashboard() {
  // Se actualiza automáticamente cada 60 segundos
  const { data: orders } = useTodayOrders();

  return <OrdersList orders={orders} />;
}
```

### Mutations (Escritura de Datos)

#### useCreateOrder - Crear pedido

```typescript
import { useCreateOrder } from '@/lib/hooks/useOrders';

function CreateOrderForm() {
  const { mutate, isPending } = useCreateOrder();

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: (newOrderId) => {
        console.log('Pedido creado:', newOrderId);
        router.push(`/orders/${newOrderId}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos */}
      <button disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear Pedido'}
      </button>
    </form>
  );
}
```

#### useUpdateOrder - Actualizar pedido (con optimistic updates)

```typescript
import { useUpdateOrder } from '@/lib/hooks/useOrders';

function OrderCard({ order }) {
  const { mutate: updateOrder } = useUpdateOrder();

  const handleUpdate = () => {
    updateOrder({
      id: order.id,
      data: { observaciones: 'Sin cebolla' },
    });
    // UI se actualiza INMEDIATAMENTE (optimistic)
    // Si falla, se revierte automáticamente
  };

  return <button onClick={handleUpdate}>Actualizar</button>;
}
```

#### useUpdateOrderStatus - Cambiar estado

```typescript
import { useUpdateOrderStatus } from '@/lib/hooks/useOrders';

function KitchenCard({ order }) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const markAsReady = () => {
    updateStatus({
      id: order.id,
      newStatus: 'listo',
    });
  };

  return (
    <button onClick={markAsReady} disabled={isPending}>
      Marcar como Listo
    </button>
  );
}
```

## 📊 Patrones Avanzados

### 1. Prefetching (Mejorar UX)

```typescript
import { prefetchOrders } from '@/lib/react-query/utils';

// En mouseover de botón, prefetch datos
<Link
  href="/orders"
  onMouseEnter={() => prefetchOrders()}
>
  Ver Pedidos
</Link>
```

### 2. Infinite Queries (Paginación Infinita)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteOrders() {
  return useInfiniteQuery({
    queryKey: ['orders', 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      orderService.getPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

// Uso
const { data, fetchNextPage, hasNextPage } = useInfiniteOrders();

<button onClick={() => fetchNextPage()}>
  Cargar Más
</button>
```

### 3. Dependent Queries (Queries Dependientes)

```typescript
// Primero obtener orden
const { data: order } = useOrder(orderId);

// Luego obtener datos del cliente (depende de order)
const { data: customer } = useQuery({
  queryKey: ['customer', order?.cliente.telefono],
  queryFn: () => getCustomer(order!.cliente.telefono),
  enabled: !!order, // Solo ejecutar si existe order
});
```

### 4. Parallel Queries (Queries en Paralelo)

```typescript
function Dashboard() {
  // Se ejecutan en paralelo automáticamente
  const ordersQuery = useOrders();
  const todayQuery = useTodayOrders();
  const statsQuery = useStats();

  const isLoading = ordersQuery.isLoading ||
                   todayQuery.isLoading ||
                   statsQuery.isLoading;

  if (isLoading) return <Loading />;

  return (
    <div>
      <Stats data={statsQuery.data} />
      <TodayOrders data={todayQuery.data} />
      <AllOrders data={ordersQuery.data} />
    </div>
  );
}
```

## ⚡ Optimizaciones para Producción

### 1. Stale Time Apropiado

```typescript
// Datos que cambian poco
useQuery({
  queryKey: ['products'],
  queryFn: getProducts,
  staleTime: 1000 * 60 * 30, // 30 minutos
});

// Datos que cambian frecuentemente
useQuery({
  queryKey: ['orders', 'live'],
  queryFn: getLiveOrders,
  staleTime: 1000 * 30, // 30 segundos
});
```

### 2. Refetch Interval para Real-time

```typescript
// Simulación de real-time
useTodayOrders(); // Ya tiene refetchInterval: 60s configurado

// O custom:
useQuery({
  queryKey: ['kitchen', 'active'],
  queryFn: getActiveOrders,
  refetchInterval: 5000, // Cada 5 segundos
});
```

### 3. Select para Transformar Datos

```typescript
const pendingCount = useOrders({
  select: (data) => data.filter((o) => o.estado === 'recibido').length,
});

// Solo re-renderiza si el COUNT cambia, no si cambia cualquier pedido
```

### 4. Placeholders para Mejor UX

```typescript
const { data = [] } = useOrders(); // Valor por defecto

// O con placeholder data
useQuery({
  queryKey: ['orders'],
  queryFn: getOrders,
  placeholderData: [], // Mostrar array vacío mientras carga
});
```

## 🐛 DevTools

En desarrollo, los DevTools están activos automáticamente.

**Acceso**: Click en el ícono flotante de React Query (esquina inferior)

**Features**:

- Ver todas las queries y su estado
- Inspeccionar data en cache
- Trigger refetch manual
- Ver query keys
- Timeline de queries

## 📝 Best Practices

### ✅ Hacer

1. **Usar Query Keys consistentes**

   ```typescript
   // Definir keys en un solo lugar
   export const orderKeys = {
     all: ['orders'] as const,
     list: (filters) => [...orderKeys.all, 'list', filters],
     detail: (id) => [...orderKeys.all, 'detail', id],
   };
   ```

2. **Invalidar correctamente**

   ```typescript
   // Invalidar queries relacionadas después de mutation
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: orderKeys.all });
   };
   ```

3. **Manejar estados**

   ```typescript
   if (isLoading) return <Skeleton />;
   if (error) return <Error error={error} />;
   if (!data) return <Empty />;
   return <Content data={data} />;
   ```

4. **Optimistic Updates para mejor UX**

   ```typescript
   // Ver ejemplo en useUpdateOrder
   onMutate: async ({ id, data }) => {
     // Cancelar queries
     await queryClient.cancelQueries({ queryKey: ['order', id] });

     // Actualizar cache
     queryClient.setQueryData(['order', id], (old) => ({ ...old, ...data }));

     // Snapshot para rollback
     return { previous };
   },
   onError: (err, vars, context) => {
     // Rollback
     queryClient.setQueryData(['order', id], context.previous);
   },
   ```

### ❌ Evitar

1. **NO hacer fetch en useEffect**

   ```typescript
   // ❌ MALO
   useEffect(() => {
     fetchOrders().then(setOrders);
   }, []);

   // ✅ BUENO
   const { data: orders } = useOrders();
   ```

2. **NO duplicar estado**

   ```typescript
   // ❌ MALO
   const { data } = useOrders();
   const [orders, setOrders] = useState(data);

   // ✅ BUENO
   const { data: orders } = useOrders();
   ```

3. **NO ignorar loading/error states**

   ```typescript
   // ❌ MALO
   const { data } = useOrders();
   return <div>{data.map(...)}</div>; // Crash si loading/error

   // ✅ BUENO
   const { data, isLoading, error } = useOrders();
   if (isLoading) return <Loading />;
   if (error) return <Error />;
   return <div>{data.map(...)}</div>;
   ```

## 📚 Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Ejemplos del proyecto](../lib/hooks/useOrders.ts)
- [Componente ejemplo](../components/orders/OrderList.tsx)

---

**TanStack Query configurado y listo para producción** 🚀
