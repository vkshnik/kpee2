

function createTab() {
    let l = '';
    if (localStorage.key(0) == 0) {
        return alert('Создайте проект')
    }

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('.kpee')) {
            l += `<div class ="pag"><input type="checkbox" class = "chooseFile" id = "${localStorage.key(i)}" value = "${localStorage.key(i)}" >
        <label class ="pag2"  for="${localStorage.key(i)}">${localStorage.key(i)}</label>
        <input type="button" class = "btnclose" onclick = "closeFile()"  value="&#x2715" ></div>`
        }
    }

    return l;
}

function recentTab() {
    let l = '';
    if (localStorage.key(0) == 0) {
        return alert('Создайте проект')
    }

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('.kpee')) {
            l += `<a class ="pag1">
        <label  for="${localStorage.key(i)}">${localStorage.key(i)}</label>
        </a><br>`
        }
    }

    return l;
}

function download(data, filename, type) {
    let file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        a.pathname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    }
}

function createFile() {
    let fn;
    let name;
    let countStart = '';
    let countEnd = '';
    let stadia = '';
    let sprint = '';
    let time = '';
    let author = '';
    let project = {};
    document.getElementsByClassName('modal1')[0].style.display = 'block';
    document.getElementById('btnProject').onclick = () => {

        name = document.getElementById('nameProject').value;
        countStart = document.getElementById('countStart').value;
        countEnd = document.getElementById('countEnd').value;
        time = (new Date(countEnd).getTime() - new Date(countStart).getTime()) / (1000 * 3600 * 24);
        sprint = Math.ceil(time / 7);
        stadia = document.getElementById('stadia')[document.getElementById('stadia').selectedIndex].value;
        author = document.getElementById('author').value;

        fn = name + '.kpee';

        if (fn == '.kpee' || author == '') {
            return alert('Заполните все поля');
        }
        else {
            project = {
                name: name,
                countStart: countStart,
                countEnd: countEnd,
                time: time,
                sprint: sprint,
                stadia: stadia,
                author: author,
                matrix: [],
            };

            localStorage.setItem(fn, JSON.stringify(project));
            //let ls = localStorage.getItem(fn);
            //download(ls, fn);

            let w = createTab();
            if (w !== undefined) {
                document.getElementById('tabs').innerHTML = w
            };

            let tabs = document.querySelectorAll('input[type="checkbox"][class="chooseFile"]');
            for (key in tabs) {
                if (tabs[key].id === fn)
                    tabs[key].checked = true;
            };

            sessionStorage.setItem('tabs', JSON.stringify(fn));

            document.getElementsByClassName('modal1')[0].style.display = 'none';

            data = JSON.parse(localStorage.getItem(fn));

            document.getElementById('_nameProject').innerHTML = data.name;
            document.getElementById('_start').innerHTML = data.countStart;
            document.getElementById('_end').innerHTML = data.countEnd;
            document.getElementById('_stadia').innerHTML = data.stadia;
            document.getElementById('sprint').innerHTML = data.sprint;
            document.getElementById('time').innerHTML = data.time;
            document.getElementById('_author').innerHTML = data.author;

            document.getElementById('main').innerHTML = fill() + fill_total1();


        }
        window.location.reload();
    }
};

function changeTab() {
    let tabs = document.querySelectorAll('input[type="checkbox"][class="chooseFile"]');


    for (key in tabs) {
        if (tabs[key].id === JSON.parse(sessionStorage.getItem('tabs'))) {
            tabs[key].checked = true;


        }
        else tabs[key].checked = false;
    }


    document.addEventListener('click', (e) => {
        if (e.target.className === "chooseFile") {
            for (key in tabs) {
                if (tabs[key].id === e.target.id) {
                    tabs[key].checked = true;
                }
                else tabs[key].checked = false;
            }
            //for (key in tabs) tabs[key].checked = false
            //e.target.checked = true
            sessionStorage.setItem('tabs', JSON.stringify(e.target.id));

            //let name_file = JSON.parse(sessionStorage.getItem('tabs'));
            let data = JSON.parse(localStorage.getItem(e.target.id));
            let a = sessionStorage.getItem('tabs');
            if (!data) {
                return
            }

            document.getElementById('_nameProject').innerHTML = data.name;
            document.getElementById('_start').innerHTML = data.countStart;
            document.getElementById('_end').innerHTML = data.countEnd;
            document.getElementById('_stadia').innerHTML = data.stadia;
            document.getElementById('sprint').innerHTML = data.sprint;
            document.getElementById('time').innerHTML = data.time;
            document.getElementById('_author').innerHTML = data.author;

            document.getElementById('main').innerHTML = fill() + fill_total1();
            fill_card();
            report_workDays()
        }

    })


}

