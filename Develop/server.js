const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const db = require('./db/db.json')
const fs = require('fs');
let notes = db;
const uuid = require('./public/assets/uuid')

app.use(express.static('public'));
app.use(express.json(''))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            tip_id: uuid(),
        }
        console.log(newNote);
        const newNoteJSON = JSON.stringify(newNote);
        notes.push(newNote);

        const stringNotes = JSON.stringify(notes); 

        fs.writeFileSync('db/db.json', stringNotes, (err) => {
            if (err) {console.error(`This is the error ${err}`)}
            else {
               console.log(`written successfully`)
            }
        })    
        
        res.json(stringNotes);

    } else {
        res.send("Include note title and text within body of post");
    }

})

app.delete('/api/notes/:id',(req, res)=>{
    notes = notes.filter(note=>note.tip_id!=req.params.id);

    const noteJSON = JSON.stringify(notes);

    fs.writeFileSync('db/db.json', noteJSON, (err) => {
        if (err) {console.error(`This is the error ${err}`)}
        else {
           console.log(`written successfully`)
        }
    }) 
    res.sendStatus(200);

})


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

