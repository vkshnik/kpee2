function backProject() {
    window.location.href = "/";
}

function select_smetas() {

    result = "";
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('.kpee')) {
            result += `<option>${localStorage.key(i)}</option>`
        }
    }
    document.getElementById("smetas").innerHTML = result;
}

let array2;
function createAllProject() {
    array2 = [];
    let fn = '';
    let data = '';
    for (let i = 0; i < document.getElementById("smetas").length; i++) {
        if (document.getElementById("smetas")[i].selected) {
            fn = document.getElementById("smetas")[i].value;
            data = JSON.parse(localStorage.getItem(fn));
            array2.push(data)

        }
    }
    //console.log(array2)
}


function report_total_all() {

    /*const counts_doers = [];
    const sampleArray = doers;
    sampleArray.forEach(function (x) { counts_doers[x.depart] = (counts_doers[x.depart] || 0) + 1; });
    console.log(counts_doers)*/


    //let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    //data = JSON.parse(localStorage.getItem(fn));
    data = array2;
    let lineMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    //let startYear = new Date(data.countStart).getFullYear();
    //let endYear = new Date(data.countEnd).getFullYear();
    //let numYear = endYear - startYear;

    //let stadia = [];
    //if (data.stadia == 'Стадия ТЭО') { stadia = ['', 'ОПЗ', 'ОПЗ.ГЧ', 'ОПЗ.ПР']; }
    //else if (data.stadia == 'Стадия ПД') { stadia = ['', 'ПЗ', 'ПЗУ', 'АР', 'КР', 'ИОС1', 'ИОС2', 'ИОС3', 'ИОС4', 'ИОС5', 'ИОС6', 'ТХ', 'ПОС', 'ООС', 'ПБ', 'ТБЭ', 'СМ']; }
    //else if (data.stadia == 'Стадия РД') { stadia = ['', 'ГП', 'АР', 'КЖ', 'КМ', 'ЭОМ', 'ЭН', 'ЭС', 'ВК', 'НВК', 'ОВ', 'ИТП', 'ТС', 'ОПС', 'ЛВС', 'ТХ', 'АТХ', 'СМ']; }

    let colont = '';
    let context = '';
    let header = '';
    let body = '';
    let footer = '';
    let total = '';
    let sum_plan;
    let sum_fact;
    let procent_plan;
    let procent_fact;

    //////////////////////////////
    let arr_depart = ['ГИПы', 'Отдел генплана', 'Отдел АР', 'Отдел смет']
    let arr;

    /* START INSERT COLONT*/
    colont = `<tr>
    <th rowspan=2>Проект</th>
    <th colspan=2>Трудозатраты</th>
    <th colspan=2>ФОТ по проекту</th>`

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < lineMonth.length; j++) {
            colont += `<th colspan=2>${lineMonth[j]} ${2025 + i}</th>`;
        }
    }
    colont += `</tr>`
    colont += `<tr>
    <th>П</th>
    <th>Ф</th>
    <th>П</th>
    <th>Ф</th>
    `
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < lineMonth.length; j++) {
            colont += `<th>П</th><th>Ф</th>`;
        }
    }

    colont += `</tr>`
    /* END INSERT COLONT*/


    /* START INSERT CONTEXT*/
    /* START INSERT HEADER*/

    for (let s = 0; s < arr_depart.length; s++) {
        let count = 0;

        arr = [];
        for (let f = 0; f < data.length; f++) {
            for (let i = 0; i < data[f].matrix.length; i++) {
                if (!arr.includes(data[f].matrix[i].doer) && data[f].matrix[i].depart == arr_depart[s]) {
                    arr.push(data[f].matrix[i].doer)
                }
            }
        };
        for (let i = 0; i < doers.length; i++) {
            if (doers[i].depart == arr_depart[s])
                count++
        }
        header = `<tr ><td colspan = ${7 + (2 + 1) * 2 * 12}>${arr_depart[s]} - ${count} чел.</td></tr>`

        /* END INSERT HEADER*/

        /* START INSERT BODY*/

        body = '';
        let startYear = '';

        for (let b = 0; b < array2.length; b++) {

            let sum_days_plan = 0;
            let sum_days_fact = 0;
            let fot_plan = 0;
            let fot_fact = 0;
            let p = 0;
            startYear = new Date(data[b].countStart).getFullYear();
            for (let i = 0; i < arr.length; i++) {

                for (let j = 0; j < data[b].matrix.length; j++) {
                    if (arr[i] == data[b].matrix[j].doer) {
                        sum_days_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24);
                        sum_days_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24);
                        fot_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary
                        fot_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary

                    }
                }

            }

            body += `<tr>
            <td >${data[b].name}</td>
            <td>${sum_days_plan}</td>
            <td>${sum_days_fact}</td>
            <td>${fot_plan}</td>
            <td>${fot_fact}</td>
            `;

            for (let k = 0; k < 2; k++) {
                for (let j = 0; j < lineMonth.length; j++) {

                    sum_plan = 0;
                    sum_fact = 0;
                    for (let h = 0; h < data[b].matrix.length; h++) {
                        if (new Date(data[b].matrix[h].startPlanTask).getMonth() == j &&
                            new Date(data[b].matrix[h].startPlanTask).getFullYear() == startYear + k &&
                            data[b].matrix[h].depart == arr_depart[s]
                        ) {
                            sum_plan += (new Date(data[b].matrix[h].endPlanTask) - new Date(data[b].matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                            sum_fact += (new Date(data[b].matrix[h].endFactTask) - new Date(data[b].matrix[h].startFactTask)) / (1000 * 3600 * 24)
                        }
                    }


                    body += `<td>${sum_plan}</td><td>${sum_fact}</td>`;
                }

            }
            body += `</tr>`

        }


        /* END INSERT BODY*/

        /* START INSERT FOOTER*/

        footer = '';
        //let startYear = '';
        let sum_days_plan2 = 0;
        let sum_days_fact2 = 0;
        let fot_plan2 = 0;
        let fot_fact2 = 0;
        let a;
        for (let b = 0; b < array2.length; b++) {


            let p = 0;
            startYear = new Date(data[b].countStart).getFullYear();
            for (let i = 0; i < arr.length; i++) {

                for (let j = 0; j < data[b].matrix.length; j++) {
                    if (arr[i] == data[b].matrix[j].doer) {
                        sum_days_plan2 += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24);
                        sum_days_fact2 += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24);
                        fot_plan2 += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary
                        fot_fact2 += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary
                    }
                }
            }
        }
        a = '';
        a1 = '';
        workDays = [[17, 20, 21, 22, 18, 19, 23, 21, 22, 23, 19, 22], [15, 19, 21, 22, 19, 21, 23, 21, 22, 22, 20, 22], [15, 19, 21, 22, 19, 21, 23, 21, 22, 22, 20, 22]]


        for (let k = 0; k < 2; k++) {
            for (let j = 0; j < lineMonth.length; j++) {

                sum_plan = 0;
                sum_fact = 0;
                procent_plan = 0;
                procent_fact = 0;

                for (let b = 0; b < array2.length; b++) {
                    for (let h = 0; h < data[b].matrix.length; h++) {
                        if (new Date(data[b].matrix[h].startPlanTask).getMonth() == j &&
                            new Date(data[b].matrix[h].startPlanTask).getFullYear() == startYear + k &&
                            data[b].matrix[h].depart == arr_depart[s]
                        ) {
                            sum_plan += (new Date(data[b].matrix[h].endPlanTask) - new Date(data[b].matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                            sum_fact += (new Date(data[b].matrix[h].endFactTask) - new Date(data[b].matrix[h].startFactTask)) / (1000 * 3600 * 24)


                        }

                    }
                }
                a += `<td>${sum_plan}</td><td>${sum_fact}</td>`;

                if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] < 50) {
                    a1 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #00FF80;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    a1 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    a1 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] < 100) {
                    a1 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] > 100) {
                    a1 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    a1 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    a1 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    a1 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    a1 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

            }
        }



        footer = `<tr style="background-color: lightgreen;">
            <td >ИТОГО<br>по отделу</td>
            <td>${sum_days_plan2}</td>
            <td>${sum_days_fact2}</td>
            <td>${fot_plan2}</td>
            <td>${fot_fact2}</td>
            `;
        footer += a;
        footer += `</tr>`
        footer += `<tr >
            <td> ЗАГРУЗКА<br>по отделу</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            `;
        footer += a1;
        footer += `</tr>`

        /* END INSERT FOOTER*/

        context += header + body + footer
    }
    /* END INSERT CONTEXT */

    /* START INSERT TOTAL */
    let startYear = '';
    let sum_days_plan = 0;
    let sum_days_fact = 0;
    let fot_plan = 0;
    let fot_fact = 0;
    sum_plan = 0;
    sum_fact = 0;
    for (let b = 0; b < array2.length; b++) {
        startYear = new Date(data[b].countStart).getFullYear();
        for (let j = 0; j < data[b].matrix.length; j++) {
            sum_days_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24)
            sum_days_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24)
            fot_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary
            fot_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary
        }
    }
    let total2 = '';
    let total21 = '';
    for (let k = 0; k < 2; k++) {
        for (let j = 0; j < lineMonth.length; j++) {
            sum_plan = 0;
            sum_fact = 0;
            for (let b = 0; b < array2.length; b++) {
                startYear = new Date(data[b].countStart).getFullYear();
                for (let h = 0; h < data[b].matrix.length; h++) {
                    if (new Date(data[b].matrix[h].startPlanTask).getMonth() == j &&
                        new Date(data[b].matrix[h].startPlanTask).getFullYear() == startYear + k
                    ) {
                        sum_plan += (new Date(data[b].matrix[h].endPlanTask) - new Date(data[b].matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                        sum_fact += (new Date(data[b].matrix[h].endFactTask) - new Date(data[b].matrix[h].startFactTask)) / (1000 * 3600 * 24)
                    }
                }
            }
            total2 += `<td>${sum_plan}</td><td>${sum_fact}</td>`;

                            if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] < 50) {
                    total21 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #00FF80;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    total21 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    total21 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] < 100) {
                    total21 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 50 && sum_fact * 100 / workDays[k][j] > 100) {
                    total21 += `<td style="background-color: #00FF80;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    total21 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] < 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    total21 += `<td style="background-color: #FF8000;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] < 100) {
                    total21 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF8000;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

                else if (sum_plan * 100 / workDays[k][j] > 100 && sum_fact * 100 / workDays[k][j] > 100) {
                    total21 += `<td style="background-color: #FF0080;">${(sum_plan * 100 / workDays[k][j]).toFixed(0)}%</td>
                <td style="background-color: #FF0080;">${(sum_fact * 100 / workDays[k][j]).toFixed(0)}%</td>`;
                }

        }
    }
    total += `<tr style='background-color:lightgrey'>
                 <td >Итого<br>по ПИ </td>
                 <td>${sum_days_plan}</td>
                 <td>${sum_days_fact}</td>
                 <td>${fot_plan}</td>
                 <td>${fot_fact}</td>
                 ${total2}`;
    total += `</tr>`
    total += `<tr style='background-color:lightgrey'>
                 <td> Загрузка<br>по ПИ </td>
                 <td>${sum_days_plan}</td>
                 <td>${sum_days_fact}</td>
                 <td>${fot_plan}</td>
                 <td>${fot_fact}</td>
                 ${total21}`;
    total += `</tr>`


    /* END INSERT TOTAL*/
    let bodyReport = document.createElement('div');
    bodyReport.setAttribute('class', 'report');

    bodyReport.innerHTML = `
    <button  class= "report_close" onclick = "report_close()">&#x2715</button>
    <h3 style="text-align: center;">СВОДНЫЙ ОТЧЕТ ПО ЗАГРУЗКЕ</h3>
    <h6>Стадия проектирования: ${1}</h6>
    <h6>Главный инженер проекта: ${1}</h6>
    <br>
    <table>
    ${colont}
    ${context}
    ${total}
    </table>`
    document.getElementById('reports').appendChild(bodyReport);


}

function report_close() {

    document.getElementById('reports').addEventListener('click', (e) => {
        if (e.target.className == 'report_close') {
            document.getElementById('reports').removeChild(e.target.parentElement);
        }
    })
}



function createTab() {
    let l = '';
    if (localStorage.key(0) == 0) {
        return alert('Создайте проект')
    }

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).includes('.kpee')) {
            l += `<div class ="pag"><input type="checkbox" class = "chooseFile" id = "${localStorage.key(i)}" value = "${localStorage.key(i)}" >
        <label for="${localStorage.key(i)}">${localStorage.key(i)}</label>
        <input type="button" class = "btnclose" onclick = "closeFile()"  value="&#x2715" ></div>`
        }
    }

    return l;
}

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

        }

    })


}


window.addEventListener('load', () => {
    let w = createTab();
    if (w !== undefined) {
        document.getElementById('tabs').innerHTML = w;
    };
    changeTab();
    select_smetas();




});
