const addBtn = document.querySelector("#addBtn");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector(".todo-list");
const deleteAllBtn = document.querySelector("#deleteAll");
const noData = document.querySelector(".noData");

const TASKS_KEY = "tasks";

function addTask(){
    const date = new Date();
    const dataId = Date.now();
    // 判斷不為空 去除空白
    if(taskInput.value.trim() != ""){
        let taskContent = `<li class='todo-item' data-id='${dataId}'>
        <span class='textItem'>${taskInput.value}</span>
        <span class='dateItem'>上次編輯時間：${date.toLocaleString()}</span>
        <i class='fa-solid fa-trash'></i></li>`;

        taskList.insertAdjacentHTML("afterbegin", taskContent);

        // 存入localStorage
        let previousTask = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
        previousTask.unshift({
            "id": dataId,
            "text": taskInput.value,
            "date": date.toLocaleString()
        });
        localStorage.setItem(TASKS_KEY, JSON.stringify(previousTask));
    } else {
        alert("請輸入內容");
    }
    taskInput.value = ''; // 輸入完後讓輸入框空白
    taskInput.focus(); // 輸入框 focus
    noData.style.display = "none";
}

function showData(){
    //顯示歷史資料
    const tasks = localStorage.getItem(TASKS_KEY);
    if (tasks != "[]" && tasks != null){
        let t = '';
        JSON.parse(tasks).forEach(element => {
            t += `<li class='todo-item' data-id='${element.id}'>
            <span class='textItem'>${element.text}</span>
            <span class ='dateItem'>上次編輯時間：${element.date}</span>
            <i class='fa-solid fa-trash'></i>
            </li>`
        });
        taskList.insertAdjacentHTML("afterbegin", t);
    } else {
        noData.style.display = "block";
    }
}

function deleteAll(){
    taskList.innerHTML = '';
    localStorage.clear();
    showData();
}

addBtn.addEventListener("click", addTask);
deleteAllBtn.addEventListener("click", deleteAll);

// 按enter也可以新增
taskInput.addEventListener("keyup", (event) => {
    if(event.code == 'Enter'){
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
        let tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
        tasks = tasks.filter((el) => el.id !== parseInt(taskID));
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

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