function saveLocalFile() {
    let filename = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    let data = localStorage.getItem(filename);
    download(data, filename)
}

function openLocalFile() {

    document.getElementById('777').addEventListener('change', () => {

        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) == document.getElementById('777').files[0].name ||
                !document.getElementById('777').files[0].name) {
                alert("Файл уже открыт");
                window.location.reload();
            }
        }

        let reader = new FileReader();

        reader.readAsText(document.getElementById('777').files[0]);

        reader.onload = () => {
            if (reader.result.includes("stadia")) {
                localStorage.setItem(document.getElementById('777').files[0].name, reader.result)
            }
            else {
                alert("Файл поврежден");
                return
            }
        }

        window.location.reload();



    })
}



function closeFile() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    localStorage.removeItem(fn);
    sessionStorage.clear();
    window.location.reload();
}



class Card {
    constructor(color, id) {
        this.color = color;
        this._card = document.createElement('div');
        this._card_info = document.createElement('div');
        this._card.style.backgroundColor = color;
        this._card.id = id;
        this._card.innerHTML = id;

        //this._card.setAttribute('data-bs-toggle', 'popover');
        //this._card.setAttribute('title', 'Карточка задачи');
        //this._card.setAttribute('data-bs-content', '///');
        /*CARD STYLE*/
        this._card.draggable = true;
        this._card.classList.add('card1');
        /*TASK CARD STYLE*/
        //this._card_info.draggable = true;
        this._card_info.classList.add('card_info');

        //this._card_info.style.display = 'none';
        this._card_info.innerHTML = `
            <h3>Номер задачи ${id} </h3>
            <div class="task">
            <textarea id='name${id}' rows ="1" placeholder='Введите название задачи'></textarea>
            <textarea id='description${id}' rows ="3" placeholder='Введите описание задачи'></textarea>
            <textarea id='comments${id}' rows ="3" placeholder='Введите комментарий'></textarea>
            </div>
            <div class="doers">
            <label for='doer${id}'>Выберите исполнителя</label>
            <select id='doer${id}' class = "select_doers">
            <option>Выберите исполнителя</option>
            </select>
            <label for='depart${id}'>Отдел</label>
            <input id="depart${id}" value="">
            <label for='position${id}'>Позиция</label>
            <input id="position${id}" value="">
            <label for='salary${id}' hidden>Вознаграждение</label>
            <input id="salary${id}" value="" hidden>
            </div>
            <div class="duration">
            <label for='startPlanTask${id}'>Плановая дата начала</label>
            <input id='startPlanTask${id}' type='date' value="2025-01-01">
            <label for='endPlanTask${id}'>Плановая дата окончания</label>
            <input id='endPlanTask${id}' type='date' value="2025-01-02">
            <label for='startFactTask${id}'>Фактическая дата начала</label>
            <input id='startFactTask${id}' type='date' value="2025-01-01">
            <label for='endFactTask${id}'>Фактическая дата окончания</label>
            <input id='endFactTask${id}' type='date' value="2025-01-02">
            </div>
            <div class="isDone">
            <label for='isDone${id}'>Задача выполнена</label>
            <input id='isDone${id}' type='checkbox' >
            </div>
            <div class="btnTask">
            <button class="btnapply" >применить</button>
            <button class="btnclose_" onclick="_close()">закрыть</button>
            </div>
       `;
        this._card_info.id = id;
        this._card.appendChild(this._card_info)

    }

    createCard(x) {
        x.appendChild(this._card)

    }

    /* deleteCard(x) {
         x.remove()
     }*/

}





