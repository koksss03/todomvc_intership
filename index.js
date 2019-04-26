var view = {
  // обращение к элементам
  todoList: document.querySelector('.todo-list'),
  todoInput: document.querySelector('.new-todo'),
  todoCount: document.querySelector('.todo-count'),
  todoMain: document.querySelector('.main'),
  todoFooter: document.querySelector('.footer'),
  todoFiltres: document.querySelector('.filters'),
  clearCompletedButton: document.querySelector('.clear-completed'),
  buttonToggleAll: document.querySelector('#toggle-all'),
  // отображение элементов
  showTodoCount: function (count) {
    this.todoCount.innerHTML = '<strong>' + count + '</strong> items left';
  },
  // showTodoList: function (arrId) {

  // },
  // создание новой тудухи
  creatNewTodo: function (todo) {
    var newLi = document.createElement('li');
    newLi.innerHTML = '<div class="view"><input class="toggle" type="checkbox" /><label>' + todo.value + '</label><button class="destroy"></button></div>';
    newLi.setAttribute('data-id', todo.id);
    if (todo.checked) {
      newLi.className = 'completed';
      newLi.querySelector('.toggle').checked = true;
    }
    return newLi;
  },
  showNewTodo: function (newLi) {
    view.todoList.appendChild(newLi);
  },
  hideElement: function (elem) {
    elem.style.display = 'none';
  },
  showElement: function (elem) {
    elem.style.display = 'block';
  },
  makeCheked: function (boolean, id) {
    let todo = view.todoList.querySelector('li[data-id="' + id + '"]')
    todo.querySelector('.toggle').checked = boolean;
    if (boolean) {
      todo.className = 'completed';
    } else {
      todo.className = '';
    }
  },
  removeElement: function (elem) {
    elem.parentNode.removeChild(elem);
  },
};

var model = {
  counter: 1,
  selectFilter: 0,
  // хранение листа тудух
  bufTodoAllList: document.createElement('ul'),
  bufTodoList: [],
  // взаимодействие буфером
  // addTodo: function (newLi) {
  //   this.bufTodoAllList.appendChild(newLi);
  // },
  creatNewTodo: function (id, value, checked) {
    checked = checked || false;
    return { 'id': id, 'value': value, 'checked': checked };
  },

  getCheckedId: function (boolean) {
    var arrId = [];
    for (var i = 0; i < model.bufTodoList.length; i++) {
      if (model.bufTodoList[i].checked === boolean) {
        arrId.push(model.bufTodoList[i].id);
      }
    }
    return arrId;
  },

};

