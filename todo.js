// Projects/todo.js
// A simple Todo and Habit Tracker application
// Made by Rezim Titora

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DOM ---------- */
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  const todoInput = document.getElementById("todoInput");
  const todoDate = document.getElementById("todoDate");
  const todoCategory = document.getElementById("todoCategory");
  const addTodoBtn = document.getElementById("addTodoBtn");
  const searchInput = document.getElementById("searchInput");
  const todoContainer = document.querySelector(".todo-container");

  const habitInput = document.getElementById("habitInput");
  const addHabitBtn = document.getElementById("addHabitBtn");
  const habitContainer = document.querySelector(".habit-container");

  const totalTodosEl = document.getElementById("totalTodos");
  const doneTodosEl = document.getElementById("doneTodos");
  const progressFill = document.getElementById("progressFill");

  /* ---------- STATE ---------- */
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  todos = todos.filter(t => t && typeof t.text === "string");

  /* ---------- THEME ---------- */
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
  }

  themeToggle.onclick = () => {
    body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark") ? "dark" : "light"
    );
  };

  /* ---------- TODOS ---------- */
  addTodoBtn.onclick = () => {
    if (!todoInput.value || !todoDate.value) return;

    todos.push({
      text: todoInput.value.trim(),
      date: todoDate.value,
      category: todoCategory.value,
      done: false
    });

    todoInput.value = "";
    todoDate.value = "";
    saveTodos();
  };

  searchInput.oninput = renderTodos;

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  function renderTodos() {
    todoContainer.innerHTML = "";
    const query = (searchInput.value || "").toLowerCase();

    todos
      .filter(t => t.text.toLowerCase().includes(query))
      .forEach((t, i) => {
        const card = document.createElement("div");
        card.className = `card ${t.done ? "completed" : ""}`;
        card.innerHTML = `
          <span>${t.text} (${t.category})</span>
          <span>${t.date}</span>
          <button class="toggle" data-index="${i}">✔</button>
          <button class="delete" data-index="${i}">🗑</button>
        `;
        todoContainer.appendChild(card);
      });

    updateDashboard();
  }

  todoContainer.addEventListener("click", e => {
    const i = e.target.dataset.index;
    if (i === undefined) return;

    if (e.target.classList.contains("delete")) {
      todos.splice(i, 1);
      saveTodos();
    }

    if (e.target.classList.contains("toggle")) {
      todos[i].done = !todos[i].done;
      saveTodos();
    }
  });

  /* ---------- HABITS ---------- */
  addHabitBtn.onclick = addHabit;

  function today() {
    return new Date().toISOString().split("T")[0];
  }

  function addHabit() {
    if (!habitInput.value.trim()) return;

    habits.push({
      name: habitInput.value.trim(),
      streak: 0,
      lastDone: null
    });

    habitInput.value = "";
    saveHabits();
  }

  function markHabit(index) {
    const currentDate = today();
    const habit = habits[index];

    if (habit.lastDone === currentDate) return;

    habit.streak++;
    habit.lastDone = currentDate;
    saveHabits();
  }

  function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
  }

  function renderHabits() {
    habitContainer.innerHTML = "";

    habits.forEach((h, i) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <span>${h.name}</span>
        <span>🔥 ${h.streak} day streak</span>
        <button class="habit-done" data-i="${i}">Done Today</button>
        <button class="habit-delete" data-i="${i}">🗑</button>
      `;

      habitContainer.appendChild(card);
    });
  }

  habitContainer.addEventListener("click", e => {
    const i = e.target.dataset.i;
    if (i === undefined) return;

    if (e.target.classList.contains("habit-done")) {
      markHabit(i);
    }

    if (e.target.classList.contains("habit-delete")) {
      habits.splice(i, 1);
      saveHabits();
    }
  });

  /* ---------- DASHBOARD ---------- */
  function updateDashboard() {
    totalTodosEl.textContent = todos.length;
    const done = todos.filter(t => t.done).length;
    doneTodosEl.textContent = done;

    const percent = todos.length ? (done / todos.length) * 100 : 0;
    progressFill.style.width = percent + "%";
  }

  /* ---------- INIT ---------- */
  renderTodos();
  renderHabits();
});
