const todosAll = document.querySelector(".todo-block__content__todos-all");
const todoInput = document.querySelector(".todo-input");

const createElementWithProps = (elementType, props) => {
  const el = document.createElement(elementType);
  Object.keys(props).forEach((key) => {
    const val = props[key];
    el[key] = val;
  });
  return el;
};

const initialState = {
  todos: [...new Array(10).keys()].map((key) => ({
    text: new Date().getTime() + key,
    completed: false,
    id: Date.now() + key,
  })),
};

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
};

const render = (state) => {
  todosAll.innerHTML = "";
  todosAll.append(
    ...state.map((todo) => createToDo(todo.text, todo.completed, todo.id))
  );
};

const state = new Proxy(initialState, {
  set: (target, key, value) => {
    target[key] = value;
    render(value);
    return true;
  },
});

const createToDo = (text, isCompleted, id) => {
  const todo = createElementWithProps("div", { className: "todo" });
  todo.setAttribute("id", id);
  const completed = createElementWithProps("input", {
    className: "todo__checkbox",
    type: "checkbox",
    checked: isCompleted,
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
    console.log();
    if (event.key == "Enter") {
      // if (!document.querySelector(".todo__text_editable").value) {
      // }
      console.log(event.key);
      actions.edit(e.target.value, id);
    }
  });

  const deleteButton = createElementWithProps("div", {
    className: "todo__delete-button",
  });
  todo.append(...[completed, todoText, deleteButton]);
  return todo;
};

todoInput.addEventListener("keypress", (event) => {
  const enterKey = "Enter";
  if (event.key === enterKey) {
    actions.create(todoInput.value);
    todoInput.value = "";
  }
});

render(state.todos);
