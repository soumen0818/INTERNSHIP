const express = require('express');
const app = express();
const path = require('path');
const userModel = require ('./models/user');

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>{
    res.render("index");
})
app.get('/read', (req, res) =>{
    res.render("read");
})

app.post('/create', async(res, req) =>{
    let {name , email, image} = res.body;
   let CreatedUser = await userModel.create({
       name,
       email,
       image
    });
    res.send (CreatedUser);
})


app.listen(3000);