function fill() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    let data = JSON.parse(localStorage.getItem(fn));




    let sprint = data.sprint;
    let STAGE = '';

    if (data.stadia == "ОТР") {
        STAGE = _teo;

    }
    else if (data.stadia == "ПД") {
        STAGE = _pr;
    }
    else if (data.stadia == "ПД линейный") {
        STAGE = _pr_line;
    }
    else if (data.stadia == "Стадия РД") {
        STAGE = _rd;
    }
    let date = data.countStart;
    let date1 = data.countEnd;
    let start;
    let end;
    let a = '';
    let count = '';


    for (let i = 0; i < STAGE.length; i++) {
        a += `<div class="cell_header">${STAGE[i]}</div>`
    };

    for (let j = 0; j < (Number(sprint)); j++) {
        start = new Date(Date.parse(date) + 7 * 86400000 * j).toLocaleDateString('ru');
        end = new Date(Date.parse(date) + 86400000 * (7 * (j + 1) - 1)).toLocaleDateString('ru');
        if (new Date(Date.parse(date) + 86400000 * (7 * (j + 1) - 1)) > new Date(Date.parse(date1))) end = new Date(Date.parse(date1)).toLocaleDateString('ru');

        count += `<div class="cell_sprint" >СПРИНТ ${j} <br> 
        ${start}- <br>${end} </div>`
        for (let i = 1; i < STAGE.length - 1; i++) {
            count += `<div class="cell" id = "cell_${i}_${j}" ></div>`
        }
        count += `<div class="cell_sprint_tot" id="cell_sprint_tot${j}" ></div>`
    };

    document.getElementById('main').style.gridTemplateColumns = `repeat(${STAGE.length},auto)`;

    return a + count;
};
function fill_card() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    let data = JSON.parse(localStorage.getItem(fn));
    let _card;



    let color;
    for (let i = 0; i < data.matrix.length; i++) {
        if (data.matrix[i].isDone)
            color = 'lightgreen'
        else color = 'lightblue'
        _card = new Card(color, data.matrix[i].id);
        _card.createCard(document.getElementById(`${data.matrix[i].cell}`));

        _card._card_info.style.display = 'none';

        doers.forEach((element, key) => {

            document.getElementById('doer' + _card._card_info.id)[key] = new Option(element.name, element.name)

        })
        document.getElementById('name' + i).value = data.matrix[i].name;
        document.getElementById('description' + i).value = data.matrix[i].description;
        document.getElementById('comments' + i).value = data.matrix[i].comments;
        document.getElementById('doer' + i).value = data.matrix[i].doer;

        document.getElementById('depart' + i).value = data.matrix[i].depart;
        document.getElementById('position' + i).value = data.matrix[i].position;
        document.getElementById('salary' + i).value = data.matrix[i].salary;

        document.getElementById('startPlanTask' + i).value = data.matrix[i].startPlanTask;
        document.getElementById('endPlanTask' + i).value = data.matrix[i].endPlanTask;
        document.getElementById('startFactTask' + i).value = data.matrix[i].startFactTask;
        document.getElementById('endFactTask' + i).value = data.matrix[i].endFactTask;
        document.getElementById('isDone' + i).checked = data.matrix[i].isDone;

        /* _card._card.setAttribute("data-bs-content", 
             `
             Имя задачи: ${data.matrix[i].name} \n
             Наименование задачи: ${data.matrix[i].description} \n
             Исполнитель: ${data.matrix[i].doer} \n
             Плановая дата начала: ${data.matrix[i].startPlanTask} \n
             Плановая дата окончания: ${data.matrix[i].endPlanTask} \n
             Плановая продолжительность: ${Number(new Date(data.matrix[i].endPlanTask).getDate() -new Date(data.matrix[i].startPlanTask).getDate())} \n
             Фактическая дата начала: ${data.matrix[i].startFactTask} \n
             Фактическая дата окончания: ${data.matrix[i].endFactTask} \n
             Фактическая продолжительность: ${Number(new Date(data.matrix[i].endFactTask).getDate() -new Date(data.matrix[i].startFactTask).getDate())} \n
             
             `)*/
    };

}




function fill_total1() {
    let STAGE = '';
    if (document.getElementById('_stadia').textContent == "ОТР") {
        STAGE = _teo;

    }
    else if (document.getElementById('_stadia').textContent == "ПД") {
        STAGE = _pr;
    }
    else if (document.getElementById('_stadia').textContent == "ПД линейный") {
        STAGE = _pr_line;
    }
    else if (document.getElementById('_stadia').textContent == "РД") {
        STAGE = _rd;
    }

    let count = '';
    for (let i = 1; i < STAGE.length; i++) {
        count += `<div class="cell_total" id = "cell_total${i}" ></div>`

    }
    //document.getElementById('total1').style.display = 'grid';
    //document.getElementById('total1').style.gridTemplateColumns = `repeat(${STAGE.length},auto)`;


    return `<div class="cell_total" id = "cell_total_tot" >Всего</div>` + count;
};


