const addButton = document.getElementById('add-btn');
const inputField = document.getElementById('entrada-list');
const ideaList = document.getElementById('idea-list');

// Función para guardar ideas en local storage
function saveToLocalStorage() {
    const ideas = [];
    const cards = document.querySelectorAll('.idea-card');
    cards.forEach(card => {
        const text = card.querySelector('.idea-text').textContent.trim();
        const date = card.querySelector('.idea-date').textContent.trim();
        ideas.push({ text, date });
    });
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Función para cargar ideas desde local storage
function loadFromLocalStorage() {
    const storedIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
    storedIdeas.forEach(idea => {
        addIdeaToList(idea.text, idea.date);
    });
}

// Función para agregar una idea al DOM
function addIdeaToList(ideaText, fecha) {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.innerHTML = `
        <div class="idea-text" contenteditable="false">${ideaText}</div>
        <div class="idea-date">${fecha}</div>
        <div class="idea-actions">
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Eliminar</button>
        </div>
    `;
    ideaList.appendChild(card);
}

// Evento para agregar ideas
addButton.addEventListener('click', function () {
    const ideaText = inputField.value.trim();
    if (ideaText !== '') {
        const fecha = getCurrentDate();
        addIdeaToList(ideaText, fecha);
        inputField.value = '';
        saveToLocalStorage();
    }
});

// Evento para manejar edición y eliminación
ideaList.addEventListener('click', function (e) {
    const card = e.target.closest('.idea-card');

    if (e.target.classList.contains('edit-btn')) {
        const ideaTextDiv = card.querySelector('.idea-text');
        const editBtn = e.target;

        if (ideaTextDiv.contentEditable === 'false') {
            // Entrar en modo edición
            ideaTextDiv.contentEditable = 'true';
            ideaTextDiv.focus();
            editBtn.textContent = 'Guardar';

            // Colocar el cursor al final del texto
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(ideaTextDiv);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            // Guardar cambios y salir del modo edición
            ideaTextDiv.contentEditable = 'false';
            editBtn.textContent = 'Editar';
            saveToLocalStorage();
        }
    }

    if (e.target.classList.contains('delete-btn')) {
        card.remove();
        saveToLocalStorage();
    }
});

// Función para obtener la fecha actual
function getCurrentDate() {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}

// Cargar las ideas al iniciar
loadFromLocalStorage();
