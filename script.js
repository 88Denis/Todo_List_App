const taskInput = document.querySelector('.task-input input'),
  addBtn = document.querySelector('.add-btn'),
  filters = document.querySelectorAll('.filters span'),
  clearAll = document.querySelector('.clear-btn'),
  taskBox = document.querySelector('.task-box');

let editId;
let isEditTask = false;
// получение списка задач localstorage
let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active');
    btn.classList.add('active');
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = '';
  if (todos) {
    todos.forEach((todo, id) => {
      // усли статус todo завершен, установить значение checked для параметра isCompleted
      let isCompleted = todo.status == 'completed' ? 'checked' : '';
      if (filter == todo.status || filter == 'all') {
        li += `<li class="task">
                <label for="${id}">
                    <input onclick='updateStatus(this) 'type="checkbox" id="${id}"${isCompleted} />
                        <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="settings"> 
                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')">
                        <i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id}, '${filter}')">
                        <i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
      }
    });
  }

  // если элемент li не пустой, вставить значение внутри окна задач, иначе вставить span с текстом
  taskBox.innerHTML = li || `<span>You dont't have any task here</span>`;
  let checkTask = taskBox.querySelectorAll('.task');
  console.log(taskBox.offsetHeight);
  !checkTask.length
    ? clearAll.classList.remove('active')
    : clearAll.classList.add('active');
  taskBox.offsetHeight >= 30
    ? taskBox.classList.add('overflow')
    : taskBox.classList.remove('overflow');
}
showTodo('all');

function showMenu(selectedTask) {
  //Получение div меню задач
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add('show');
  document.addEventListener('click', e => {
    //Удаление класса show из меню задач при клике документа
    if (e.target.tagName != 'I' || e.target != selectedTask) {
      taskMenu.classList.remove('show');
    }
  });
}

function updateStatus(selectedTask) {
  // получение абзаца, содержащего название задачи
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add('checked');
    // обновление статуса выбранной задачи на "выполненно"
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    // обновление статуса выбранной задачи на "в ожидании"
    todos[selectedTask.id].status = 'pending';
  }
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add('active');
}

function deleteTask(deleteId) {
  //удаление выбранного элемента из массива/список дел
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
}

clearAll.addEventListener('click', () => {
  //удаление всех элементов из массива/todos
  isEditTask = false;
  todos.splice(0, todos.length);
  localStorage.setItem('todo-list', JSON.stringify(todos));
  showTodo('all');
});

//добавление задачи в список дел нажатем кнопки
addBtn.addEventListener('click', e => {
  e.preventDefault();
  let userTask = taskInput.value.trim();
  if (e.target.value !== '' || userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: 'pending' };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo('all');
  }
});

// добавление задачи в список дел нажатем клавиши Enter
taskInput.addEventListener('keyup', e => {
  let userTask = taskInput.value.trim();
  if (e.key == 'Enter' && userTask) {
    if (!isEditTask) {
      // eсли isEditTask не верно
      todos = !todos ? [] : todos; // если todos не существует, передать todos пустой массив
      let taskInfo = { name: userTask, status: 'pending' };
      todos.push(taskInfo); // добавление новой задачи в список дел
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));
    showTodo('all');
  }
});
