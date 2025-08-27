const { text } = require('body-parser');
var express = require('express');
const cookieParser = require('cookie-parser');
var app = express();
//var sqlite3 = require('sqlite3');
var Database = require('better-sqlite3');
//const db = new sqlite3.Database('projects.db');
const db = new Database('projects.db');
var fs = require('fs');
var us = require('./users');
var handlebars = require('express-handlebars');
const { isArray } = require('util');

app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));

app.set('view engine', '.hbs');

var hbs = handlebars.create({});


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.set('port', process.env.PORT || 8000);


// First step is the authentication of the client

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

db.exec("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, nameProject TEXT NOT NULL, dataProject BLOB NOT NULL, dateProject TEXT NOT NULL)");

let user = '';
let pass = '';
let role = '';
function checkAuth() {
  for (let i = 0; i < us.length; i++) {
    if (user == us[i].username && pass == us[i].password) {
      role = us[i].role;
      return true
    }
  }


}
app.get('/login', function (req, res, next) {
  res.render('login', {
  });
});

app.post('/login', function (req, res, next) {
  user = req.body.username;
  pass = req.body.password;
  checkAuth();
  res.redirect('/');
});



function auth(req, res, next) {
  if (checkAuth()) {
    next()
  }
  else {
    res.redirect('/login');
  }
}
app.use(auth);

/* GET home page. */


app.get('/', function (req, res, next) {
  let myAdmin = '';
  let myGip = '';


  //const rows = db.prepare("SELECT * FROM projects WHERE user = ?").all(user);
  const rows = db.prepare("SELECT * FROM projects ").all();

  rows.forEach(function (row) {
    myAdmin += `
    <div class="recPros" id=${row.id}>
      <div>Имя</div>
      <div>Автор</div>
      <div>Посл. изм.</div>
      <div> ${row.nameProject}</div>
      <div> ${row.user}</div>
      <div> ${new Date(row.dateProject).toLocaleDateString('ru')} <br> ${new Date(row.dateProject).toLocaleTimeString('ru')}</div>
      <div><button id=${row.id} class='open'>open</button> </div>
      <div> <form action="/delete/${row.id}" method="get"><button type="submit">delete</button></form></div>
    </div>
    `
      ;
    myGip += `
    <div class="recPros" id=${row.id}>
      <div>Имя</div>
      <div>Автор</div>
      <div>Посл. изм.</div>
      <div> ${row.nameProject}</div>
      <div> ${row.user}</div>
      <div> ${new Date(row.dateProject).toLocaleDateString('ru')} <br> ${new Date(row.dateProject).toLocaleTimeString('ru')}</div>
      <div><button id=${row.id} class='open'>open</button> </div>
    </div>
    `
      ;


  });
  if (role == 'admin') {
    res.render('index', {
      user: user,
      projects: `
        <div class="dropdown">
      <button class="btn_menu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Проекты
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

        <li><input class="dropdown-item" id="555" type="button" onclick="createFile()" value="Создать проект"></li>
        <li><input class="dropdown-item" id="666" type="button" onclick="uploadFile()" value="Сохранить проект"> </li>
        <li><label for="777" class="dropdown-item" hidden >Открыть проект</label><input class="form-control" id="777"
            type="file" onclick="openFile1()" accept=".smeta" hidden></li>
      </ul>
    </div>`,
      report: `
        <div class="dropdown">
        <button class="btn_menu" type="button" onclick="forwardReports()" >
        Отчеты
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><input class="dropdown-item" id="" type="button" onclick="report_task()" value="Отчет по задачам"></li>
        <li><input class="dropdown-item" id="" type="button" onclick="report_total()" value="Отчет по проекту"></li>
        <li><input class="dropdown-item" id="" type="button" onclick="report_total_all()" value="Сводный отчет по ПИ">
        </li>
        </ul>
        </div>`,
      
      pro: myAdmin,


    });
  }
  else if (role == 'gip') {
    res.render('index', {
      user: user,
      projects: `
        <div class="dropdown">
      <button class="btn_menu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Проекты
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

        <li><input class="dropdown-item" id="555" type="button" onclick="createFile()" value="Создать проект"></li>
        <li><input class="dropdown-item" id="666" type="button" onclick="uploadFile()" value="Сохранить проект"> </li>
        <li><label for="777" class="dropdown-item" hidden >Открыть проект</label><input class="form-control" id="777"
            type="file" onclick="openFile1()" accept=".smeta" hidden></li>
      </ul>
    </div>`,
      report: `
        <div class="dropdown">
        <button class="btn_menu" type="button" onclick="forwardReports()" >
        Отчеты
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><input class="dropdown-item" id="" type="button" onclick="report_task()" value="Отчет по задачам"></li>
        <li><input class="dropdown-item" id="" type="button" onclick="report_total()" value="Отчет по проекту"></li>
        <li><input class="dropdown-item" id="" type="button" onclick="report_total_all()" value="Сводный отчет по ПИ">
        </li>
        </ul>
        </div>`,
      pro: myGip
    })
  }
  else if (role == 'user') {
    res.render('index', {
      user: user,
      pro: myGip
    })

  }
  //})

});

app.get('/reports', function (req, res) {
  if (role == 'admin') {
    res.render('reports', {
      user: user,

    });
  }
  else {
    res.redirect('/')
  }
});


app.post('/', function (req, res, next) {
  res.render('index', {
  })
});

app.post('/logout', function (req, res, next) {
  a = '';
  b = '';
  c = '';
  res.clearCookie("kpee");
  res.redirect('/login')
});


app.get('/project/add', (req, res) => {
  res.redirect('/')
});

app.post('/project/add', (req, res) => {
  let nameProject = req.body.nameProject;
  let dataProject = req.body.dataProject;
  let dateProject = req.body.dateProject;
  const rows = db.prepare("SELECT * FROM projects WHERE nameProject = ?").get(nameProject);

  if (rows == undefined) {
    db.prepare("INSERT INTO projects (user, nameProject, dataProject, dateProject) VALUES (?,?,?,?)").run([user, nameProject, dataProject, dateProject]);
  }
  else {
    db.prepare("UPDATE projects SET dataProject = ?,  dateProject = ? WHERE nameProject = ?").run(dataProject, dateProject, nameProject);
  }

  res.redirect('/')
});

app.get('/delete/:id(\\d+)', (req, res) => {
  let id = req.params.id;
  db.prepare("DELETE FROM projects WHERE id =?").run(id);
  res.redirect('/')
});

app.get('/open/:id(\\d+)', (req, res) => {
  let id = req.params.id;
  const rows = db.prepare("SELECT * FROM projects WHERE id =?").get(id);
  res.json(rows);



});

app.listen(app.get('port'), function () {
  console.log('Express запущен на http://localhost:' +
    app.get('port') + '; нажмите Ctrl+C для завершения.');
});
