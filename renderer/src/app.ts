// ─── Types ─────────────────────────────────────────────────────

interface Todo {
    id: number;
    text: string;
    done: boolean;
}

// On étend Window pour que TypeScript connaisse window.api
interface Window {
    api: {
        getTodos:   ()                  => Promise<Todo[]>;
        addTodo:    (text: string)      => Promise<Todo>;
        toggleTodo: (id: number)        => Promise<Todo>;
        deleteTodo: (id: number)        => Promise<void>;
    };
}

// ─── Sélection DOM ─────────────────────────────────────────────

const list   = document.getElementById('todo-list')  as HTMLUListElement;
const input  = document.getElementById('new-todo')   as HTMLInputElement;
const addBtn = document.getElementById('add-btn')    as HTMLButtonElement;

// ─── Logique ───────────────────────────────────────────────────

async function loadTodos(): Promise<void> {
    list.innerHTML = '';
    const todos: Todo[] = await window.api.getTodos();
    todos.forEach(renderItem);
}

function renderItem(todo: Todo): void {
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

async function addTodo(): Promise<void> {
    const text = input.value.trim();
    if (!text) return;
    await window.api.addTodo(text);
    input.value = '';
    loadTodos();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
});

loadTodos();
