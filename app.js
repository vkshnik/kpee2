const { text } = require('body-parser');
var express = require('express');
var session = require('express-session');
const cookieParser = require('cookie-parser');
var app = express();
var Database = require('better-sqlite3');
const SqliteStore = require("better-sqlite3-session-store")(session);
const sess = new Database("sessions.db" /*,  {  verbose : console . log  } */);

const db = new Database('projects.db');
var fs = require('fs');
var us = require('./users');
var handlebars = require('express-handlebars');
const { isArray } = require('util');

app.engine('.hbs', handlebars.engine({ extname: '.hbs' }));

app.set('view engine', '.hbs');

var hbs = handlebars.create({});


app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json({limit: '50mb'}));

app.set('port', process.env.PORT || 8000);


// First step is the authentication of the client
app.use(session({
  store: new SqliteStore({ client: sess, expired: { clear: true, intervalMs: 900000 } }),
  secret: " keyboard cat ",
  resave: false,
  saveUninitialized: false,

}))
app.use(express.static(__dirname + '/public'));
//app.use(cookieParser());

db.exec("CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT NOT NULL, nameProject TEXT NOT NULL, dataProject BLOB NOT NULL, dateProject TEXT NOT NULL)");

function checkAuth(req) {


}
app.get('/login', function (req, res, next) {
  res.render('login', {
  });
});

app.post('/login', function (req, res, next) {
  req.session.user = req.body.username;
  req.session.pass = req.body.password;

  for (let i = 0; i < us.length; i++) {
    if (req.session.user == us[i].username && req.session.pass == us[i].password) {
      req.session.role = us[i].role;


    }
  }
  //console.log(req.session)
  if (req.session.role) {
    res.redirect('/');
  }
  else {
    res.render('login', {
      msg: 'Неверный логин или пароль'
    });
  }

});



function auth(req, res, next) {
  if (req.session.role) {
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


  //const rows = db.prepare("SELECT * FROM projects WHERE user = ?").all(req.session.user);
  const rows = db.prepare("SELECT * FROM projects ").all();

  rows.forEach(function (row) {
    

    myAdmin += `
   
    <div class="recPros" id=${row.id}>
      <div> 
          <div><button><img src = '/open.svg' id=${row.id} class='open'></button></div>
          <div> <form action="/delete/${row.id}" method="get"><button type="submit"><img src = '/delete.svg'</button></form></div>
      </div>
      <div class = "clipText"> ${row.nameProject}</div>
      <div> ${row.user}</div>
      <div> ${new Date(row.dateProject).toLocaleDateString('ru')} <br> ${new Date(row.dateProject).toLocaleTimeString('ru')}</div>
      
    </div>
    `
      ;
    myGip += `
    <div class="recPros" id=${row.id}>
      <div>
          <div><button><img src = '/open.svg' id=${row.id} class='open'></button></div>
      </div>
      <div class = "clipText"> ${row.nameProject}</div>
      <div> ${row.user}</div>
      <div> ${new Date(row.dateProject).toLocaleDateString('ru')} <br> ${new Date(row.dateProject).toLocaleTimeString('ru')}</div>
      
    </div>
    `
      ;


  });
  if (req.session.role == 'admin') {
    res.render('index', {
      user: req.session.user,
      projects: `
        <div class="dropdown">
      <button class="btn_menu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Проекты
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">

        <li><input class="dropdown-item" id="555" type="button" onclick="createFile()" value="Создать проект"></li>
        <li><input class="dropdown-item" id="666" type="button" onclick="uploadFile()" value="Сохранить проект в БД"> </li>
        <hr>
        <li><label for="777" class="dropdown-item" >Открыть проект из файла</label><input class="form-control" id="777"
            type="file" onclick="openLocalFile()" accept=".kpee" hidden ></li>
        <li><input class="dropdown-item" id="666" type="button" onclick="saveLocalFile()" value="Сохранить проект в файл"> </li>
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
  else if (req.session.role == 'gip') {
    res.render('index', {
      user: req.session.user,
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
  else if (req.session.role == 'user') {
    res.render('index', {
      user: req.session.user,
      pro: myGip
    })

  }
  //})

});

app.get('/reports', function (req, res) {
  if (req.session.role == 'admin' || req.session.role == 'gip') {
    res.render('reports', {
      user: req.session.user,

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
  //res.clearCookie("kpee");
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
  // res.redirect('/')
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
    db.prepare("INSERT INTO projects (user, nameProject, dataProject, dateProject) VALUES (?,?,?,?)").run([req.session.user, nameProject, dataProject, dateProject]);
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
