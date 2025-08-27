const doers = [
    { depart: "Отдел генплана", position: "Инженер", name: 'Воробьев В.В.', salary: 115000 },
    { depart: "Отдел АР", position: "Ведущий Инженер", name: 'Синицын С.С.', salary: 206118 },
    { depart: "Отдел генплана", position: "Инженер", name: 'Галкин Г.Г.', salary: 302040 },
    { depart: "Отдел генплана", position: "Инженер", name: 'Воронин В.В.', salary: 102004 },
    { depart: "Отдел смет", position: "Инженер", name: 'Чижов Ч.Ч.', salary: 150002 },
]

const arr_depart = Array.from(new Set(doers.map((x) => { return x.depart})))
