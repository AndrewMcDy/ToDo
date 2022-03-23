(function () {
    
    let localArray = [];
    localArray = JSON.parse(localStorage.getItem('localArray'));
    let localDoneIndex = []
    localDoneIndex = JSON.parse(localStorage.getItem('localDoneIndex'));
    
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group');
        input.classList.add('form-control');
        input.placeholder = 'Введіть назву нової справи';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Додати справу';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        let textItem = document.createElement('div');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item');
        textItem.classList.add('text-item');
        buttonGroup.classList.add('btn-group');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Видалити';

        textItem.textContent = name;

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(textItem);
        item.append(buttonGroup);

        // Тест обробників подій зразу, а не під кінець
        doneButton.addEventListener('click', function () {            
            textItem.classList.toggle('text-item-success');
            
            if (localDoneIndex[localArray.indexOf(name)] === '0') {
                localDoneIndex[localArray.indexOf(name)] = '1';
                doneButton.textContent = 'Упс, ще раз виконати';
            } else {
                localDoneIndex[localArray.indexOf(name)] = '0';
                doneButton.textContent = 'Готово';
            }
            localStorage.setItem('localDoneIndex', JSON.stringify(localDoneIndex));
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Ви впевнені?')) {
                localArray.splice(localArray.indexOf(name), 1);
                localStorage.setItem('localArray', JSON.stringify(localArray));
                localDoneIndex.splice(localDoneIndex.indexOf(name), 1);
                localStorage.setItem('localDoneIndex', JSON.stringify(localDoneIndex));                
                item.remove();
            }
        });

        return {
            item,
            textItem,
            doneButton,
            deleteButton,
        };
        
    }

    function createTodoApp(container, title = 'Список справ') {

        // localArray = JSON.parse(localStorage.getItem('localArray'));
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        //Виведення збережених справ
        localArray = JSON.parse(localStorage.getItem('localArray'));        
        if (localArray) {
            for (let i = 0; i < localArray.length; ++i) {
                let localTodoItem = createTodoItem(localArray[i]);
                todoList.append(localTodoItem.item);
                if (localDoneIndex[i] === '1') {                    
                    localTodoItem.textItem.classList.add('text-item-success');
                    localTodoItem.doneButton.textContent = 'Упс, ще раз виконати';
                };
            };
        }    

        todoItemForm.input.addEventListener('input', function () {
            if (todoItemForm.input.value == "") {
                todoItemForm.button.disabled = true;
            } else {
                todoItemForm.button.disabled = false;
            }
        });        

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }
            
            let todoItem = createTodoItem(todoItemForm.input.value);

            todoItemForm.button.disabled = true; // Деактивація кнопки "Додати справу" після додавання

            todoList.append(todoItem.item);

            // Запис в local storage новоствореної справи

            localArray = localArray || [];
            console.log(todoItemForm.input.value);
            localArray.push(todoItemForm.input.value);            
            localStorage.setItem('localArray', JSON.stringify(localArray));
            localDoneIndex = localDoneIndex || [];
            localDoneIndex.push('0');
            localStorage.setItem('localDoneIndex', JSON.stringify(localDoneIndex));

            todoItemForm.input.value = '';
        });

    }

    document.addEventListener('DOMContentLoaded', function () {
        createTodoApp(document.getElementById('todo-app'), 'Мій список справ')
    });
     
    // localStorage.clear();
})();