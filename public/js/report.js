//////////////////////////SAVE TO////////////////////

function savetoWord_1p() {
    let fn;

    fn = prompt('Введите название файла');
    if (fn == null) {
        return;
    }

    let file = new Blob([document.getElementById('smeta_1p').innerHTML], { type: 'application/msword;charset=utf-8,' });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fn);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = fn;
        a.pathname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    }
}
function savetoExcel_1p() {
    let fn;

    fn = prompt('Введите название файла');
    if (fn == null) {
        return;
    }

    let file = new Blob([document.getElementById('smeta_1p').innerHTML], { type: 'application/vnd.ms-excel;charset=utf-8,' });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fn);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = fn;
        a.pathname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    }
}

/* function savetoPdf() {
    let fn;

    fn = prompt('Введите название файла') ;
    if (fn == null ) {
        return;
    }

    let file = new Blob([document.getElementById('smeta').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document  docx;charset=utf-8'  });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, fn);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = fn;
        a.pathname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    }
} */

function savetopdf() {
    /*let mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

    mywindow.document.write(`<html><head><title></title>`);
    mywindow.document.write('</head><body >');
    mywindow.document.write(document.getElementsByClassName('report')[0].innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); 
    mywindow.focus(); 

    mywindow.print();
    mywindow.close();

    return true;*/
    
let n = sessionStorage.getItem('tabs')
var wb = XLSX.utils.table_to_book(document.getElementById('tablexls'));
wb.cellStyles = 
  /* Export to file (start a download) */
  XLSX.writeFile(wb, `${n }Отчет по задачам.xlsx`, {/* ...opts , */ cellStyles: true});

}


////////////////////////////////////////////////////


function report_task() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    data = JSON.parse(localStorage.getItem(fn));
    let text = '';
    let isDone;
    for (let i = 0; i < data.matrix.length; i++) {

        if (data.matrix[i].isDone) { isDone = `<td><p style='color: green';>Выполнена</p></td>` }
        else isDone = `<td><p style='color: red';>Не выполнена</p></td>`
        text += `
        <tr>
        <td>${data.matrix[i].id}</td>
        <td>${data.matrix[i].doer}</td>
        <td>${data.matrix[i].name}</td>
        <td>${data.matrix[i].description}</td>
        <td>${data.matrix[i].startPlanTask}</td>
        <td>${data.matrix[i].startFactTask}</td>
        <td>${data.matrix[i].endPlanTask}</td>
        <td>${data.matrix[i].endFactTask}</td>
        <td>${(new Date(data.matrix[i].endPlanTask) - new Date(data.matrix[i].startPlanTask)) / (1000 * 3600 * 24)}</td>
        <td>${(new Date(data.matrix[i].endFactTask) - new Date(data.matrix[i].startFactTask)) / (1000 * 3600 * 24)}</td>
        ${isDone}
        <td>${data.matrix[i].comments}</td>
        </tr>
        `;
    };
    let bodyReport = document.createElement('div');
    bodyReport.setAttribute('class', 'report');

    bodyReport.innerHTML = `
    <button  class= "report_close" onclick = "report_close()">&#x2715</button>
    <button  class= "report_btn" onclick = "savetopdf()">PDF</button>
    <h3 style="text-align: center;">ОТЧЕТ ПО ВЫПОЛНЕНИЮ ЗАДАЧ ПО ПРОЕКТУ</h3>
    <h3>Наименование проекта: ${data.name}</h3>
    <h6>Стадия проектирования: ${data.stadia}</h6>
    <h6>Главный инженер проекта: ${data.author}</h6>
    <br>
    <table id = 'tablexls'>
    <tr>
    <th rowspan=2>Номер задачи</th>
    <th rowspan=2>Исполнитель</th>
    <th rowspan=2>Наименование задачи</th>
    <th rowspan=2>Описание задачи</th>
    <th colspan=2>Дата начала</th>
    <th colspan=2>Дата окончания</th>
    <th colspan=2>Срок выполнения (дни) </th>
    <th rowspan=2>Статус</th>
    <th rowspan=2>Комментарии</th>

    </tr>
    <tr>
    <th>П</th>
    <th>Ф</th>
    <th>П</th>
    <th>Ф</th>
    <th>П</th>
    <th>Ф</th>
    </tr>
    ${text}
    </table>
    `
    document.getElementById('reports').appendChild(bodyReport);


}


