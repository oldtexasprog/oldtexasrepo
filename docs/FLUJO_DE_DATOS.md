# 🔄 Diagramas de Flujo de Datos - Old Texas BBQ CRM

Este documento contiene los diagramas de flujo principales del sistema usando sintaxis Mermaid.

---

## 📦 1. Flujo Completo de Pedido

```mermaid
sequenceDiagram
    participant C as Cliente
    participant Caj as Cajera
    participant DB as Firestore
    participant Coc as Cocina
    participant Rep as Repartidor
    participant Not as Notificaciones

    C->>Caj: Realiza pedido (WhatsApp/Mostrador/Web)
    Caj->>Caj: Captura datos del pedido
    Caj->>DB: Crea pedido (estado: pendiente)
    DB-->>Not: Trigger notificación
    Not->>Coc: Notifica nuevo pedido

    Coc->>Coc: Visualiza en Tablero Kanban
    Coc->>DB: Cambia estado → en_preparacion
    DB-->>Coc: Actualización en tiempo real

    Coc->>DB: Cambia estado → listo
    DB-->>Not: Trigger notificación
    Not->>Rep: Notifica pedido listo

    Rep->>Rep: Ve pedidos listos
    Rep->>DB: Acepta pedido
    DB->>DB: Asigna repartidor + comisión
    DB->>DB: Cambia estado → en_reparto

    Rep->>C: Entrega pedido
    Rep->>DB: Marca como entregado
    DB-->>Not: Trigger notificación
    Not->>Caj: Notifica pedido entregado

    Caj->>DB: Verifica liquidación pendiente
    Caj->>DB: Marca como liquidado
```

---

## 🔐 2. Flujo de Autenticación

```mermaid
graph TD
    A[Usuario Ingresa Credenciales] --> B{Validar Email/Password}
    B -->|Válido| C[Firebase Auth]
    B -->|Inválido| A

    C --> D[Obtener UID]
    D --> E[Buscar Usuario en Firestore]

    E --> F{Usuario Existe?}
    F -->|No| G[Error: Usuario no encontrado]
    F -->|Sí| H{Usuario Activo?}

    H -->|No| I[Error: Usuario desactivado]
    H -->|Sí| J[Obtener Rol]

    J --> K[Crear Sesión JWT]
    K --> L[Guardar en Cookie httpOnly]
    L --> M[Actualizar ultimaConexion]
    M --> N[Guardar FCM Token]
    N --> O[Redirigir a Dashboard]

    O --> P{Rol?}
    P -->|Cajera| Q[/pedidos]
    P -->|Cocina| R[/cocina]
    P -->|Repartidor| S[/reparto]
    P -->|Encargado/Admin| T[/dashboard]
```

---

## 🔔 3. Flujo de Notificaciones

```mermaid
graph TD
    A[Evento en Sistema] --> B{Tipo de Evento}

    B -->|Nuevo Pedido| C[Notificar Cocina]
    B -->|Pedido Listo| D[Notificar Repartidores]
    B -->|Pedido Entregado| E[Notificar Cajera]
    B -->|Retraso >30min| F[Notificar Encargado]
    B -->|Incidencia| G[Notificar Encargado]

    C --> H[Obtener Usuarios por Rol]
    D --> H
    E --> H
    F --> H
    G --> H

    H --> I[Obtener FCM Tokens]
    I --> J[Crear Notificación en Firestore]
    J --> K[Enviar Push via FCM]

    K --> L{Usuario Online?}
    L -->|Sí| M[Notificación In-App]
    L -->|No| N[Push Notification]

    M --> O[Mostrar Toast]
    N --> P[Badge en Navegador]

    O --> Q[Usuario hace clic]
    P --> Q
    Q --> R[Marcar como leída]
    R --> S[Navegar a contexto]
```

---

## 💰 4. Flujo de Corte de Caja

```mermaid
graph TD
    A[Inicio de Turno] --> B[Cajera abre turno]
    B --> C[Registra fondo inicial]
    C --> D[Selecciona tipo: matutino/vespertino]
    D --> E[Crear Turno en Firestore]

    E --> F[Durante el Turno]
    F --> G[Cajera crea pedidos]
    G --> H[Pedidos se vinculan a turnoId]

    H --> I[Fin de Turno]
    I --> J{Pedidos Pendientes?}
    J -->|Sí| K[Error: Completar todos los pedidos]
    J -->|No| L[Encargado cierra turno]

    L --> M[Contar efectivo real]
    M --> N[Calcular automático desde Firestore]

    N --> O[Efectivo esperado]
    N --> P[Ventas por método de pago]
    N --> Q[Total comisiones repartidores]

    O --> R{Efectivo real == esperado?}
    R -->|Sí| S[Cuadre perfecto]
    R -->|No| T[Calcular diferencia]

    T --> U{Diferencia}
    U -->|Positivo| V[Sobrante]
    U -->|Negativo| W[Faltante]

    S --> X[Registrar corte]
    V --> X
    W --> X

    X --> Y[Agregar observaciones]
    Y --> Z[Cerrar turno en Firestore]
    Z --> AA[Generar PDF del corte]
    AA --> AB[Descargar/Imprimir]
```

---

## 🍔 5. Flujo de Gestión de Productos

