# Cómo editar una unidad

Cada unidad tiene **un solo archivo**: `assets/data/unidades/unidad-XX.json`.
La página `unidades/unidad-XX/index.html` y la tarjeta en `unidades.html` se generan solas a partir de ese archivo. **No hay que tocar HTML.**

## Campos

| Campo | Qué es |
|---|---|
| `numero` | Número de la unidad (1, 2, 3…). El numeral romano se calcula solo. |
| `titulo` | Nombre de la unidad. |
| `descripcion` | Texto breve que aparece en la tarjeta de `unidades.html`. |
| `lema` | Línea bajo el título de la página de la unidad. |
| `duracion_horas` | Solo el número (ej. `27`). |
| `introduccion` | Lista de párrafos: `["Párrafo 1", "Párrafo 2"]`. |
| `recorrido` | Texto que explica el orden de los temas. |
| `temas` | Lista de temas; cada uno incluye su actividad (ver abajo). |
| `actividad_final` | `nombre`, `descripcion`, `url`. |
| `objetivo` | Objetivo de la unidad (panel derecho). |
| `competencias` | Lista de competencias (panel derecho). |
| `video` | `titulo` y `url` *embed* de YouTube (`https://www.youtube.com/embed/...`). Aparece en "Material de apoyo". Déjalo en `""` para ocultarlo. |
| `material_apoyo` | Lista de enlaces: `nombre`, `url`. |

Cada tema (con su actividad de aprendizaje):

```json
{
  "numero": "1.2",
  "nombre": "Nombre del tema",
  "sintesis": "Una línea que resume el tema.",
  "url": "unidades/unidad-01/temas/tema-01-02.html",
  "actividad": {
    "nombre": "Actividad de aprendizaje 1.2",
    "url": "unidades/unidad-01/actividades/actividad-1-2.html"
  }
}
```