document.addEventListener("contextmenu", (e) => {
    if (document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0] == undefined) {
        console.log('для продолжения работы создайте проект')
    }
    else {

        //e.preventDefault();
        let _card;
        let _card_id;
        let data = {}
        let menu = document.getElementById('ctxmenu');
        let dragged = null;
        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        let data1 = JSON.parse(localStorage.getItem(fn));
        let qwerty;


        let matrix = data1.matrix;


        if (e.target.className === 'cell' || e.target.className === 'card1') {
            menu.style.display = 'block';
            menu.style.zIndex = 3;
            menu.style.left = e.pageX + 'px';
            menu.style.top = e.pageY + 'px';
        }
        else menu.style.display = 'none';

        document.getElementById('task').onclick = () => {
            if (e.target.className === 'cell') {

                _card_id = matrix.length;
                _card = new Card('lightblue', _card_id);
                _card.createCard(e.target);
                _card._card_info.style.display = 'none';
                menu.style.display = 'none';
                data = {
                    cell: e.target.id,
                    id: _card._card_info.id,
                    name: document.getElementById('name' + _card._card_info.id).value,
                    description: document.getElementById('description' + _card._card_info.id).value,
                    comments: document.getElementById('comments' + _card._card_info.id).value,
                    doer: document.getElementById('doer' + _card._card_info.id)[document.getElementById('doer' + _card._card_info.id).selectedIndex].textContent,
                    depart: document.getElementById('depart' + _card._card_info.id).value,
                    position: document.getElementById('position' + _card._card_info.id).value,
                    salary: document.getElementById('salary' + _card._card_info.id).value,
                    startPlanTask: document.getElementById('startPlanTask' + _card._card_info.id).value,
                    endPlanTask: document.getElementById('endPlanTask' + _card._card_info.id).value,
                    startFactTask: document.getElementById('startFactTask' + _card._card_info.id).value,
                    endFactTask: document.getElementById('endFactTask' + _card._card_info.id).value,
                    isDone: false,
                    aspeed: document.getElementsByClassName('cell_sprint')[0].textContent,
                }
                matrix.push(data);
                qwerty = {
                    name: data1.name,
                    countStart: data1.countStart,
                    countEnd: data1.countEnd,
                    time: data1.time,
                    sprint: data1.sprint,
                    stadia: data1.stadia,
                    author: data1.author,
                    matrix: matrix,

                };

                localStorage.setItem(fn, JSON.stringify(qwerty));
            }
            window.location.reload();
        }

        document.getElementById('edittask').onclick = () => {
            if (e.target.className === 'card1') {

                menu.style.display = 'none';
                e.target.childNodes[1].style.display = 'grid';
            };
        };
        document.getElementById('deletetask').onclick = () => {
            if (e.target.className === 'card1') {

                menu.style.display = 'none';
                matrix.splice(Number(e.target.id), 1);
                e.target.remove();

                qwerty = {
                    name: data1.name,
                    countStart: data1.countStart,
                    countEnd: data1.countEnd,
                    time: data1.time,
                    sprint: data1.sprint,
                    stadia: data1.stadia,
                    author: data1.author,
                    matrix: matrix,

                };

                localStorage.setItem(fn, JSON.stringify(qwerty));
            }
        };
    }
});

document.addEventListener('dblclick', (e) => {
    if (e.target.className === 'card1') {
        if(e.pageX+450 > window.innerWidth){
            e.target.childNodes[1].style.left = (e.pageX -450) + 'px';
        }

        e.target.childNodes[1].style.display = 'grid';
    };
})