```mermaid
graph TD
    A[Admin/Encargado] --> B{Acción}

    B -->|Crear| C[Abrir Modal Crear]
    B -->|Editar| D[Abrir Modal Editar]
    B -->|Eliminar| E{Verificar uso}
    B -->|Toggle| F[Cambiar disponibilidad]

    C --> G[Completar Formulario]
    G --> H[Seleccionar Categoría]
    H --> I[Subir Imagen a Cloudinary]
    I --> J[Obtener URL]
    J --> K[Validar Datos]
    K --> L[Guardar en Firestore]
    L --> M[Actualización Realtime]
    M --> N[Selector de Productos se actualiza]

    D --> O[Cargar datos actuales]
    O --> G

    E -->|En pedidos activos| P[Bloquear eliminación]
    E -->|No en uso| Q[Soft Delete]
    Q --> R[eliminado: true]

    F --> S{Estado actual}
    S -->|Disponible| T[Marcar no disponible]
    S -->|No disponible| U[Marcar disponible]
    T --> M
    U --> M
```

---

## 🚚 6. Flujo de Reparto y Liquidación

```mermaid
stateDiagram-v2
    [*] --> Listo: Cocina marca listo

    Listo --> Asignado: Repartidor acepta

    state Asignado {
        [*] --> Validando: Verificar datos
        Validando --> Guardando: Asignar repartidorId
        Guardando --> Calculando: Calcular comisión
        Calculando --> [*]
    }

    Asignado --> EnReparto: Salida del local

    state EnReparto {
        [*] --> EnCamino: GPS tracking
        EnCamino --> LlegandoDestino
        LlegandoDestino --> [*]
    }

    EnReparto --> Entregado: Confirmar entrega

    state Entregado {
        [*] --> RegistrarHora: Timestamp
        RegistrarHora --> NotificarCajera
        NotificarCajera --> [*]
    }

    Entregado --> PendienteLiquidacion: liquidado: false

    state PendienteLiquidacion {
        [*] --> CalcularMonto: total - comisión
        CalcularMonto --> MostrarEnPanel
        MostrarEnPanel --> [*]
    }

    PendienteLiquidacion --> Liquidado: Cajera liquida

    state Liquidado {
        [*] --> MarcarLiquidado: liquidado: true
        MarcarLiquidado --> RegistrarFecha: fechaLiquidacion
        RegistrarFecha --> ActualizarSaldo: saldoPendiente -= monto
        ActualizarSaldo --> [*]
    }

    Liquidado --> [*]

    note right of Asignado
        Se guarda:
        - repartidorId
        - repartidorNombre
        - comisionRepartidor
        - horaAsignacion
    end note

    note right of Liquidado
        El repartidor entrega:
        total - comisión
    end note
```

---

## 🔄 7. Flujo de Sincronización en Tiempo Real

```mermaid
graph LR
    A[Firestore] -->|onSnapshot| B[BaseService]
    B -->|Listener| C[onCollectionChange]
    C -->|Callback| D[Custom Hook]
    D -->|setState| E[Componente React]

    E -->|User Action| F[Service Method]
    F -->|Update/Create/Delete| A

    A -->|Real-time Update| B

    style A fill:#FF6B6B
    style B fill:#4ECDC4
    style E fill:#95E1D3
    style F fill:#F38181
```

---

## 🎯 8. Flujo de Permisos por Rol

```mermaid
graph TD
    A[Usuario Autenticado] --> B{Verificar Rol}

    B -->|Admin| C[Acceso Total]
    B -->|Encargado| D[Supervisión + Operación]
    B -->|Cajera| E[Pedidos + Caja]
    B -->|Cocina| F[Solo Vista Comandas]
    B -->|Repartidor| G[Solo Reparto]

    C --> H[Todos los Módulos]
    C --> I[Gestión de Usuarios]
    C --> J[Configuración]

    D --> K[Pedidos]
    D --> L[Reportes]
    D --> M[Corte de Caja]
    D --> N[Productos]

    E --> K
    E --> M
    E --> O[Bitácora]

    F --> P[Ver Comandas]
    F --> Q[Cambiar Estado Pedido]

    G --> R[Ver Pedidos Asignados]
    G --> S[Marcar Entregado]
    G --> T[Reportar Incidencia]

    style C fill:#FFD93D
    style D fill:#6BCB77
    style E fill:#4D96FF
    style F fill:#FF6B9D
    style G fill:#C3BEF0
```

---

## ⏱️ 9. Flujo de Monitoreo de Retrasos

```mermaid
graph TD
    A[Hook: useMonitorRetrasos] --> B[Interval: cada 10 min]
    B --> C[Query pedidos pendientes y en_preparacion]

    C --> D{Para cada pedido}
    D --> E[Calcular tiempo transcurrido]

    E --> F{Tiempo > 30 min?}
    F -->|No| G[Continuar]
    F -->|Sí| H[Obtener numeroPedido]

    H --> I[Crear Notificación]
    I --> J[Enviar a Encargado + Admin]

    J --> K[Tipo: alerta]
    K --> L[Prioridad: urgente]
    L --> M[Incluir pedidoId]

    M --> N[Guardar en Firestore]
    N --> O[Push via FCM]

    O --> P[Encargado recibe alerta]
    P --> Q{Tomar acción}
    Q -->|Revisar| R[Ver detalles pedido]
    Q -->|Contactar| S[Llamar a cocina]

    G --> T[Siguiente iteración]
    R --> T
    S --> T
```

---

**Nota**: Estos diagramas son visualizables en GitHub, VS Code con extensión Mermaid, y muchas herramientas markdown modernas.

**Última actualización**: Enero 2026
**Versión**: 1.0
