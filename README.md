# Email Builder — Gravity

Herramienta interna para armar mailings HTML por marca, bloque a bloque. Desplegada en GitHub Pages.

## Acceso

[https://devser8.github.io/email-assets/](https://devser8.github.io/email-assets/)

## Estructura del proyecto

```
email-assets/
├── index.html        # Shell HTML (estilos globales + carga de scripts)
├── js/
│   └── app.js        # Lógica completa de la app (React + JSX via Babel)
├── img/              # Imágenes subidas desde la herramienta vía GitHub API
└── README.md
```

## Marcas configuradas

| Marca | Estado |
|---|---|
| Colchones Spring | ✅ Listo |
| Challenger | ✅ Listo |
| Suárez | ⏳ Pendiente |
| Gallery | ⏳ Pendiente |
| Almacenes Sí | ⏳ Pendiente |
| Rosen | ⏳ Pendiente |
| Spring Step | ⏳ Pendiente |
| Tramontina | ⏳ Pendiente |

## Cómo agregar o actualizar una marca

Editar `js/app.js`, en el objeto `BRANDS`. Cada marca tiene:

```js
nombre_clave: {
  label: "Nombre visible",
  color: "#hexcolor",           // color del selector en la UI
  // pending: true,             // muestra punto naranja si aún no está listo
  generateHeader: (utm) => `...html...`,
  generateFooter: (utm) => `...html...`,
  headerStyle: `...css...`,     // estilos del <header> y <footer> del email generado
}
```

Usar `addUtm(url, utm)` dentro de los templates para agregar parámetros UTM automáticamente.

## Bloques disponibles

- **Banner 100%** — imagen ancho completo con link
- **Productos** — 1 o más productos lado a lado
- **Contador** — cuenta regresiva con timer de mmgo.io
- **Cenefa** — imagen decorativa ancho completo (link opcional)

## Configuración inicial (primer uso)

La herramienta requiere un GitHub Personal Access Token con permisos de `repo` para subir imágenes. Se guarda en `localStorage` del navegador.

1. Ir a **github.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
2. Generar token con scope `repo`
3. Pegarlo en la pantalla de configuración de la herramienta