document.addEventListener('keydown',(e)=>{
    if(e.key == "Escape") {
       _close();
    }
})
document.addEventListener('click', (e) => {
    if (e.target.className === 'cell') {
        document.getElementById('ctxmenu').style.display = 'none';
    }

    if (e.target.id === "btnProject_close") {
        document.getElementsByClassName('modal1')[0].style.display = 'none';
    }

    if (e.target.className === 'btnapply') {
        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        let data1 = JSON.parse(localStorage.getItem(fn));
        let qwerty;
        let data = {};
        let count = Number(e.target.parentElement.parentElement.id);
        let matrix1 = data1.matrix;
        let ch = document.getElementById('isDone' + count);
        let chState = false;
        if (ch.checked) {
            chState = true;
            e.target.parentElement.parentElement.parentElement.style.backgroundColor = 'lightgreen'
        }
        else e.target.parentElement.parentElement.parentElement.style.backgroundColor = 'lightblue'


        data = {
            cell: e.target.parentElement.parentElement.parentElement.parentElement.id,
            id: count.toString(),
            name: document.getElementById('name' + count).value,
            description: document.getElementById('description' + count).value,
            comments: document.getElementById('comments' + count).value,
            doer: document.getElementById('doer' + count)[document.getElementById('doer' + count).selectedIndex].textContent,
            depart: document.getElementById('depart' + count).value,
            position: document.getElementById('position' + count).value,
            salary: document.getElementById('salary' + count).value,
            startPlanTask: document.getElementById('startPlanTask' + count).value,
            endPlanTask: document.getElementById('endPlanTask' + count).value,
            startFactTask: document.getElementById('startFactTask' + count).value,
            endFactTask: document.getElementById('endFactTask' + count).value,
            isDone: chState,
            aspeed: document.getElementsByClassName('cell_sprint')[0].textContent,
        }
        matrix1.splice(count, 1, data);


        qwerty = {
            name: data1.name,
            countStart: data1.countStart,
            countEnd: data1.countEnd,
            time: data1.time,
            sprint: data1.sprint,
            stadia: data1.stadia,
            author: data1.author,
            matrix: matrix1,
        };

        localStorage.setItem(fn, JSON.stringify(qwerty));
        report_workDays()
    }

})

document.addEventListener('dragstart', (e) => {
    dragged = e.target;

})
document.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.target.className === 'cell') {
        e.target.style.border = '2px dashed blue'

    }
})

document.addEventListener("dragleave", (e) => {
    // prevent default to allow drop
    e.preventDefault();
    e.target.style.border = ''
});

document.addEventListener('drop', (e) => {

    if (e.target.className === 'cell') {
        dragged.parentNode.removeChild(dragged);
        e.target.appendChild(dragged);
        e.target.style.border = '';

        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        let data1 = JSON.parse(localStorage.getItem(fn));
        let qwerty;
        let data = {};
        let count = Number(dragged.id);
        let matrix1 = data1.matrix;

        data = {
            cell: e.target.id,
            id: matrix1[count].id,
            name: matrix1[count].name,
            description: matrix1[count].description,
            comments: matrix1[count].comments,
            doer: matrix1[count].doer,
            depart: matrix1[count].depart,
            position: matrix1[count].position,
            salary: matrix1[count].salary,
            startPlanTask: matrix1[count].startPlanTask,
            endPlanTask: matrix1[count].endPlanTask,
            startFactTask: matrix1[count].startFactTask,
            endFactTask: matrix1[count].endFactTask,
            isDone: matrix1[count].isDone,
            aspeed: document.getElementsByClassName('cell_sprint')[0].textContent,
        }
        matrix1.splice(count, 1, data);


        qwerty = {
            name: data1.name,
            countStart: data1.countStart,
            countEnd: data1.countEnd,
            time: data1.time,
            sprint: data1.sprint,
            stadia: data1.stadia,
            author: data1.author,
            matrix: matrix1,
        };

        localStorage.setItem(fn, JSON.stringify(qwerty));

    }
    report_workDays()

})



function _close() {
    for (let i = 0; i < document.querySelectorAll("button.btnclose_").length; i++) {
        document.querySelectorAll("button.btnclose_")[i].parentElement.parentElement.style.display = 'none';

    }
}

document.addEventListener('change', (e) => {
    if (e.target.className == "select_doers") {
        for (let i = 0; i < doers.length; i++) {
            if (doers[i].name == document.getElementById('doer' + e.target.parentElement.parentElement.id)[document.getElementById('doer' + e.target.parentElement.parentElement.id).selectedIndex].textContent) {
                document.getElementById('depart' + e.target.parentElement.parentElement.id).value = doers[i].depart;
                document.getElementById('position' + e.target.parentElement.parentElement.id).value = doers[i].position;
                document.getElementById('salary' + e.target.parentElement.parentElement.id).value = doers[i].salary;
            }
        }
    }
})