function report_total() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    data = JSON.parse(localStorage.getItem(fn));
    let lineMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    let startYear = new Date(data.countStart).getFullYear();
    let endYear = new Date(data.countEnd).getFullYear();
    let numYear = endYear - startYear;

    let colont = '';
    let context = '';
    let header = '';
    let body = '';
    let footer = '';
    let total = '';
    let sum = 0;
    //////////////////////////////
    let arr;

    /* START INSERT COLONT*/
    colont = `<tr>
    <th rowspan=2>Дисциплина</th>
    <th rowspan=2>Исполнитель</th>
    <th rowspan=2>ФОТ исполнителя</th>
    <th colspan=2>Трудозатраты</th>
    <th colspan=2>ФОТ по проекту</th>`

    for (let i = 0; i <= numYear; i++) {
        for (let j = 0; j < lineMonth.length; j++) {
            colont += `<th rowspan=2>${lineMonth[j]} ${startYear + i}</th>`;
        }
    }
    colont += `</tr>`
    colont += `<tr>
    <th>План</th>
    <th>Факт</th>
    <th>План</th>
    <th>Факт</th>
    `
    colont += `</tr>`
    /* END INSERT COLONT*/


    /* START INSERT CONTEXT*/
    /* START INSERT HEADER*/

    for (let s = 0; s < arr_depart.length; s++) {

        header = `<tr ><td style = "text-align: center; " colspan = ${7 + (numYear + 1) * 12}>${arr_depart[s]}</td></tr>`
        arr = [];

        for (let i = 0; i < data.matrix.length; i++) {
            if (!arr.includes(data.matrix[i].doer) && data.matrix[i].depart == arr_depart[s])
                arr.push(data.matrix[i].doer)

        };
        /* END INSERT HEADER*/
        /* START INSERT BODY*/
        body = '';

        if (arr.length === 0) {
            body += `<tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>`;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {
                    body += `<td>-</td>`;
                }

            }
            body += `</tr>`
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                let sum_days_plan = 0;
                let sum_days_fact = 0;
                let depart = '';
                let salary = 0;
                let total_salary_plan = 0;
                let total_salary_fact = 0;
                for (let j = 0; j < data.matrix.length; j++) {
                    if (arr[i] == data.matrix[j].doer) {
                        sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24)
                        sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24)
                        depart = data.matrix[j].depart;
                        salary = data.matrix[j].salary;
                    }
                    total_salary_plan = sum_days_plan * salary / 21;
                    total_salary_fact = sum_days_fact * salary / 21;
                }

                body += `<tr>
                    <td>${depart}</td>
                    <td>${arr[i]}</td>
                    <td>${salary}</td>
                    <td>${sum_days_plan}</td>
                    <td>${sum_days_fact}</td>
                    <td>${Math.ceil(total_salary_plan)}</td>
                    <td>${Math.ceil(total_salary_fact)}</td>
                    `;

                for (let k = 0; k <= numYear; k++) {
                    for (let j = 0; j < lineMonth.length; j++) {
                        sum = 0;
                        for (let h = 0; h < data.matrix.length; h++) {
                            if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                                new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k &&
                                data.matrix[h].doer == arr[i]
                            ) {
                                sum += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                            }
                        }
                        body += `<td>${sum}</td>`;
                    }

                }
                body += `</tr>`
            }

        }
        /* END INSERT BODY*/

        /* START INSERT FOOTER*/
        footer = '';
        if (arr.length === 0) {
            footer = `<tr style="background-color: lightblue;">
            <td colspan=3 >Итого по дисциплине</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>`;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {
                    footer += `<td>-</td>`;
                }

            }
            footer += `</tr>`
        }

        else {
            let sum_days_plan = 0;
            let sum_days_fact = 0;
            let fot_plan = 0;
            let fot_fact = 0;
            let p = 0;
            for (let i = 0; i < arr.length; i++) {

                for (let j = 0; j < data.matrix.length; j++) {
                    if (arr[i] == data.matrix[j].doer) {
                        sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24);
                        sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24);
                        fot_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
                        fot_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
                    }
                }
            }
            footer = `<tr style="background-color: lightblue;">
            <td colspan=3 >Итого по дисциплине</td>
           
            <td>${sum_days_plan}</td>
            <td>${sum_days_fact}</td>
            <td>${Math.ceil(fot_plan)}</td>
            <td>${Math.ceil(fot_fact)}</td>
            `;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {

                    sum = 0;
                    for (let h = 0; h < data.matrix.length; h++) {
                        if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                            new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k &&
                            data.matrix[h].depart == arr_depart[s]
                        ) {
                            sum += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24)

                        }
                    }


                    footer += `<td>${sum}</td>`;
                }

            }
            footer += `</tr>`

        }


        /* END INSERT FOOTER*/


        context += header + body + footer
    }
    /* END INSERT CONTEXT*/

    /* START INSERT TOTAL*/
    if (data.matrix.length === 0) {
        total = `<tr>
            <td colspan=2>Итого по проекту</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>`;

        for (let k = 0; k <= numYear; k++) {
            for (let j = 0; j < lineMonth.length; j++) {
                total += `<td>-</td>`;
            }

        }
        total += `</tr>`
    }

    else {
        let sum_days_plan = 0;
        let sum_days_fact = 0;
        let fot_plan = 0;
        let fot_fact = 0;

        for (let j = 0; j < data.matrix.length; j++) {
            sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24)
            sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24)
            fot_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
            fot_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
        }

        total = `<tr style='background-color:lightblue'>
                <td colspan=2>Итого по проекту</td>
                <td>-</td>
                <td>${sum_days_plan}</td>
                <td>${sum_days_fact}</td>
                <td>${Math.ceil(fot_plan)}</td>
                <td>${Math.ceil(fot_fact)}</td>
                `;
        for (let k = 0; k <= numYear; k++) {
            for (let j = 0; j < lineMonth.length; j++) {
                sum = 0;
                for (let h = 0; h < data.matrix.length; h++) {
                    if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                        new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k
                    ) {
                        sum += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                    }
                }
                total += `<td>${sum}</td>`;
            }
        }
        total += `</tr>`
    }
    /* END INSERT TOTAL*/
    let bodyReport = document.createElement('div');
    bodyReport.setAttribute('class', 'report');

    bodyReport.innerHTML = `
    <button   class= "report_close" onclick = "report_close()">&#x2715</button>
    <h3 style="text-align: center;">ОТЧЕТ ПО ПРОЕКТУ</h3>
    <h3>Наименование проекта: ${data.name}</h3>
    <h6>Стадия проектирования: ${data.stadia}</h6>
    <h6>Главный инженер проекта: ${data.author}</h6>
    <br>
    <table>
    ${colont}
    ${context}
    ${total}
    </table>`
    document.getElementById('reports').appendChild(bodyReport);
}