var controller = {
  // генератор ID
  counter: 1,
  // добавление тудухи
  addNewTodo: function () {
    if (view.todoInput.value) {
      let id = model.counter;
      let value = view.todoInput.value;
      view.todoInput.value = '';
      model.counter++;
      let todo = model.creatNewTodo(id, value, false);
      model.bufTodoList.push(todo);
      if (model.selectFilter !== 2) {
        view.showNewTodo(view.creatNewTodo(todo));
      }
    }
  },
  // проверка на пустой лист
  emptyTodoList: function () {
    if (!model.bufTodoList.length) {
      view.hideElement(view.todoFooter);
      view.hideElement(view.todoMain);
    } else {
      view.showElement(view.todoFooter);
      view.showElement(view.todoMain);
    }
  },
  selectedFilter: function (selectFilter) {
    for (var i = 0; i < todoFiltres.children.length; i++) {
      todoFiltres.children[i].className = '';
    }
    selectFilter.className = 'selected';
    for (var i = 0; i < todoFiltres.children.length; i++) {
      if ('selected' === todoFiltres.children[i].className) {
        model.selectFilter = i;
        return;
      }
    }
  },
  hidenCompletedTodos: function () {
    let arrCheked = model.getCheckedId(true);
    if (arrCheked.length) {
      view.showElement(view.clearCompletedButton);
      if (model.bufTodoList.length === arrCheked.length) {
        view.buttonToggleAll.checked = true;
      } else {
        view.buttonToggleAll.checked = false;
      }
    } else {
      view.hideElement(view.clearCompletedButton)
    }
  },
  switchFilter: function (selectFilter) {
    switch (selectFilter) {
      case 0:
        view.todoList.innerHTML = '';
        for (let i = 0; i < model.bufTodoList.length; i++) {
          view.showNewTodo(view.creatNewTodo(model.bufTodoList[i]));
        }
        break;
      case 1:
        let listNotCheked = model.bufTodoList.filter(obj => !obj.checked);
        view.todoList.innerHTML = '';
        for (let i = 0; i < listNotCheked.length; i++) {
          view.showNewTodo(view.creatNewTodo(listNotCheked[i]));
        }
        break;
      case 2:
        let listCheked = model.bufTodoList.filter(obj => obj.checked);
        view.todoList.innerHTML = '';
        for (let i = 0; i < listCheked.length; i++) {
          view.showNewTodo(view.creatNewTodo(listCheked[i]));
        }
        break;
    }
  },
  getIndexById: function (id) {
    return model.bufTodoList.findIndex((elem) => elem.id == id)
  },
  displayClearCompletedButton: function () {
    let arrId = model.getCheckedId(true);
    if (arrId.length) {
      view.showElement(view.clearCompletedButton);
    } else {
      view.hideElement(view.clearCompletedButton);
    }
  },
  makeAllCheked: function (boolean) {
    for (var i = 0; i < model.bufTodoList.length; i++) {
      model.bufTodoList[i].checked = boolean;
      view.makeCheked(model.bufTodoList[i].checked, model.bufTodoList[i].id);
    }
  },
  clickButtonTodoList: function (e) {
    if (e.target.parentNode.parentNode.getAttribute('data-id') !== undefined) {
      var id = e.target.parentNode.parentNode.getAttribute('data-id');
      var index = controller.getIndexById(id);
    }
    if (e.target.className === 'destroy') {
      model.bufTodoList.splice(index, 1);
      view.todoList.removeChild(view.todoList.querySelector('li[data-id="' + id + '"]'));
    } else if (e.target.className === 'toggle') {
      if (model.bufTodoList[index].checked) {
        view.todoList.querySelector('li[data-id="' + id + '"]').className = '';
        model.bufTodoList[index].checked = false;
        if (model.selectFilter === 2) {
          view.removeElement(view.todoList.querySelector('li[data-id="' + id + '"]'))
        }
      } else {
        view.todoList.querySelector('li[data-id="' + id + '"]').className = 'completed';
        model.bufTodoList[index].checked = true;
        if (model.selectFilter === 1) {
          view.removeElement(view.todoList.querySelector('li[data-id="' + id + '"]'))
        }
      }
    }
    let checked = model.getCheckedId(false);
    if (checked.length === 0) {
      view.buttonToggleAll.checked = true;
    } else {
      view.buttonToggleAll.checked = false;
    }
    controller.emptyTodoList();
    controller.displayClearCompletedButton();
    view.showTodoCount(checked.length);
  },
  choiceFiltres: function (e) {
    if (e.target.tagName === 'A' && e.target.className !== 'selected') {
      view.todoFiltres.querySelector('.selected').className = '';
      e.target.className = 'selected';
      switch (e.target.getAttribute('href')) {
        case '#/':
          model.selectFilter = 0;
          break;
        case '#/active':
          model.selectFilter = 1;
          break;
        case '#/completed':
          model.selectFilter = 2;
          break;
      }
      controller.switchFilter(model.selectFilter);
    }
  },
  toggleAll: function (e) {
    controller.makeAllCheked(view.buttonToggleAll.checked);
    controller.displayClearCompletedButton();
    view.showTodoCount(model.getCheckedId(false).length);
  },
  clearCompleted: function (e) {
    var arrChekedId = model.getCheckedId(true);
    for (let i = 0; i < arrChekedId.length; i++) {
      view.removeElement(view.todoList.querySelector('li[data-id="' + arrChekedId[i] + '"]'));
      model.bufTodoList.splice(controller.getIndexById(arrChekedId[i]), 1);
    }
    controller.emptyTodoList();
  },
  addTodo: function (e) {
    controller.addNewTodo();
    controller.emptyTodoList();
    view.showTodoCount(model.getCheckedId(false).length);
    view.buttonToggleAll.checked = false;
  },
  editingTodo: function (e) {
    if (e.target.tagName === 'LABEL') {
      var id = e.target.parentNode.parentNode.getAttribute('data-id');
      var index = controller.getIndexById(id);
      let newInput = document.createElement('input')
      newInput.className = 'edit';
      newInput.value = model.bufTodoList[index].value;
      view.todoList.children[index].className = 'editing';
      view.todoList.children[index].appendChild(newInput);
      var inp = view.todoList.children[index].querySelector('.edit');
      inp.focus();
      inp.addEventListener('blur', (e) => {
        if (inp.value) {
          model.bufTodoList[index].value = inp.value;
          view.todoList.insertBefore(view.creatNewTodo(model.bufTodoList[index]), view.todoList.children[index]);
          view.removeElement(view.todoList.children[index + 1]);
        } else {
          var count = model.getCheckedId(false).length;
          if (model.bufTodoList[index].checked) {
            view.showTodoCount(count);
          } else {
            view.showTodoCount(count - 1);
          }
          if (model.bufTodoList.length === 1) {
            view.hideElement(view.todoFooter);
            view.hideElement(view.todoMain);
          }
          view.removeElement(view.todoList.children[index]);
          model.bufTodoList.splice(index, 1);
        }
      });
    }
  }
};

view.todoList.addEventListener('click', controller.clickButtonTodoList);
view.todoList.addEventListener('dblclick', controller.editingTodo)

// смена фильтров
view.todoFiltres.addEventListener('click', controller.choiceFiltres);

// масовая обработка
view.buttonToggleAll.addEventListener('click', controller.toggleAll);

view.clearCompletedButton.addEventListener('click', controller.clearCompleted);

// обработка добавления тудух
view.todoInput.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    controller.addTodo(e);
  }
});
view.todoInput.addEventListener('blur', controller.addTodo);

// проверка на наличие тудух при загрузке
document.addEventListener("DOMContentLoaded", function (event) {
  controller.displayClearCompletedButton();
  controller.emptyTodoList();
});
