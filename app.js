const addBtn = document.querySelector("#addBtn");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".todo-list");
const noData = document.querySelector(".noData");

const TASKS_KEY = "tasks";

function getTasks(){
    return JSON.parse(localStorage.getItem(TASKS_KEY)) || []
}

function saveTasks(task){
    localStorage.setItem(TASKS_KEY, JSON.stringify(task));
}
// 渲染單個任務
function renderTask(task){
    return `<li class='todo-item' data-id='${task.id}'>
        <span class='textItem'>${task.text}</span>
        <span class='dateItem'>上次編輯時間：${task.date}</span>
        <i class='fa-solid fa-trash'></i></li>`;
}
// 渲染任務列表
function renderTaskList(tasks){
    taskList.innerHTML = tasks.map(task => renderTask(task)).join('');
    noData.style.display = tasks.length > 0 ? "none":"block";
}

function addTask(){
    const date = new Date();
    const dataId = Date.now();
    // 判斷不為空 去除空白
    if(taskInput.value.trim() != ""){
        let newTask = {
            "id": dataId,
            "text": taskInput.value,
            "date": date.toLocaleString()
        };

        // 存入localStorage
        let tasks = getTasks();
        tasks.unshift(newTask);
        saveTasks(tasks);
        renderTaskList(tasks);
    } else {
        alert("請輸入內容");
    }
    taskInput.value = ''; // 輸入完後讓輸入框空白
    taskInput.focus(); // 輸入框 focus
}

function showData(){
    //顯示歷史資料
    const tasks = getTasks();
    renderTaskList(tasks);
}

addBtn.addEventListener("click", addTask);

// 按enter也可以新增
taskInput.addEventListener("keyup", (event) => {
    if(event.key == 'Enter'){
        addTask();
    }
})

// 刪除task
// taskList是整個todo list(按鈕的上一層) 不需要監聽每一顆按鈕
// event delegation 事件指派
// parentElement -> HTMLElement 功能比較多
// parentNode -> NodeElement 可能會拿到註解或空白元素
taskList.addEventListener("click", (event) => {
    const targetName = event.target.nodeName;
    if(targetName == 'I'){
        let taskID = event.target.parentNode.getAttribute("data-id");
        let tasks = getTasks();
        tasks = tasks.filter((el) => el.id !== parseInt(taskID));
        saveTasks(tasks);

        event.target.parentNode.remove(); // 刪除父層

        if(tasks.length == 0){
            noData.style.display = "block";
        }
    }
})

//重新整理後紀錄還在 localStorage
window.onload = function() {
    showData();
};