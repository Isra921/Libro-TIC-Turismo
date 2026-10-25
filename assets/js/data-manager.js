// ==========================================================================
// DATA MANAGER · Carga de datos de las unidades (JSON)
// --------------------------------------------------------------------------
// - Todas las rutas de los JSON se escriben desde la RAÍZ del sitio
//   (ej. "unidades/unidad-01/temas/tema-01-01.html").
// - Cada página indica en <body data-root="..."> cuántos niveles debe subir
//   para llegar a la raíz ("" en la raíz, "../../" dentro de unidades/unidad-XX/).
// - Guarda en caché cada archivo para no repetir peticiones fetch.
// - Incluye respaldo offline embebido para visualización local directa (file:///).
// ==========================================================================

class DataError extends Error {
    constructor(archivo, mensaje) {
        super(mensaje);
        this.name = 'DataError';
        this.archivo = archivo;
    }
}

const DataManager = {
    RUTA_CATALOGO: 'assets/data/unidades-data.json',
    CARPETA_UNIDADES: 'assets/data/unidades/',
    PATRON_PAGINA_UNIDAD: id => `unidades/${id}/index.html`,
    PATRON_URL_ABSOLUTA: /^(?:[a-z]+:)?\/\//i,

    _cache: new Map(),

    /** Prefijo relativo para llegar a la raíz del sitio desde la página actual. */
    raiz() {
        return document.body.dataset.root || '';
    },

    /** Convierte una ruta escrita desde la raíz en una ruta válida para esta página. */
    ruta(rutaDesdeRaiz) {
        if (!rutaDesdeRaiz) return '';
        if (this.PATRON_URL_ABSOLUTA.test(rutaDesdeRaiz) || rutaDesdeRaiz.startsWith('#')) {
            return rutaDesdeRaiz;
        }
        return `${this.raiz()}${rutaDesdeRaiz}`;
    },

    /** Descarga y valida un JSON. Si fetch falla (ej. por CORS al abrir con file:///), usa el respaldo embebido. */
    async _cargarJSON(rutaDesdeRaiz) {
        if (this._cache.has(rutaDesdeRaiz)) return this._cache.get(rutaDesdeRaiz);

        const promesa = (async () => {
            try {
                const respuesta = await fetch(this.ruta(rutaDesdeRaiz));
                if (respuesta.ok) {
                    const texto = await respuesta.text();
                    return JSON.parse(texto);
                }
            } catch (error) {
                // Fetch falló (típicamente CORS en protocolo file:///). Proceder con respaldo embebido si existe.
            }

            if (DataManager.DATOS_EMBEBIDOS && DataManager.DATOS_EMBEBIDOS[rutaDesdeRaiz]) {
                return DataManager.DATOS_EMBEBIDOS[rutaDesdeRaiz];
            }

            throw new DataError(rutaDesdeRaiz,
                'No se pudo leer el archivo. Si abriste la página con doble clic, ábrela con un servidor local (por ejemplo, Live Server).');
        })();

        this._cache.set(rutaDesdeRaiz, promesa);
        promesa.catch(() => this._cache.delete(rutaDesdeRaiz));
        return promesa;
    },

    /** Datos generales del catálogo: título, descripción y orden de las unidades. */
    async getCatalogo() {
        return this._cargarJSON(this.RUTA_CATALOGO);
    },

    /** Datos completos de una unidad (assets/data/unidades/<id>.json). */
    async getUnidad(idUnidad) {
        return this._cargarJSON(`${this.CARPETA_UNIDADES}${idUnidad}.json`);
    },

    /** Todas las unidades, en el orden definido en el catálogo. */
    async getUnidades() {
        const catalogo = await this.getCatalogo();
        return Promise.all(catalogo.unidades.map(id => this.getUnidad(id)));
    },

    /** Cualquier otro JSON del sitio (ej. bancos de preguntas de las actividades). */
    async getArchivo(rutaDesdeRaiz) {
        return this._cargarJSON(rutaDesdeRaiz);
    },

    /** Ruta (ya ajustada a la página actual) hacia la página de una unidad. */
    urlUnidad(idUnidad) {
        return this.ruta(this.PATRON_PAGINA_UNIDAD(idUnidad));
    },

    /**
     * Ruta (ya ajustada a la página actual) hacia las referencias de una unidad.
     * La usa tema-plantilla.js ("Ver lista completa"); sin ella el índice lateral
     * y la navegación de los temas no se generaban desde el JSON.
     */
    urlReferencias(idUnidad) {
        return this.ruta(`unidades/${idUnidad}/referencias.html`);
    },

    /** Respaldo embebido de datos para que la interfaz funcione offline y bajo file:/// */
    DATOS_EMBEBIDOS: {
        'assets/data/unidades-data.json': {
            "titulo": "Unidades temáticas",
            "descripcion": "Programa académico de TIC aplicadas para el turismo de la Escuela Superior de Turismo (EST - IPN).",
            "unidades": ["unidad-01", "unidad-02", "unidad-03"]
        },
        'assets/data/unidades/unidad-01.json': {
            "id": "unidad-01",
            "numero": 1,
            "titulo": "Las TIC",
            "descripcion": "Analizan las Tecnologías de Información y Comunicación en el ámbito turístico a partir de sus fundamentos, la comunicación digital, los espacios de trabajo virtuales y el ámbito laboral.",
            "lema": "Fundamentos de las TIC, comunicación digital, plataformas virtuales y tecnologías especializadas para el sector turístico.",
            "duracion_horas": 24.0,
            "introduccion": [
                "Las Tecnologías de la Información y la Comunicación (TIC) constituyen la columna vertebral de la modernización, distribución y comercialización de los servicios turísticos a nivel global.",
                "A lo largo de esta primera unidad temática se abordan los conceptos esenciales de las TIC, el funcionamiento de Internet y los motores de búsqueda, las dinámicas de comunicación sincrónica y asincrónica, los espacios virtuales colaborativos y las plataformas esenciales del ecosistema turístico tales como sistemas de punto de venta (POS), sistemas de distribución global (GDS) y sistemas ERP."
            ],
            "temas": [
                { "numero": "1.1", "nombre": "Fundamentos de las TIC", "sintesis": "Conceptos básicos, naturaleza, evolución y relevancia de las TIC en la sociedad de la información y el turismo.", "url": "unidades/unidad-01/temas/tema-01-01.html" },
                { "numero": "1.2", "nombre": "Principales tecnologías de la información y la comunicación", "sintesis": "Correo electrónico, arquitectura de Internet y World Wide Web, navegadores web, buscadores y metabuscadores.", "url": "unidades/unidad-01/temas/tema-01-02.html" },
                { "numero": "1.3", "nombre": "Las TIC en el ámbito laboral", "sintesis": "Impacto en las organizaciones turísticas, principales aportaciones, automatización y competitividad empresarial.", "url": "unidades/unidad-01/temas/tema-01-03.html" },
                { "numero": "1.4", "nombre": "La comunicación digital", "sintesis": "Impacto y aplicaciones de la comunicación digital en el sector turístico mediante chats, foros y blogs.", "url": "unidades/unidad-01/temas/tema-01-04.html" },
                { "numero": "1.5", "nombre": "Tecnologías utilizadas en el turismo", "sintesis": "Puntos de venta (POS), Sistemas de Distribución Global (GDS) y Planificación de Recursos Empresariales (ERP).", "url": "unidades/unidad-01/temas/tema-01-05.html" },
                { "numero": "1.6", "nombre": "Espacios virtuales de trabajo", "sintesis": "Wikis, comunidades virtuales, Ambientes Virtuales de Aprendizaje (AVA), teoría de páginas web y herramientas en línea.", "url": "unidades/unidad-01/temas/tema-01-06.html" }
            ]
        },
        'assets/data/unidades/unidad-02.json': {
            "id": "unidad-02",
            "numero": 2,
            "titulo": "Digitalización de la información",
            "descripcion": "Produce páginas web a partir de la digitalización y almacenamiento de información.",
            "lema": "Tratamiento y producción de medios digitales: texto, gráficos, sonido y video para el desarrollo de páginas web turísticas.",
            "duracion_horas": 24.0,
            "introduccion": [
                "La digitalización y gestión de contenidos multimedia es hoy la base fundamental del marketing, la difusión y la comercialización turística.",
                "En esta segunda unidad temática se abordan las técnicas y herramientas de software para el tratamiento de texto, edición de imagen, producción de audio y video, integradores multimedia, medios de almacenamiento seguro y la creación de páginas web para la promoción de productos y destinos turísticos."
            ],
            "temas": [
                { "numero": "2.1", "nombre": "Digitalización de la información", "sintesis": "Procesadores de texto, editores de imágenes, audio y video, integradores de medios y utilerías típicas de digitalización.", "url": "unidades/unidad-02/temas/tema-02-01.html" },
                { "numero": "2.2", "nombre": "Medios de almacenamiento", "sintesis": "Medios magnéticos, ópticos, electrónicos y servicios de almacenamiento en la nube para resguardo de información turística.", "url": "unidades/unidad-02/temas/tema-02-02.html" },
                { "numero": "2.3", "nombre": "Creación de páginas web", "sintesis": "Principios de diseño, estructura, publicación y promoción de páginas web enfocadas al turismo.", "url": "unidades/unidad-02/temas/tema-02-03.html" }
            ]
        },
        'assets/data/unidades/unidad-03.json': {
            "id": "unidad-03",
            "numero": 3,
            "titulo": "Software de tratamiento de datos numéricos",
            "descripcion": "Construye hojas de cálculo, gráficos y tablas dinámicas a partir de sus elementos, fórmulas elementales y funciones.",
            "lema": "Tratamiento de datos, fórmulas, funciones avanzadas, tablas dinámicas y análisis cuantitativo para la toma de decisiones en turismo.",
            "duracion_horas": 24.0,
            "introduccion": [
                "El análisis, procesamiento e interpretación de datos cuantitativos es una competencia clave para la gestión hotelera, de agencias de viajes, transportación y desarrollo de destinos turísticos.",
                "En esta tercera unidad temática se profundiza en el uso de la hoja de cálculo como herramienta para el tratamiento de información numérica: desde el manejo de operadores y fórmulas, la aplicación de funciones estadísticas, lógicas y financieras, hasta la creación de gráficos y el diseño de tablas dinámicas para el análisis estadístico en turismo."
            ],
            "temas": [
                { "numero": "3.1", "nombre": "Software para análisis e interpretación de la información y tratamiento de datos numéricos", "sintesis": "Entorno de la hoja de cálculo, filas, columnas, celdas, rangos y elementos esenciales de la interfaz.", "url": "unidades/unidad-03/temas/tema-03-01.html" },
                { "numero": "3.2", "nombre": "Operadores aritméticos", "sintesis": "Operadores matemáticos, de comparación y concatenación, y su orden de prioridad en las operaciones.", "url": "unidades/unidad-03/temas/tema-03-02.html" },
                { "numero": "3.3", "nombre": "Fórmulas elementales", "sintesis": "Creación y edición de fórmulas elementales, sintaxis, referencias relativas, absolutas y mixtas.", "url": "unidades/unidad-03/temas/tema-03-03.html" },
                { "numero": "3.4", "nombre": "Funciones", "sintesis": "Funciones estadísticas, matemáticas, trigonométricas, financieras, texto, lógicas, fecha y hora, y anidación.", "url": "unidades/unidad-03/temas/tema-03-04.html" },
                { "numero": "3.5", "nombre": "Elaboración de gráficos", "sintesis": "Tipos de gráficos, modificación de tamaño, inserción de imágenes, líneas y figuras geométricas.", "url": "unidades/unidad-03/temas/tema-03-05.html" },
                { "numero": "3.6", "nombre": "Tablas dinámicas", "sintesis": "Diseño, estructuración de campos, filtros, segmentación y análisis interactivo de datos turísticos.", "url": "unidades/unidad-03/temas/tema-03-06.html" },
                { "numero": "3.7", "nombre": "Impresión", "sintesis": "Configuración de área de impresión, ajuste de escala, márgenes, encabezados y reportes finales.", "url": "unidades/unidad-03/temas/tema-03-07.html" }
            ]
        }
    }
};
