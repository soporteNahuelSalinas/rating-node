// app.js
// Manejo de modales y envío de datos a backend Node + Supabase

// Preguntas para cada nivel de atención
const preguntas = {
    Buena: {
        title: '¿Qué aspecto de la atención te pareció el más destacado?😎',
        items: [
            '🔋Rapidez en la atención',
            '🙋Disposición a la atención',
            '💯Capacidad de resolución',
            '🤝Amabilidad, empatía',
            '⚙️Asesoramiento/Conocimiento técnico'
        ]
    },
    Normal: {
        title: '¿Qué aspecto sugerirías mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía',
            '😐No veo oportunidad de mejora'
        ]
    },
    Mala: {
        title: '¿Qué aspecto sugerirías mejorar?🙏',
        items: [
            '🔋Atención más rápida',
            '🧠Conocimientos del producto',
            '💰Conocer las financiaciones',
            '✋Mayor predisposición',
            '🤝Amabilidad y empatía'
        ]
    }
};

// Categorías y fuentes
const categorias = [
    'Notebook',
    'Impresoras',
    'PC Armada',
    'Insumos',
    'Accesorios',
    'Electrodomésticos',
    'Monitores',
    'Otros'
];

const fuentes = [
    'Recomendación del vendedor',
    'Tienda En Línea de Anyway',
    'Sucursal Física',
    'Redes Sociales [Facebook, Instagram]',
    'Medios Digitales [Google, YouTube]',
    'WhatsApp [Estados, Mensajes]',
    'Auto Parlante',
    'Carteles y Pasacalles',
    'Correo Electrónico',
    'Radio',
    'Otro'
];

// DOM elements
const ratingButtons = document.querySelectorAll('.rating-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalItems = document.getElementById('modal-items');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const header = document.querySelector('header');

const brandModal = document.getElementById('brand-modal');
const brandItems = document.getElementById('brand-items');
const brandNextBtn = document.getElementById('brand-next-btn');
const closeBrandBtn = document.getElementById('close-brand-btn');

const sourceModal = document.getElementById('source-modal');
const sourceItems = document.getElementById('source-items');
const sourceNextBtn = document.getElementById('source-next-btn');
const closeSourceBtn = document.getElementById('close-source-btn');

const phoneModal = document.getElementById('phone-modal');
const phoneInput = document.getElementById('phone-input');
const confirmPhoneBtn = document.getElementById('confirm-phone-btn');
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');

// Variables de seguimiento
let nivelSeleccionado = null;
let itemSeleccionado = null;
let marcaSeleccionada = null;
let fuenteSeleccionada = null;
let telefonoIngresado = null;
let inactivityTimer = null;

// Mensaje de encabezado
const vendedorSeleccionado = localStorage.getItem('vendedorSeleccionado') || 'Vendedor No Seleccionado';
const sucursalSeleccionada = localStorage.getItem('sucursalSeleccionada') || 'Sucursal No Seleccionada';
if (header) header.innerHTML = `<h1>¡No olvides calificar a ${vendedorSeleccionado}!</h1>`;

// Inactividad
function iniciarInactividad() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(cerrarModalesPorInactividad, 60000);
}

function cerrarModalesPorInactividad() {
    [modal, brandModal, sourceModal, phoneModal].forEach(m => m.classList.remove('visible'));
    const tel = phoneInput.value.trim() || null;
    enviarDatos(tel, true);
}

// Mostrar modales
function mostrarModal(nivel) {
    clearTimeout(inactivityTimer);
    nivelSeleccionado = nivel;
    const { title, items } = preguntas[nivel];
    modalTitle.textContent = title;
    modalItems.innerHTML = items.map((it, idx) =>
        `<div>
            <input type="radio" id="item-${idx}" name="item" value="${it}">
            <label for="item-${idx}">${it}</label>
        </div>`
    ).join('');
    closeBtn.classList.remove('hidden');
    sendBtn.classList.add('hidden');
    modal.classList.add('visible');
    iniciarInactividad();
}

function mostrarBrandModal() {
    clearTimeout(inactivityTimer);
    brandItems.innerHTML = `
        <label for="brand-select">Selecciona una categoría:</label>
        <select id="brand-select">
            <option value="" disabled selected>Seleccioná</option>
            ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>`;
    brandModal.classList.add('visible');

    document.getElementById('brand-select').addEventListener('change', function () {
        marcaSeleccionada = this.value || 'No seleccionada';
        brandModal.classList.remove('visible');
        mostrarSourceModal();
    });

    iniciarInactividad();
}

