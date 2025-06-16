const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('form');
});


app.post('/submit-form', (req, res) => {

    const { name, email, message } = req.body;

    console.log('Form data received:');
    console.log({ name, email, message });

    res.render('success', { name, email, message });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
