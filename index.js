const todosAll = document.querySelector(".todo-block__content__todos-all");
const todoInput = document.querySelector(".todo-input");
const todoCounter = document.querySelector(".count");
const completeAllButton = document.querySelector(".todo-complete-all");
const clearCompletedButton = document.querySelector(".clear");
const allSort = document.querySelector(".sorts__all");
const activeSort = document.querySelector(".sorts__active");
const completedSort = document.querySelector(".sorts__completed");

const createElementWithProps = (elementType, props) => {
  const el = document.createElement(elementType);
  Object.keys(props).forEach((key) => {
    const val = props[key];
    el[key] = val;
  });
  return el;
};

const changeLocalStorage = (state) => {
  localStorage.setItem("todos", state);
};

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos"));
};

const initialState = {
  todos: getLocalStorage() !== null ? getLocalStorage() : [],
  renderType: "all",
};
const render = (state) => {
  todosAll.innerHTML = "";
  todosAll.append(
    ...state.todos
      .filter(filters[state.renderType])
      .map((todo) => createToDo(todo.text, todo.completed, todo.id))
  );
  console.log(JSON.stringify(state.todos));
  changeLocalStorage(JSON.stringify(state.todos));
  todoCounter.innerText = `Todos left: ${actions.getActiveTodos()}`;
};

const state = new Proxy(initialState, {
  set: (target, key, value) => {
    target[key] = value;
    render(target);
    return true;
  },
});

const actions = {
  create: (text) => {
    state.todos = [
      ...state.todos,
      { text: text, completed: false, id: Date.now() },
    ];
  },
  edit: (newText, id) => {
    const todoId = state.todos.findIndex((e) => e.id === id);
    const stateCopy = [...state.todos];
    stateCopy[todoId].text = newText;
    state.todos = [...stateCopy];
  },
  delete: (id) => {
    state.todos = [...state.todos.filter((e) => e.id !== id)];
  },
  complete: (id) => {
    const stateCopy = [...state.todos];
    const todoId = state.todos.findIndex((e) => e.id === id);
    stateCopy[todoId].completed = !stateCopy[todoId].completed;
    state.todos = [...stateCopy];
  },
  getActiveTodos: () => {
    return state.todos.filter((e) => e.completed === false).length;
  },
  clearCompleted: () => {
    state.todos = [...state.todos.filter((e) => !e.completed)];
  },
  changeRenderType: (type) => {
    state.renderType = type;
  },
};

const filters = {
  all: () => true,
  active: (e) => !e.completed,
  completed: (e) => e.completed,
};

const createToDo = (text, isCompleted, id) => {
  const todo = createElementWithProps("div", { className: "todo" });
  todo.setAttribute("id", id);
  const completed = createElementWithProps("input", {
    className: "todo__checkbox",
    type: "checkbox",
    checked: isCompleted,
  });
  completed.addEventListener("click", (e) => {
    actions.complete(id);
  });
  const todoText = createElementWithProps("div", {
    className: "todo__text",
    textContent: text,
  });

  todoText.addEventListener("dblclick", (e) => {
    todoText.innerHTML = `<input class="todo__text_editable" value="${e.target.innerHTML}" />`;
    document.querySelector(".todo__text_editable").focus();
  });

  todoText.addEventListener("keypress", (e) => {
    if (event.key == "Enter") {
      if (!document.querySelector(".todo__text_editable").value) {
        actions.delete(id);
      }
      actions.edit(e.target.value, id);
    }
  });

  todoText.addEventListener("focusout", (e) => {
    if (!document.querySelector(".todo__text_editable").value) {
      actions.delete(id);
    }
    actions.edit(e.target.value, id);
  });

  const deleteButton = createElementWithProps("button", {
    className: "todo__delete-button",
  });

  deleteButton.addEventListener("click", (e) => {
    actions.delete(id);
  });
  todo.append(...[completed, todoText, deleteButton]);
  return todo;
};

todoInput.addEventListener("keypress", (event) => {
  const enterKey = "Enter";
  if (event.key === enterKey && todoInput.value) {
    actions.create(todoInput.value);
    todoInput.value = "";
  }
});

completeAllButton.addEventListener("click", (e) => {
  if (state.todos.some((e) => !e.completed)) {
    for (todo of state.todos) {
      if (!todo.completed) {
        actions.complete(todo.id);
      }
    }
  } else {
    for (todo of state.todos) {
      actions.complete(todo.id);
    }
  }
});

clearCompletedButton.addEventListener("click", (e) => {
  actions.clearCompleted();
});

activeSort.addEventListener("click", (e) => {
  actions.changeRenderType("active");
  activeSort.classList.add("active");
  allSort.classList.remove("active");
  completedSort.classList.remove("active");
});

allSort.addEventListener("click", (e) => {
  actions.changeRenderType("all");
  allSort.classList.add("active");
  activeSort.classList.remove("active");
  completedSort.classList.remove("active");
});

completedSort.addEventListener("click", (e) => {
  actions.changeRenderType("completed");
  completedSort.classList.add("active");
  activeSort.classList.remove("active");
  allSort.classList.remove("active");
});

render(state);