- Si la página del tema todavía no existe, deja `"url": ""`: el tema aparecerá como **Próximamente** y **su actividad también se bloquea**.
- Si un tema no tiene actividad, simplemente borra el bloque `"actividad"`.
- Opcional: `"icono": "fa-network-wired"` cambia el ícono del tema en la vista de tarjetas (nombres de https://fontawesome.com/v6/icons).
- Los enlaces se escriben **desde la raíz del sitio** (empiezan con `unidades/...`).
- Si agregas o quitas un tema o actividad, los contadores se actualizan solos.

## Crear o editar la página de un tema

Los temas usan la plantilla de `unidades/unidad-01/temas/tema-01-01.html` (estilos en `assets/css/tema.css`).
El **contenido** del tema se escribe en el HTML; el **índice lateral** de la unidad y los botones
"Tema anterior" / "Ir a la actividad" se generan solos a partir del JSON de la unidad.

1. Copia `tema-01-01.html` con el nombre del nuevo tema (ej. `tema-01-02.html`).
2. En `<body>` cambia `data-unidad="unidad-01"` y `data-tema="1.2"` (debe coincidir con `"numero"` del tema en el JSON).
3. Cambia las migas de pan, el `<title>`, la línea `Unidad I · Tema 1.2` y el `<h1>`.
4. Escribe el contenido dentro de `<div class="t-prose">`. Piezas disponibles:
   - `<p class="t-lead">`: entradilla (idea central del tema).
   - `<section id="..." data-toc="1.2.1 Nombre">` con un `<h2>`: subtema.
   - `<figure class="t-figure">`: figura o simulador, con `<figcaption>`.
     Sin `style="..."`; el tamaño se controla con `t-figure--narrow` (480 px) o `t-figure--small` (340 px):
     ```html
     <figure class="t-figure" data-ampliable>
       <figcaption><span class="t-figure__titulo">Título de la figura</span></figcaption>
       <div class="t-figure__media"><img src="../../../assets/img/archivo.jpg" alt="Descripción"></div>
       <p class="t-figure__nota"><em>Nota.</em> Elaboración propia con base en …</p>
     </figure>
     ```
     - El número (**Figura 1.1, 1.2…**) se pone solo: `tema-plantilla.js` cuenta las figuras de los temas
       anteriores de la unidad. **No lo escribas a mano.** Para una figura sin número: `data-sin-numero`.
     - Si el documento fuente trae su propia numeración, fíjala con `data-numero="11"` (se muestra **Figura 11**);
       las figuras siguientes, en ese tema y en los posteriores, continúan solas (12, 13…).
     - `data-ampliable` permite abrir la imagen en el visor con zoom. La nota (`t-figure__nota`) es opcional.
     - Si la imagen todavía no está lista, deja en `t-figure__media` un espacio reservado; al tener la imagen,
       cámbialo por el `<img>` (conviene dejar comentado junto al espacio el `<img>` con la ruta y el `alt` previstos):
       ```html
       <div class="t-figure__placeholder">
         <i class="fas fa-image" aria-hidden="true"></i>
         <span>Espacio reservado para la imagen</span>
       </div>
       ```
   - `<aside class="t-callout t-callout--note">` / `t-callout--example`: nota o ejemplo.
   - `<div class="t-table"><table>…</table></div>`: tabla.
     En una celda: `class="t-key"` la pone en negritas; `t-ok`, `t-bad`, `t-warn`, `t-info` o `t-accent` le dan color.
   - `<div class="t-grid">` con `<div class="t-card">` adentro: tarjetas en columnas (`t-grid--sm` para columnas más angostas,
     `t-stack` para apilarlas). Variantes: `t-card--top` / `t-card--side` (barra de color) y `t-card--ok` / `--bad` / `--warn` / `--info`.
   - `<ul class="t-icon-list">`: lista con un ícono al inicio de cada punto (el ícono puede llevar `t-ok`, `t-bad`…).
   - **No uses `style="..."`**: si hace falta un estilo nuevo, agrégalo como clase en `assets/css/tema.css`.
   - `<section class="t-video">`: video; su botón lleva `data-video="https://www.youtube.com/embed/..."` (vacío = "Próximamente").
5. Todo elemento con `id` y `data-toc="Texto"` aparece en **"En esta página"**.
6. En el JSON de la unidad pon la `url` del tema (ej. `"unidades/unidad-01/temas/tema-01-02.html"`) para desbloquearlo.

## Crear o editar una actividad de aprendizaje

Todas las actividades usan la misma plantilla, adaptada de `Libro-Apli-Com-Red` (ver `unidades/unidad-02/actividades/actividad-2-1.html`
o `unidades/unidad-03/actividades/actividad-3-1.html`; lógica en `assets/js/paginas/actividad-plantilla.js`,
estilos en `assets/css/actividad.css`). **Las preguntas viven en un JSON**; el ejercicio, "Otras actividades"
y la navegación se generan solos.

1. Copia una actividad existente con el nombre nuevo (ej. `unidades/unidad-01/actividades/actividad-1-5.html`).
2. En `<body>` cambia:
   - `data-unidad` y `data-tema` (el tema al que pertenece la actividad).
   - `data-preguntas`: banco de preguntas, escrito desde la raíz. Los bancos van en
     `assets/data/preguntas/unidad-XX/` (ej. `assets/data/preguntas/unidad-01/actividad-1-5.json`).
   - `data-cantidad`: cuántas preguntas se toman al azar en cada intento (las de U2, U3 y U4 usan 8 de un banco de 12; las de U1 y U5 usan las 10 preguntas de su banco).
3. Cambia las migas de pan, el `<title>`, el `<h1>` y el texto del propósito.
4. En `assets/data/unidades/unidad-XX.json` llena la `url` de la actividad del tema
   (ej. `"url": "unidades/unidad-01/actividades/actividad-1-5.html"`); mientras esté vacía aparece con candado.
5. En el tema, el botón de "Comprueba tu comprensión" debe apuntar a `../actividades/actividad-X-Y.html`.
6. Opcional: agrega la actividad a la ventana "Actividades" de la portada (`assets/data/actividades.json`).

Formatos de pregunta admitidos en el banco (campo `"type"`; si falta, se toma como opción múltiple):

```json
{ "type": "opcion_multiple", "question": "…", "options": ["A", "B", "C"], "answer": "A" }
{ "type": "verdadero_falso", "statement": "…", "answer": true }
{ "type": "completar_oracion", "question": "La pila sigue el principio _____.", "wordBank": ["LIFO", "FIFO"], "answer": ["LIFO"] }
{ "type": "ordenar_oracion", "segments": ["…", "…"], "answer": ["…", "…"] }
```

- También se acepta el formato de la Unidad 1: `{ "pregunta", "opciones", "respuesta_correcta" }`.
- En "completar", cada `_____` es un espacio y `answer` lleva una palabra por espacio, en orden.
- Campo opcional `"explicacion"`: texto que se muestra en la retroalimentación.

## Agregar una unidad nueva

1. Copia `unidad-03.json` como `unidad-04.json` y cambia su contenido (incluido `"id": "unidad-04"`).
2. Copia la carpeta `unidades/unidad-03/index.html` a `unidades/unidad-04/index.html` y cambia **solo** `data-unidad="unidad-04"`.
3. Agrega `"unidad-04"` a la lista `unidades` de `assets/data/unidades-data.json`.

## Si la página muestra "No se pudo cargar el contenido"

- Casi siempre es una **coma de más o de menos**, o una comilla sin cerrar. El mensaje indica el archivo; puedes validarlo en https://jsonlint.com.
- La página debe abrirse con un servidor (Live Server o GitHub Pages), no con doble clic.
