const todos = document.querySelector(".todo-block__content__todos");
const todoInput = document.querySelector(".todo-input");
const completeAll = document.querySelector(".todo-complete-all");

const createElementWithProps = (elementType, props) => {
  const el = document.createElement(elementType);
  Object.keys(props).forEach((key) => {
    const val = props[key];
    el[key] = val;
  });
  return el;
};

completeAll.addEventListener("click", (e) => {
  const allTodos = document.querySelectorAll(".todo");
  const classnames = Object.values(allTodos).map((e) => e.className);
  if (classnames.every((cl) => !cl.includes("completed"))) {
    for (node of allTodos) {
      node.classList.add("completed");
      node.childNodes[0].checked = true;
    }
    return;
  }
  if (classnames.every((cl) => cl.includes("completed"))) {
    for (node of allTodos) {
      node.classList.remove("completed");
      node.childNodes[0].checked = false;
    }
    return;
  }

  if (classnames.some((cl) => cl.includes("completed"))) {
    for (node of allTodos) {
      if (!node.childNodes[0].checked) {
        node.classList.add("completed");
        node.childNodes[0].checked = true;
      }
    }
    return;
  }
});

const createNewTodo = (todoText) => {
  const todo = createElementWithProps("div", { className: "todo" });
  const completed = createElementWithProps("input", {
    className: "todo__checkbox",
    type: "checkbox",
  });

  const text = createElementWithProps("div", {
    className: "todo__text",
    textContent: todoText,
  });

  const deleteButton = createElementWithProps("div", {
    className: "todo__delete-button",
  });

  todo.appendChild(completed);
  todo.appendChild(text);
  todo.appendChild(deleteButton);
  text.addEventListener("dblclick", (e) => {
    text.innerHTML = `<input class = "todo__text_editable" value="${e.target.innerText}" />`;
    document.querySelector(".todo__text_editable").focus();
  });
  text.addEventListener("keypress", (e) => {
    if (event.key === "Enter") {
      if (!document.querySelector(".todo__text_editable").value) {
        todo.remove();
      }
      text.innerHTML = e.target.value;
    }
  });
  text.addEventListener("focusout", (e) => {
    if (!document.querySelector(".todo__text_editable").value) {
      todo.remove();
    }
    text.innerHTML = e.target.value;
  });
  deleteButton.addEventListener("click", (e) => {
    todo.remove();
  });
  completed.addEventListener("click", (e) => {
    if (todo.classList[1] == "completed") {
      todo.classList.remove("completed");
    } else {
      todo.classList.add("completed");
    }
  });

  todos.appendChild(todo);
};

todoInput.addEventListener("keypress", (event) => {
  const enterKey = "Enter";
  if (event.key === enterKey && todoInput.value) {
    createNewTodo(todoInput.value);
    todoInput.value = "";
  }
});
