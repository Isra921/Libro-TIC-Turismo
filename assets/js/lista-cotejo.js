// ==========================================================================
// LISTA DE COTEJO (temas)
// Marca: <div class="t-checklist" data-cotejo="clave-unica"> con casillas en
// .t-checklist__list. Cuenta lo verificado, guarda el avance en este navegador
// y copia la lista como texto con el botón [data-cotejo-copiar].
// ==========================================================================
(function () {
    const PREFIJO = 'polilibro-tic:';

    function leer(clave) {
        try { return JSON.parse(localStorage.getItem(PREFIJO + clave)) || []; } catch (e) { return []; }
    }

    function guardar(clave, estado) {
        try { localStorage.setItem(PREFIJO + clave, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento */ }
    }

    function iniciar(lista) {
        const clave = lista.dataset.cotejo;
        const casillas = [...lista.querySelectorAll('.t-checklist__list input[type="checkbox"]')];
        const hechos = lista.querySelector('[data-cotejo-hechos]');
        const total = lista.querySelector('[data-cotejo-total]');
        const barra = lista.querySelector('.t-checklist__bar');
        const copiar = lista.querySelector('[data-cotejo-copiar]');
        const reiniciar = lista.querySelector('[data-cotejo-reiniciar]');
        const titulo = lista.querySelector('.t-checklist__title')?.textContent.trim() || 'Lista de cotejo';

        const guardado = leer(clave);
        casillas.forEach((c, i) => { c.checked = Boolean(guardado[i]); });

        const actualizar = () => {
            const n = casillas.filter(c => c.checked).length;
            if (hechos) hechos.textContent = n;
            if (total) total.textContent = casillas.length;
            if (barra) barra.style.width = `${Math.round((n / casillas.length) * 100)}%`;
            lista.classList.toggle('is-completa', n === casillas.length);
            guardar(clave, casillas.map(c => c.checked));
        };
        casillas.forEach(c => c.addEventListener('change', actualizar));

        reiniciar?.addEventListener('click', () => {
            casillas.forEach(c => { c.checked = false; });
            actualizar();
        });

        copiar?.addEventListener('click', async () => {
            const lineas = casillas.map(c => `[${c.checked ? 'x' : ' '}] ${c.closest('label').textContent.trim()}`);
            const texto = `${titulo} (${casillas.filter(c => c.checked).length} de ${casillas.length})\n${lineas.join('\n')}`;
            const etiqueta = copiar.querySelector('span');
            const original = etiqueta.textContent;
            try {
                await navigator.clipboard.writeText(texto);
                etiqueta.textContent = '¡Copiada!';
            } catch (e) {
                etiqueta.textContent = 'No se pudo copiar';
            }
            setTimeout(() => { etiqueta.textContent = original; }, 2000);
        });

        actualizar();
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.t-checklist[data-cotejo]').forEach(iniciar);
    });
})();
