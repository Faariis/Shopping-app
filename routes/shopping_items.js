const express = require('express');
const connection = require('../connection');
const router = express.Router();

// Dobavi sve proizvode

router.get('/get', (req, res) =>{
    var query = "select *from shopping_items order by name";
    connection.query(query, (err, results) =>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Dodavanje novog proizvoda 

router.post('/add', (req, res) =>{
    let shopping_items = req.body;
    query = "insert into shopping_items (name, stock_count) values(?,?)";
    connection.query(query, [shopping_items.name, shopping_items.stock_count], (err, results) =>{
        if(!err){
            return res.status(200).json({message: "Proizvod je uspješno dodan!"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Izmijeni proizvod

router.patch('/update', (req, res) =>{
    let shopping_items = req.body;
    var query = "update shopping_items set name=?, stock_count=? where id=?";
    connection.query(query, [shopping_items.name, shopping_items.stock_count, shopping_items.id], (err, results) =>{
        if (!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Id biranog proizvoda se ne može naći!"});
            }
            return res.status(200).json({message: "Proizvod uspješno izmijenjen!"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Izbriši kupca

router.delete('/delete', (req, res) => {
    let shopping_items = req.body;
    let query = "delete from shopping_items WHERE id=?";
    connection.query(query, [shopping_items.id], (err, results) => {
        if (!err) {
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Id biranog proizvoda se ne može naći."});
            }
            return res.status(200).json({message: "Proizvod uspješno izbrisan!"});
        } else {
            console.log(err);
        }
    });
});


module.exports = router;


