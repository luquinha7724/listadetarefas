const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompleted = document.getElementById("clear-completed");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("minhas-tarefas") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("minhas-tarefas", JSON.stringify(tasks));
    } catch {
        console.warn("Não foi possível salvar as tarefas.");
    }
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Concluir tarefa: ${task.text}`
        );

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Excluir";
        deleteButton.setAttribute(
            "aria-label",
            `Excluir tarefa: ${task.text}`
        );

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, text, deleteButton);
        taskList.appendChild(li);
    });

    const completed = tasks.filter(task => task.completed).length;

    taskCount.textContent =
        `${tasks.length} ${tasks.length === 1 ? "tarefa" : "tarefas"}`;

    completedCount.textContent = `${completed} concluídas`;

    emptyMessage.hidden = tasks.length > 0;
    clearCompleted.hidden = completed === 0;
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) {
        input.focus();
        return;
    }

    tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
    input.focus();
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

renderTasks();