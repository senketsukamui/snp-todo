const todosAll = document.querySelector(".todo-block__content__todos-all");
const todosActive = document.querySelector(
  ".todo-block__content__todos-active"
);
const todosCompleted = document.querySelector(
  ".todo-block__content__todos-completed"
);

const todoInput = document.querySelector(".todo-input");
const completeAll = document.querySelector(".todo-complete-all");
const todosCount = document.querySelector(".count");
const allSort = document.querySelector(".sorts__all");
const activeSort = document.querySelector(".sorts__active");
const completedSort = document.querySelector(".sorts__completed");
const clearCompletedButton = document.querySelector(".clear");
window.currentTab = "all";

const createElementWithProps = (elementType, props) => {
  const el = document.createElement(elementType);
  Object.keys(props).forEach((key) => {
    const val = props[key];
    el[key] = val;
  });
  return el;
};
const changeTodosCount = () => {
  let todoCompleted = 0;
  for (node of todosAll.childNodes) {
    if (!node.className.includes("completed")) {
      todoCompleted += 1;
    }
  }
  todosCount.innerHTML = `Todos left: ${todoCompleted}`;
};

completeAll.addEventListener("click", (e) => {
  const allTodos = document.querySelectorAll(".todo");
  const classnames = Object.values(allTodos).map((e) => e.className);
  if (classnames.every((cl) => !cl.includes("completed"))) {
    for (node of allTodos) {
      node.classList.add("completed");
      node.childNodes[0].checked = true;
      changeTodosCount();
    }
    return;
  }
  if (classnames.every((cl) => cl.includes("completed"))) {
    for (node of allTodos) {
      node.classList.remove("completed");
      node.childNodes[0].checked = false;
      changeTodosCount();
    }
    return;
  }

  if (classnames.some((cl) => cl.includes("completed"))) {
    for (node of allTodos) {
      if (!node.childNodes[0].checked) {
        node.classList.add("completed");
        node.childNodes[0].checked = true;
        changeTodosCount();
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
        changeTodosCount();
        return;
      }
      text.innerHTML = e.target.value;
    }
  });
  text.addEventListener("focusout", (e) => {
    if (!document.querySelector(".todo__text_editable").value) {
      todo.remove();
      changeTodosCount();
      return;
    }
    text.innerHTML = e.target.value;
  });
  deleteButton.addEventListener("click", (e) => {
    todo.remove();
    changeTodosCount();
  });
  completed.addEventListener("click", (e) => {
    if (todo.classList[1] == "completed") {
      todo.classList.remove("completed");
      if (window.currentTab == "completed") {
        e.target.parentNode.style.display = "none";
      }
      changeTodosCount();
    } else {
      todo.classList.add("completed");
      if (window.currentTab == "active") {
        e.target.parentNode.style.display = "none";
      }
      changeTodosCount();
    }
  });
  todosAll.appendChild(todo);
  changeTodosCount();
};

todoInput.addEventListener("keypress", (event) => {
  const enterKey = "Enter";
  if (event.key === enterKey && todoInput.value) {
    createNewTodo(todoInput.value);
    todoInput.value = "";
  }
});

const displayAll = () => {
  for (node of todosAll.childNodes) {
    node.style.display = "flex";
  }
};

allSort.addEventListener("click", (e) => {
  displayAll();
  window.currentTab = "all";
});

activeSort.addEventListener("click", (e) => {
  displayAll();
  const todoToSort = document.querySelectorAll(".completed");
  for (node of todoToSort) {
    node.style.display = "none";
  }
  window.currentTab = "active";
});

completedSort.addEventListener("click", (e) => {
  displayAll();
  const todoToSort = document.querySelectorAll(".todo:not(.completed)");
  for (node of todoToSort) {
    node.style.display = "none";
  }
  window.currentTab = "completed";
});

clearCompletedButton.addEventListener("click", (e) => {
  for (node of document.querySelectorAll(".completed")) {
    node.remove();
  }
});
