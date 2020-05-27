const todos = document.querySelector(".todo-block__content__todos");
const todoInput = document.querySelector(".todo-input");

const createNewTodo = (todoText) => {
  console.log("trying create a todo with text ", todoText);
  const todo = document.createElement("div");
  const completed = document
    .createElement("input")
    .type("checkbox")
    .class("todo__checkbox");
  const text = document.createElement("div").class("todo__text");
  text.innerText = todoText;
  const deleteButton = document
    .createElement("button")
    .class("todo__delete-button");

  todo.appendChild(completed);
  todo.appendChild(text);
  todo.appendChild(deleteButton);

  return todo;
};

todoInput.addEventListener("keypress", (event) => {
  console.log("keyPressed", event.key);
  const enterKey = "Enter";
  if (event.key === enterKey) {
    createNewTodo(todoInput.innerText);
    todoInput.innerText = "";
  }
});
