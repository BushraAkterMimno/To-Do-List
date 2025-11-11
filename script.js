const STORAGE_KEY = 'todoListPro_v5';
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const todoList = document.getElementById('todoList');
    const counts = document.getElementById('counts');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const toggleCompletedBtn = document.getElementById('toggleCompleted');
    const clearAllBtn = document.getElementById('clearAll');
    const themeToggle = document.getElementById('themeToggle');

    let tasks = [];
    let hideCompleted = false;

    function loadTasks() { const data = localStorage.getItem(STORAGE_KEY); tasks = data ? JSON.parse(data) : []; }
    function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    function render() {
      todoList.innerHTML = '';
      const visibleTasks = hideCompleted ? tasks.filter(t => !t.done) : tasks;
      if (!visibleTasks.length) { todoList.innerHTML = '<li class="todo" style="text-align:center;color:var(--muted)">✨ No tasks available — add one above.</li>'; updateCounts(); return; }
      visibleTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'todo' + (task.done ? ' completed' : '');
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = task.text;
        textDiv.onclick = () => toggleDone(task.id);
        const actions = document.createElement('div');
        actions.className = 'actions';
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.onclick = e => { e.stopPropagation(); const newText = prompt('Edit task:', task.text); if(newText && newText.trim()) { task.text = newText.trim(); saveTasks(); render(); } };
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.className = 'del';
        delBtn.onclick = e => { e.stopPropagation(); tasks = tasks.filter(t => t.id !== task.id); saveTasks(); render(); };
        actions.appendChild(editBtn); actions.appendChild(delBtn);
        li.appendChild(textDiv); li.appendChild(actions);
        todoList.appendChild(li);
      });
      updateCounts();
    }
    function updateCounts() { counts.textContent = `Total: ${tasks.length} • Completed: ${tasks.filter(t => t.done).length}`; }
    function addTask(text) { if (!text.trim()) return; tasks.unshift({ id: Date.now(), text: text.trim(), done: false }); saveTasks(); render(); }
    function toggleDone(id) { const task = tasks.find(t => t.id === id); if (!task) return; task.done = !task.done; saveTasks(); render(); }

    clearCompletedBtn.onclick = () => { tasks = tasks.filter(t => !t.done); saveTasks(); render(); };
    clearAllBtn.onclick = () => { tasks = []; saveTasks(); render(); };
    toggleCompletedBtn.onclick = () => { hideCompleted = !hideCompleted; toggleCompletedBtn.textContent = hideCompleted ? '👁️ Show Completed' : '👁️ Hide Completed'; render(); };
    themeToggle.onclick = () => { const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.body.setAttribute('data-theme', newTheme); themeToggle.textContent = newTheme === 'dark' ? '🌞' : '🌙'; };
    taskForm.onsubmit = e => { e.preventDefault(); addTask(taskInput.value); taskInput.value = ''; };
    loadTasks(); render();