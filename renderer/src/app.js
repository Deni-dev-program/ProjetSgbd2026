const list   = document.getElementById('todo-list');
const input  = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');

async function loadTodos() {
    list.innerHTML = '';
    const todos = await window.api.getTodos();
    todos.forEach(renderItem);
}

function renderItem(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', async () => {
        await window.api.toggleTodo(todo.id);
        loadTodos();
    });

    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.done) span.classList.add('done');

    const del = document.createElement('button');
    del.textContent = '×';
    del.addEventListener('click', async () => {
        await window.api.deleteTodo(todo.id);
        loadTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
}

async function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    await window.api.addTodo(text);
    input.value = '';
    loadTodos();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

loadTodos();
