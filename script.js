document.addEventListener('DOMContentLoaded', function() {
    function createTask(title, description, duedate) {
        let data = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = {
            id: Date.now(),
            title: title,
            description: description,
            duedate: duedate,
            completed: false
        };
        data.push(task);
        localStorage.setItem('tasks', JSON.stringify(data));
    }
    let form = document.querySelector('#task-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('task-name').value;
        const description = document.getElementById('task-text').value;
        const duedate = document.getElementById('task-date').value;

        createTask(title, description, duedate);
        loadTask();
        this.reset();
    });

    function loadTask() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let taskListContainer = document.getElementById('task-list');
        let completedTaskListContainer = document.getElementById('completed-task-list');

        taskListContainer.innerHTML = "";
        completedTaskListContainer.innerHTML = "";

        tasks.forEach(task => {
            createTaskCard(task, taskListContainer,completedTaskListContainer);
        });
    }
    window.editTask = function(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('edit-task-name').value = task.title;
            document.getElementById('edit-task-text').value = task.description;
            document.getElementById('edit-task-date').value = task.duedate;        }
    };

    document.getElementById('edit-task-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedTitle = document.getElementById('edit-task-name').value;
        const updatedDescription = document.getElementById('edit-task-text').value;
        const updatedDuedate = document.getElementById('edit-task-date').value;

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].title = updatedTitle;
            tasks[taskIndex].description = updatedDescription;
            tasks[taskIndex].duedate = updatedDuedate;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTask();
            document.querySelector('#editModal .btn-close').click();
        }
    });

    window.confirmDeleteTask = function(taskId) {
        document.getElementById('delete-task-id').value = taskId;
    };

    document.getElementById('delete-task-button').addEventListener('click', function() {
        const taskId = parseInt(document.getElementById('delete-task-id').value);
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTask();
        document.querySelector('#deleteModal .btn-close').click();
    });

    function toggleTaskCompletion(taskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTask();
        }
    }
    let clear=document.getElementById('clear-btn');
    clear.addEventListener('click', function() {
        let data = JSON.parse(localStorage.getItem('tasks')) || [];
        data=data.filter((t)=> t.completed !== true);
        localStorage.setItem('tasks', JSON.stringify(data));
        loadTask();
    });
    function createTaskCard(task, taskListContainer,completedTaskListContainer){
        let taskCard = document.createElement('div');
            taskCard.className = 'task-card';

            let taskCheckInfo = document.createElement('div');
            taskCheckInfo.className = 'task-check-info';

            let checkDiv = document.createElement('div');
            checkDiv.className = 'check';
            let checkInput = document.createElement('input');
            checkInput.type = 'checkbox';
            checkInput.className = 'task-check';
            checkInput.checked = task.completed;
            checkInput.addEventListener('change', function() {
                toggleTaskCompletion(task.id);
            });
            checkDiv.appendChild(checkInput);

            let taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';
            let taskTitle = document.createElement('div');
            taskTitle.className = 'task-title';
            let taskHeading = document.createElement('span');
            taskHeading.className = 'task-heading';
            taskHeading.id = 'task-title';
            taskHeading.textContent = task.title;
            let taskTitleImg = document.createElement('img');
            taskTitleImg.src = 'images/yellow-dot.svg';
            taskTitle.appendChild(taskHeading);
            taskTitle.appendChild(taskTitleImg);

            let taskDescription = document.createElement('div');
            taskDescription.className = 'task-description';
            taskDescription.id = 'task-info';
            let taskDescriptionText = document.createElement('p');
            taskDescriptionText.textContent = task.description;
            taskDescription.appendChild(taskDescriptionText);

            let taskDueDate = document.createElement('div');
            taskDueDate.className = 'active-task-date';
            taskDueDate.id = 'task-due';
            let taskDueDateImg = document.createElement('img');
            taskDueDateImg.src = 'images/calender.svg';
            let taskDueDateText = document.createElement('p');
            taskDueDateText.className = 'date';
            taskDueDateText.style.margin = '0';
            taskDueDateText.textContent = `by ${task.duedate}`;
            taskDueDateText.style.fontWeight = '600';   
            taskDueDate.appendChild(taskDueDateImg);
            taskDueDate.appendChild(taskDueDateText);
            
            if(new Date(task.duedate) < new Date()){
                taskDueDateText.style.color = '#C03503';
            }
            if(new Date(task.duedate) < new Date()){
                taskDueDate.style.backgroundColor = '#C035030F';
                taskDueDate.style.padding= '2px 8px';
                taskDueDate.style.borderRadius= '4px';
                taskDueDate.style.width= 'fit-content';
            }
            if(new Date(task.duedate) < new Date()){
                taskDueDateImg.src = 'images/calender-red.svg';
            }

            taskInfo.appendChild(taskTitle);
            taskInfo.appendChild(taskDescription);
            taskInfo.appendChild(taskDueDate);

            taskCheckInfo.appendChild(checkDiv);
            taskCheckInfo.appendChild(taskInfo);

            let taskButton = document.createElement('div');
            taskButton.className = 'task-button';

            let editButton = document.createElement('button');
            editButton.className = 'btn btn-outline-secondary edit-btn';
            editButton.type = 'button';
            editButton.id = 'button-addon2';
            editButton.dataset.bsToggle = 'modal';
            editButton.dataset.bsTarget = '#editModal';
            editButton.onclick = function() { editTask(task.id); };
            let editButtonImg = document.createElement('img');
            editButtonImg.src = 'images/edit.svg';
            editButton.style.border='none';
            editButton.appendChild(editButtonImg);

            let deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-outline-secondary delete-btn';
            deleteButton.type = 'button';
            deleteButton.id = 'button-addon2';
            deleteButton.dataset.bsToggle = 'modal';
            deleteButton.dataset.bsTarget = '#deleteModal';
            deleteButton.onclick = function() { confirmDeleteTask(task.id); };
            let deleteButtonImg = document.createElement('img');
            deleteButtonImg.src = 'images/delete.svg';
            deleteButton.style.border='none';
            deleteButton.appendChild(deleteButtonImg);

            taskButton.appendChild(editButton);
            taskButton.appendChild(deleteButton);

            taskCard.appendChild(taskCheckInfo);
            taskCard.appendChild(taskButton);

            if (task.completed) {
                completedTaskListContainer.appendChild(taskCard);
            } else {
                taskListContainer.appendChild(taskCard);
            }
            if (task.completed) {
                taskTitleImg.src = 'images/green-dot.svg';
            }
    }
    function sortTask(){
        let newSort= document.getElementById("new");
        let oldSort=document.getElementById("old");
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskListContainer = document.getElementById('task-list');
        const completedTaskListContainer = document.getElementById('completed-task-list');

        taskListContainer.innerHTML = "";
        completedTaskListContainer.innerHTML = "";
        
    }
   
    function searchTask(){
        let searchInput = document.getElementById("search-input").value.toLowerCase();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskListContainer = document.getElementById('task-list');
        const completedTaskListContainer = document.getElementById('completed-task-list');

        taskListContainer.innerHTML = "";
        completedTaskListContainer.innerHTML = "";

        tasks.forEach(task=>    {
            if(task.title.toLowerCase().includes(searchInput)){
                createTaskCard(task,taskListContainer,completedTaskListContainer);
            }
        });
    }
    document.getElementById('search-input').addEventListener('input', searchTask);
    loadTask();

});