function report_total_all_detail() {
    let fn = document.querySelectorAll('input[type="checkbox"]:checked[class="chooseFile"]')[0].value;
    data = JSON.parse(localStorage.getItem(fn));
    let lineMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    let startYear = new Date(data.countStart).getFullYear();
    let endYear = new Date(data.countEnd).getFullYear();
    let numYear = endYear - startYear;

    let colont = '';
    let context = '';
    let header = '';
    let body = '';
    let footer = '';
    let total = '';
    let sum_plan;
    let sum_fact;
    let sumTotal = 0;
    //////////////////////////////
    let arr;

    /* START INSERT COLONT*/
    colont = `<tr>
    <th rowspan=2>Дисциплина</th>
    <th rowspan=2>Исполнитель</th>
    <th rowspan=2>ФОТ исполнителя</th>
    <th colspan=2>Трудозатраты</th>
    <th colspan=2>ФОТ по проекту</th>`

    for (let i = 0; i <= numYear; i++) {
        for (let j = 0; j < lineMonth.length; j++) {
            colont += `<th colspan=2>${lineMonth[j]} ${startYear + i}</th>`;
        }
    }
    colont += `</tr>`
    colont += `<tr>
    <th>П</th>
    <th>Ф</th>
    <th>П</th>
    <th>Ф</th>
    `
    for (let i = 0; i <= numYear; i++) {
        for (let j = 0; j < lineMonth.length; j++) {
            colont += `<th>П</th><th>Ф</th>`;
        }
    }

    colont += `</tr>`
    /* END INSERT COLONT*/


    /* START INSERT CONTEXT*/
    /* START INSERT HEADER*/

    for (let s = 0; s < arr_depart.length; s++) {

        header = `<tr ><th style = "text-align: center; " colspan = ${7 + (numYear + 1) * 2 * 12}>${arr_depart[s]}</th></tr>`
        arr = [];

        for (let i = 0; i < data.matrix.length; i++) {
            if (!arr.includes(data.matrix[i].doer) && data.matrix[i].depart == arr_depart[s])
                arr.push(data.matrix[i].doer)

        };
        /* END INSERT HEADER*/
        /* START INSERT BODY*/
        body = '';

        if (arr.length === 0) {
            body += `<tr>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>`;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {
                    body += `<td>-</td><td>-</td>`;
                }

            }
            body += `</tr>`
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                let sum_days_plan = 0;
                let sum_days_fact = 0;
                let depart = '';
                let salary = 0;
                let total_salary_plan = 0;
                let total_salary_fact = 0;
                for (let j = 0; j < data.matrix.length; j++) {
                    if (arr[i] == data.matrix[j].doer) {
                        sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24)
                        sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24)
                        depart = data.matrix[j].depart;
                        salary = data.matrix[j].salary;
                    }
                    total_salary_plan = sum_days_plan * salary / 21;
                    total_salary_fact = sum_days_fact * salary / 21;
                }

                body += `<tr>
                    <td>${depart}</td>
                    <td>${arr[i]}</td>
                    <td>${salary}</td>
                    <td>${sum_days_plan}</td>
                    <td>${sum_days_fact}</td>
                    <td>${Math.ceil(total_salary_plan)}</td>
                    <td>${Math.ceil(total_salary_fact)}</td>
                    `;

                for (let k = 0; k <= numYear; k++) {
                    for (let j = 0; j < lineMonth.length; j++) {
                        sum_plan = 0;
                        sum_fact = 0;
                        for (let h = 0; h < data.matrix.length; h++) {
                            if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                                new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k &&
                                data.matrix[h].doer == arr[i]
                            ) {

                                sum_plan += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24);
                                sum_fact += (new Date(data.matrix[h].endFactTask) - new Date(data.matrix[h].startFactTask)) / (1000 * 3600 * 24)

                            }
                        }
                        body += `<td>${sum_plan}</td><td>${sum_fact}</td>`;
                    }

                }
                body += `</tr>`
            }

        }
        /* END INSERT BODY*/

        /* START INSERT FOOTER*/
        footer = '';
        if (arr.length === 0) {
            footer = `<tr>
            <th colspan=2>Итого по дисциплине</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>`;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {
                    footer += `<th>-</th><th>-</th>`;
                }

            }
            footer += `</tr>`
        }

        else {
            let sum_days_plan = 0;
            let sum_days_fact = 0;
            let fot_plan = 0;
            let fot_fact = 0;
            let p = 0;
            for (let i = 0; i < arr.length; i++) {

                for (let j = 0; j < data.matrix.length; j++) {
                    if (arr[i] == data.matrix[j].doer) {
                        sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24);
                        sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24);
                        fot_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
                        fot_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
                    }
                }
            }
            footer = `<tr>
            <th colspan=2>Итого по дисциплине</th>
           
            <th>-</th>
            <th>${sum_days_plan}</th>
            <th>${sum_days_fact}</th>
            <th>${Math.ceil(fot_plan)}</th>
            <th>${Math.ceil(fot_fact)}</th>
            `;

            for (let k = 0; k <= numYear; k++) {
                for (let j = 0; j < lineMonth.length; j++) {

                    sum_plan = 0;
                    sum_fact = 0;
                    for (let h = 0; h < data.matrix.length; h++) {
                        if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                            new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k &&
                            data.matrix[h].depart == arr_depart[s]
                        ) {
                            sum_plan += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                            sum_fact += (new Date(data.matrix[h].endFactTask) - new Date(data.matrix[h].startFactTask)) / (1000 * 3600 * 24)
                        }
                    }


                    footer += `<th>${sum_plan}</th><th>${sum_fact}</th>`;
                }

            }
            footer += `</tr>`

        }


        /* END INSERT FOOTER*/


        context += header + body + footer
    }
    /* END INSERT CONTEXT*/

    /* START INSERT TOTAL*/
    if (data.matrix.length === 0) {
        total = `<tr>
            <th colspan=2>Итого по проекту</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>
            <th>-</th>`;

        for (let k = 0; k <= numYear; k++) {
            for (let j = 0; j < lineMonth.length; j++) {
                total += `<th>-</th><th>-</th>`;
            }

        }
        total += `</tr>`
    }

    else {
        let sum_days_plan = 0;
        let sum_days_fact = 0;
        let fot_plan = 0;
        let fot_fact = 0;

        for (let j = 0; j < data.matrix.length; j++) {
            sum_days_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24)
            sum_days_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24)
            fot_plan += (new Date(data.matrix[j].endPlanTask) - new Date(data.matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
            fot_fact += (new Date(data.matrix[j].endFactTask) - new Date(data.matrix[j].startFactTask)) / (1000 * 3600 * 24) * data.matrix[j].salary / 21
        }

        total = `<tr style='background-color:lightblue'>
                <th colspan=2>Итого по проекту</th>
                <th>-</th>
                <th>${sum_days_plan}</th>
                <th>${sum_days_fact}</th>
                <th>${Math.ceil(fot_plan)}</th>
                <th>${Math.ceil(fot_fact)}</th>
                `;
        for (let k = 0; k <= numYear; k++) {
            for (let j = 0; j < lineMonth.length; j++) {
                sum_plan = 0;
                sum_fact = 0;
                for (let h = 0; h < data.matrix.length; h++) {
                    if (new Date(data.matrix[h].startPlanTask).getMonth() == j &&
                        new Date(data.matrix[h].startPlanTask).getFullYear() == startYear + k
                    ) {
                        sum_plan += (new Date(data.matrix[h].endPlanTask) - new Date(data.matrix[h].startPlanTask)) / (1000 * 3600 * 24)
                        sum_fact += (new Date(data.matrix[h].endFactTask) - new Date(data.matrix[h].startFactTask)) / (1000 * 3600 * 24)
                    }
                }
                total += `<th>${sum_plan}</th><th>${sum_fact}</th>`;
            }
        }
        total += `</tr>`
    }
    /* END INSERT TOTAL*/
    let bodyReport = document.createElement('div');
    bodyReport.setAttribute('class', 'report');

    bodyReport.innerHTML = `
    <button   class= "report_close" onclick = "report_close()">&#x2715</button>
    <h3 style="text-align: center;">ОТЧЕТ ПО ПРОЕКТУ</h3>
    <h3>Наименование проекта:  ${data.name}</h3>
    <h6>Стадия проектирования: ${data.stadia}</h6>
    <h6>Главный инженер проекта: ${data.author}</h6>
    <br>
    <table>
    ${colont}
    ${context}
    ${total}
    </table>`
    document.getElementById('reports').appendChild(bodyReport);

}

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

    data = array2;
    let lineMonth = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

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
    workDays = [[17, 20, 21, 22, 18, 19, 23, 21, 22, 23, 19, 22], [15, 19, 21, 22, 19, 21, 23, 21, 22, 22, 20, 22], [15, 19, 21, 22, 19, 21, 23, 21, 22, 22, 20, 22]]


    //////////////////////////////
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
                        fot_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21
                        fot_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21

                    }
                }

            }

            body += `<tr>
            <td >${data[b].name}</td>
            <td>${sum_days_plan}</td>
            <td>${sum_days_fact}</td>
            <td>${Math.ceil(fot_plan)}</td>
            <td>${Math.ceil(fot_fact)}</td>
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
                        fot_plan2 += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21
                        fot_fact2 += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21
                    }
                }
            }
        }
        a = '';
        a1 = '';


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
                a1 += `<td >${(sum_plan * 100 / workDays[k][j] / count).toFixed(0)}%</td>
                <td >${(sum_fact * 100 / workDays[k][j] / count).toFixed(0)}%</td>`;

                /////////////////////////////
            }
        }



        footer = `<tr style="background-color: lightblue;">
            <td >ИТОГО<br>по отделу</td>
            <td>${sum_days_plan2}</td>
            <td>${sum_days_fact2}</td>
            <td>${Math.ceil(fot_plan2)}</td>
            <td>${Math.ceil(fot_fact2)}</td>
            `;
        footer += a;
        footer += `</tr>`
        footer += `<tr >
            <td colspan = 5 > ЗАГРУЗКА<br>по отделу</td>
            
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
            fot_plan += (new Date(data[b].matrix[j].endPlanTask) - new Date(data[b].matrix[j].startPlanTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21
            fot_fact += (new Date(data[b].matrix[j].endFactTask) - new Date(data[b].matrix[j].startFactTask)) / (1000 * 3600 * 24) * data[b].matrix[j].salary / 21
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

            total21 += `<td >${(sum_plan * 100 / workDays[k][j] / doers.length).toFixed(0)}%</td>
                <td >${(sum_fact * 100 / workDays[k][j] / doers.length).toFixed(0)}%</td>`;


        }
    }
    total += `<tr style='background-color:lightblue'>
                 <td >Итого<br>по ПИ </td>
                 <td>${sum_days_plan}</td>
                 <td>${sum_days_fact}</td>
                 <td>${Math.ceil(fot_plan)}</td>
                 <td>${Math.ceil(fot_fact)}</td>
                 ${total2}`;
    total += `</tr>`
    total += `<tr style='font-style: italic '>
                 <td colspan = 5> Загрузка<br>по ПИ </td>

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



