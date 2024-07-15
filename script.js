function loadTask() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function createTask(title, description, duedate) {
        const data = {
            id: Date.now(),
            title: title,
            description: description,
            duedate: duedate,
            completed: false
        };
        console.log(tasks)
        tasks.push(data);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTask(filteredTask = tasks) {
        const activeList = document.getElementById("active-task-container")
        const completedList = document.getElementById("completed-task-container")
        completedList.innerHTML = '';
        activeList.innerHTML = '';

        filteredTask.forEach(task => {
            const taskData = createTaskCard(task)
            if (task.completed) {
                completedList.appendChild(taskData)
            }
            else {
                activeList.appendChild(taskData)
            }
        });
    }

    let clear = document.getElementById("clear-completed-btn");
    clear.addEventListener('click', function(){
        tasks = tasks.filter(t => t.completed !== true)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        renderTask();
    })

    let search = document.getElementById("search-input")
    search.addEventListener('input', function(){
        let searchInput = this.value.toLowerCase();
        let searchedTasks = tasks.filter(t => t.title.toLowerCase().includes(searchInput));
        renderTask(searchedTasks)
    })
    
    let sort = document.getElementById("sort");
    sort.addEventListener('change', function(event){
        let sortedTasks
        if(sort.value == 'Newest First'){
            sortedTasks = tasks.sort((a,b) => b.id -a.id)
        }
        else if(sort.value == 'Oldest First'){
            sortedTasks = tasks.sort((a,b) => a.id - b.id)
        }
        renderTask(sortedTasks)
    })
    let form = document.getElementById("add-task-form")
    form.addEventListener('submit', function (event) {
        event.preventDefault()
        const title = document.getElementById("task-name").value;
        const description = document.getElementById("task-text").value;
        const duedate = document.getElementById("task-date").value;

        createTask(title, description, duedate);
        renderTask();
        document.getElementById("add-task-form").reset(); 
    })
    
    function editTask(taskId) {
        editForm = document.getElementById("edit-task-form")
        const task = tasks.find(task1 => task1.id == taskId)

        document.getElementById("update-task-name").value = task.title;
        document.getElementById("update-task-text").value = task.description;
        document.getElementById("update-task-date").value = task.duedate;

        editForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const updatedTaskName = document.getElementById("update-task-name").value;
            const updatedTaskDescription = document.getElementById("update-task-text").value;
            const updatedDueDate = document.getElementById('update-task-date').value;

            const task = tasks.find(task1 => task1.id == taskId)
            if (task) {
                task.title = updatedTaskName;
                task.description = updatedTaskDescription;
                task.duedate = updatedDueDate;

                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTask();
            }
        })
    }
    function deleteTask(taskId) {
        let deleteBtn = document.getElementById("delete-btn")
        deleteBtn.addEventListener('click', function () {
            tasks = tasks.filter(task1 => task1.id !== taskId)
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTask();
        })
    }
    function changetaskStatus(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTask();
    }

    function createTaskCard(task) {

        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        }
        //container
        const taskCardContainer = document.createElement('div');
        taskCardContainer.className = 'task-card-container';

        //task infos
        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        //checkbox
        const checkBoxInput = document.createElement('input');
        checkBoxInput.type = 'checkbox';
        checkBoxInput.className = 'check-box-input';
        checkBoxInput.id = 'check-box';
        checkBoxInput.addEventListener('change', function () {
            changetaskStatus(task.id)
        })

        //task detail
        const taskDetailContainer = document.createElement('div');
        taskDetailContainer.className = 'task-detail-container';

        //task title content
        const taskTitleContent = document.createElement('div');
        taskTitleContent.className = 'task-title-content';

        const taskTitleSpan = document.createElement('span');
        taskTitleSpan.textContent = task.title;

        const taskDotImg = document.createElement('img');
        taskDotImg.src = 'images/yellow-dot.svg';

        taskTitleContent.appendChild(taskTitleSpan);
        taskTitleContent.appendChild(taskDotImg);

        //task description
        const taskDescription = document.createElement('p');
        taskDescription.id = 'task-description';
        taskDescription.textContent = task.description;

        //task duedate
        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';

        const calendarImg = document.createElement('img');
        calendarImg.src = 'images/active-calender.svg';

        const taskDueDate = document.createElement('span');
        taskDueDate.id = 'task-duedate';
        taskDueDate.textContent = `by ${formatDate(task.duedate)}`;

        taskDate.appendChild(calendarImg);
        taskDate.appendChild(taskDueDate);

        taskDetailContainer.appendChild(taskTitleContent);
        taskDetailContainer.appendChild(taskDescription);
        taskDetailContainer.appendChild(taskDate);

        taskInfo.appendChild(checkBoxInput);
        taskInfo.appendChild(taskDetailContainer);

        const taskBtn = document.createElement('div');
        taskBtn.className = 'task-btn';

        const editBtnImg = document.createElement('img');
        editBtnImg.src = 'images/edit-icon.svg';
        editBtnImg.className = 'edit-btn';
        editBtnImg.alt = 'Edit';
        editBtnImg.dataset.bsToggle = 'modal'
        editBtnImg.dataset.bsTarget = '#editModal';
        editBtnImg.addEventListener('click', function () {
            editTask(task.id);
        })

        const deleteBtnImg = document.createElement('img');
        deleteBtnImg.src = 'images/delete-icon.svg';
        deleteBtnImg.className = 'delete-btn';
        deleteBtnImg.alt = 'Delete';
        deleteBtnImg.dataset.bsToggle = 'modal'
        deleteBtnImg.dataset.bsTarget = '#deleteModal';
        deleteBtnImg.addEventListener('click', function () {
            deleteTask(task.id);
        })

        taskBtn.appendChild(editBtnImg);
        taskBtn.appendChild(deleteBtnImg);

        taskCardContainer.appendChild(taskInfo);
        taskCardContainer.appendChild(taskBtn);
        if (task.completed) {
            checkBoxInput.style.backgroundImage = 'url(images/tick.svg)'
            checkBoxInput.style.backgroundSize = 'contain';
            checkBoxInput.style.backgroundRepeat = 'no-repeat';
            checkBoxInput.style.backgroundPosition = 'center';
            checkBoxInput.style.border = 'none';
            taskDotImg.src = 'images/green-dot.svg'
        }
        if (new Date(task.duedate) < new Date()) {
            calendarImg.src = 'images/overdue-calender.svg';
            taskDueDate.style.color = '#C03503';
            taskDate.style.borderRadius = '4px';
            taskDate.style.backgroundColor = '#C035030F';
            taskDate.style.padding = '2px 8px';

        }
        return taskCardContainer;
    }

    renderTask();
}

loadTask();