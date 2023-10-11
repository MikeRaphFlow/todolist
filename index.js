import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://miguerafael:anita9491@mikeraphcluster.rmnjhuu.mongodb.net/tododolistDB");

const itemsSchema = new mongoose.Schema ({
    name: String    
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", (req, res) => {
    async function consultarItems() {
        try {
            const lista = await Item.find({});
            res.render("index.ejs", {listTitle: "Hoy", toDoList: lista })   
        } catch (error) {
            console.error("Error al consultar los items:", error);
        }
    };
    consultarItems();    
});

/// Crear listas dinamicas
const listSchema = {
    name: String, 
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/:listaCustom", (req, res) => {
    const listaCustom = _.capitalize(req.params.listaCustom);
    async function chequearLista() {
        try {
            const listaEncontrada = await List.findOne({name: listaCustom});
            if (!listaEncontrada) {  
                const list = new List ({
                    name: listaCustom, 
                    items: [{
                        name: "Nueva lista creada"
                        }]
                })
                list.save();  
                res.redirect("/" + listaCustom)              
           } else {
                res.render("index.ejs", {listTitle: listaEncontrada.name, toDoList: listaEncontrada.items })         
            }   
        } catch (error) {
            console.error("Error al consultar las listas:", error);
        }
    } chequearLista();
});



app.post("/", (req, res) => {
    const nuevoItem = req.body.nuevaNota 
    const listName = req.body.listTitle
   
    if ( nuevoItem !== "") {
        const ultimaNota = new Item ({
            name: nuevoItem
        })
        if (listName === "Hoy"){
            ultimaNota.save();
            res.redirect("/");
        } else {
            async function buscarLista() {
                try {
                    const listaEncontrada = await List.findOne({name: listName});
                    listaEncontrada.items.push(ultimaNota);
                    listaEncontrada.save();
                    res.redirect("/" + listName)   
                } catch (error) {
                    console.error("Error al consultar las listas:", error);
            }  
        }
        buscarLista();
    }}
   
})

app.post("/eliminar", (req, res) => {
    const indice = req.body.indice;
    const listName = req.body.listTitle
    if (listName === "Hoy"){
        async function eliminarItem() {
            try {
                await Item.deleteOne ({ _id: indice})
            } catch (error){
                console.error("Item no pudo ser borrador", error);
            }
        };
        eliminarItem();
        res.redirect("/"); 
    } else {
       async function eliminarItemList() {
        try {
            await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: indice}}})
        } catch (error){
            console.error("Item no pudo ser borrador", error);
        }
       } eliminarItemList();
       res.redirect("/" + listName)
    }
     
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

/// version vieja con laburo

/// const ItemLaburo = mongoose.model("ItemLaburo", itemsSchema);

// app.get("/laburo", (req, res) => {
//     async function consultarItemsLaburo() {
//         try {
//             const listaLaburo = await ItemLaburo.find({});
//             res.render("work.ejs", { toDoListLaburo: listaLaburo })
//         }catch (error) {
//             console.error("Error al consultar los items:", error);
//         }
//     };
//     consultarItemsLaburo();   
// });

// app.post("/laburo", (req, res) => {
//     const nuevoItemLaburo = req.body.nuevaNotaLaburo 
//     if ( nuevoItemLaburo !== "") {
//         const ultimaNotaLaburo = new ItemLaburo ({
//             name: nuevoItemLaburo
//         })
//         ultimaNotaLaburo.save();
//     }
//     res.redirect("/laburo");
// });

// app.post("/eliminarLaburo", (req, res) => {
//     const indice = req.body.indice;
//     async function eliminarItemLaburo() {
//         try{
//             await ItemLaburo.deleteOne ({ _id: indice})
//         } catch (error){
//             console.error("Item no pudo ser borrador", error);
//         }
//     };
//     eliminarItemLaburo();
//     res.redirect("/laburo"); 
// });