window.addEventListener('load', () => {
    let w = createTab();
    if (w !== undefined) {
        document.getElementById('tabs').innerHTML = w;
    };


    changeTab();
    if (document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0] == undefined) {
        console.log('для продолжения работы создайте проект')
        document.getElementById('main').innerHTML = `<div style="display:flex; justify-content: center; 
        align-items: center; background-color: lightgrey; padding: 30px; width: 100%; height: 100%; border-radius: 10px"> <img class="MMImage-Origin"
         src="https://cdn-icons-png.flaticon.com/512/5169/5169216.png" alt="Picture background" aria-hidden="true"
         style="width:150px; height: 100%;">
        </div>`
    }
    else {
        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        data = JSON.parse(localStorage.getItem(fn));

        document.getElementById('_nameProject').innerHTML = data.name;
        document.getElementById('_start').innerHTML = data.countStart;
        document.getElementById('_end').innerHTML = data.countEnd;
        document.getElementById('_stadia').innerHTML = data.stadia;
        document.getElementById('sprint').innerHTML = data.sprint;
        document.getElementById('time').innerHTML = data.time;
        document.getElementById('_author').innerHTML = data.author;

        document.getElementById('main').innerHTML = fill() + fill_total1();
        fill_card();
        report_workDays();
    }

});


function forwardReports() {
    window.location.href = "/reports";
}

function report_workDays() {
    if (document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0] == undefined) {
        console.log('для продолжения работы создайте проект')
    }
    else {
        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        data = JSON.parse(localStorage.getItem(fn));
        let stadia = [];
        if (data.stadia == 'ОТР') { stadia = _teo; }
        else if (data.stadia == 'ПД') { stadia = _pr }
        else if (data.stadia == 'ПД линейный') { stadia = _pr_line; }
        else if (data.stadia == 'РД') { stadia = _rd; }


        let a;

        for (let j = 1; j < (Number(stadia.length)); j++) {
            a = 0;
            for (let k = 0; k < data.sprint; k++) {

                for (let i = 0; i < data.matrix.length; i++) {
                    if (data.matrix[i].cell == 'cell_'  + j + '_' + k) {
                        a += (new Date(data.matrix[i].endPlanTask) - new Date(data.matrix[i].startPlanTask)) / (1000 * 3600 * 24);
                    }
                    
                };
               
            };
            document.getElementById(`cell_total${j}`).innerHTML = a
        };

        let b;

        for (let j = 0; j < data.sprint; j++) {
            b = 0;
            for (let k = 1; k < Number(stadia.length); k++) {

                //count += `<div class="cell_sprint" >СПРИНТ ${j} </div>`
                for (let i = 0; i < data.matrix.length; i++) {
                    if (data.matrix[i].cell == 'cell_' + k + '_' + j) {
                        b += (new Date(data.matrix[i].endPlanTask) - new Date(data.matrix[i].startPlanTask)) / (1000 * 3600 * 24);
                    }
                };

            };

            document.getElementById(`cell_sprint_tot${j}`).innerHTML = b;
        };

        let c = 0;

        for (let j = 0; j < data.sprint; j++) {
            //c = 0;
            for (let k = 1; k < Number(stadia.length); k++) {

                //count += `<div class="cell_sprint" >СПРИНТ ${j} </div>`
                for (let i = 0; i < data.matrix.length; i++) {
                    if (data.matrix[i].cell == 'cell_' + k + '_' + j) {
                        c += (new Date(data.matrix[i].endPlanTask) - new Date(data.matrix[i].startPlanTask)) / (1000 * 3600 * 24);
                    }
                };

            };


        };
        document.getElementById(`cell_total${Number(stadia.length-1)}`).innerHTML = c;
    }

}

async function uploadFile() {

    if (document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0] == undefined) {
        console.log('для продолжения работы создайте проект')
    }
    else {
        let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
        let saveDate = new Date();

        let response = await fetch('/project/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nameProject: fn, dataProject: localStorage.getItem(fn), dateProject: saveDate })
        });

        if (response.ok) alert('Проект сохранен на сервере');
        window.location.reload();

    }
}



document.addEventListener('click', async (e) => {
    if (e.target.className == 'open') {
        console.log(e.target.id)
        let id = e.target.id;

        let response = await fetch(`/open/${id}`)
        let data = await response.json();
        localStorage.setItem(data.nameProject, data.dataProject);

        window.location.reload();

    }

})

