const express = require('express');
const connection = require('../connection');
const router = express.Router();


// Dobavi sve kupce

router.get('/get', (req, res) =>{
    var query = "select *from shoppers order by shopper_name";
    connection.query(query, (err, results) =>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Kreiranje novog kupca

router.post('/add', (req, res) =>{
    let shoppers = req.body;
    query = "insert into shoppers (shopper_name) values(?)";
    connection.query(query, [shoppers.shopper_name], (err, results) =>{
        if(!err){
            return res.status(200).json({message: "Kupac je uspješno dodan!"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Izmijeni kupca

router.patch('/update', (req, res) =>{
    let shoppers = req.body;
    var query = "update shoppers set shopper_name=? where id=?";
    connection.query(query, [shoppers.shopper_name, shoppers.id], (err, results) =>{
        if (!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Id biranog kupca se ne može naći!"});
            }
            return res.status(200).json({message: "Kupac uspješno izmijenjen!"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

// Izbriši kupca

router.delete('/delete', (req, res) => {
    let shoppers = req.body;
    let query = "delete from shoppers WHERE id=?";
    connection.query(query, [shoppers.id], (err, results) => {
        if (!err) {
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Id biranog kupca se ne može naći."});
            }
            return res.status(200).json({message: "Kupac uspješno izbrisan."});
        } else {
            console.log(err);
        }
    });
});

module.exports = router;