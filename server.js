const express = require('express');
const exphbs = require('express-handlebars')
const path = require('path');
const logger = require('./middleware/logger');
const memberRoute = require('./routes/api/members');
const members = require('./Members')

const app = express();

//Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => 
    res.render('index', {
        title: 'Members Application',
        members
    }))

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));
//Logger Middleware
app.use(logger)
//Member api routes
app.use('/api/members', memberRoute)


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`))