function mostrarSourceModal() {
    clearTimeout(inactivityTimer);
    sourceItems.innerHTML = `
        <label for="source-select">Selecciona una opción:</label>
        <select id="source-select">
            <option value="" disabled selected>Selecciona</option>
            ${fuentes.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>`;
    sourceModal.classList.add('visible');

    document.getElementById('source-select').addEventListener('change', function () {
        fuenteSeleccionada = this.value || 'No seleccionada';
        sourceModal.classList.remove('visible');
        mostrarPhoneModal();
    });

    iniciarInactividad();
}

function mostrarPhoneModal() {
    clearTimeout(inactivityTimer);
    phoneInput.value = '';
    closePhoneModalBtn.style.display = 'none';
    phoneModal.classList.add('visible');
    iniciarInactividad();
}

// Enviar datos al backend
function enviarDatos(telefono = null, force = false) {
    clearTimeout(inactivityTimer);
    if (!force && nivelSeleccionado !== 'Mala' && (!marcaSeleccionada || !fuenteSeleccionada)) {
        alert('Selecciona categoría y fuente antes.');
        return;
    }
    const payload = {
        sucursal: sucursalSeleccionada,
        vendedor: vendedorSeleccionado,
        calificacion: nivelSeleccionado,
        detalle: itemSeleccionado || null,
        campana: nivelSeleccionado !== 'Mala' ? marcaSeleccionada : null,
        fuente: nivelSeleccionado !== 'Mala' ? fuenteSeleccionada : null,
        telefono: telefono,
        canal: 'Tablet'
    };
    fetch('/api/encuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(() => mostrarAgradecimiento())
        .catch(() => mostrarAgradecimiento());
}

function mostrarAgradecimiento() {
    clearTimeout(inactivityTimer);
    modalTitle.textContent = '¡Gracias por tu feedback!';
    modalItems.innerHTML = '';
    closeBtn.classList.add('hidden');
    sendBtn.classList.add('hidden');
    modal.classList.add('visible');
    setTimeout(() => modal.classList.remove('visible'), 3000);
    resetearDatos();
}

function resetearDatos() {
    nivelSeleccionado = itemSeleccionado = marcaSeleccionada = fuenteSeleccionada = telefonoIngresado = null;
    phoneInput.value = '';
}

// Listeners

// Rating inicial
ratingButtons.forEach(btn =>
    btn.addEventListener('click', () => {
        clearTimeout(inactivityTimer);
        nivelSeleccionado = btn.dataset.rating;
        if (nivelSeleccionado === 'Mala') {
            mostrarPhoneModal();
        } else {
            mostrarModal(nivelSeleccionado);
        }
    })
);

// Cierre manual del modal principal
closeBtn.addEventListener('click', () => {
    modal.classList.remove('visible');
    enviarDatos(null, true);
});

// Selección automática en modal de detalle
modalItems.addEventListener('change', e => {
    if (e.target.name === 'item') {
        clearTimeout(inactivityTimer);
        itemSeleccionado = e.target.value;
        modal.classList.remove('visible');
        if (nivelSeleccionado === 'Mala') {
            mostrarPhoneModal();
        } else {
            mostrarBrandModal();
        }
    }
});

// BRAND: Siguiente (avanza siempre)
brandNextBtn.addEventListener('click', () => {
    clearTimeout(inactivityTimer);
    const select = document.getElementById('brand-select');
    marcaSeleccionada = select && select.value ? select.value : 'No seleccionada';
    brandModal.classList.remove('visible');
    mostrarSourceModal();
});

// Cerrado Brand
closeBrandBtn.addEventListener('click', () => {
    cerrarModalesPorInactividad();
});

// SOURCE: Siguiente (avanza siempre)
sourceNextBtn.addEventListener('click', () => {
    clearTimeout(inactivityTimer);
    const select = document.getElementById('source-select');
    fuenteSeleccionada = select && select.value ? select.value : 'No seleccionada';
    sourceModal.classList.remove('visible');
    mostrarPhoneModal();
});

// Cerrado Source
closeSourceBtn.addEventListener('click', () => {
    cerrarModalesPorInactividad();
});

// PHONE: Confirmar y enviar
confirmPhoneBtn.addEventListener('click', () => {
    clearTimeout(inactivityTimer);
    telefonoIngresado = phoneInput.value.trim() || null;
    phoneModal.classList.remove('visible');
    enviarDatos(telefonoIngresado);
});

// PHONE: Cerrar manual y enviar
closePhoneModalBtn.addEventListener('click', () => {
    clearTimeout(inactivityTimer);
    telefonoIngresado = phoneInput.value.trim() || null;
    phoneModal.classList.remove('visible');
    enviarDatos(telefonoIngresado);
});

// Wake Lock
let wakeLock = null;
async function activarWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
        console.error('WakeLock error:', err);
    }
}
activarWakeLock();