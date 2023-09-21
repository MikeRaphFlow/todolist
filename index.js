import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let lista = [];
let listaLaburo = [];

app.get("/", (req, res) => {
    res.render("index.ejs")
});

app.get("/laburo", (req, res) => {
    res.render("work.ejs")
});

app.post("/submit", (req, res) => {
    let ultimaNota = req.body.nuevaNota;
    if (ultimaNota !== "") {
        lista.push(ultimaNota);
    }
    res.render("index.ejs", { toDoList: lista });
});

app.post("/eliminar", (req, res) => {
    const indice = req.body.indice;
    if (indice !== undefined) {
        lista.splice(indice, 1);
    }

    res.render("index.ejs", { toDoList: lista });
});

app.post("/laburo", (req, res) => {
    let ultimaNotaLaburo = req.body.nuevaNotaLaburo;
    if (ultimaNotaLaburo !== "") {
        listaLaburo.push(ultimaNotaLaburo)
    }
    res.render("work.ejs", { toDoListLaburo: listaLaburo });
});

app.post("/eliminarLaburo", (req, res) => {
    const indice = req.body.indice;
    if (indice !== undefined) {
        listaLaburo.splice(indice, 1);
    }

    res.render("work.ejs", { toDoListLaburo: listaLaburo });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});