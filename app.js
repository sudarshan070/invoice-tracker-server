var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var cors = require('cors')


require('dotenv').config()

const MONGO_URI = `mongodb+srv://spShinde:sudarshan@cluster0.lizcx.mongodb.net/invoice-tracker?retryWrites=true&w=majority`

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log("connected", err ? err : true);
})

mongoose.set('useCreateIndex', true)



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var invoiceRouter = require('./routes/invoice')
var adminRouter = require('./routes/admin')

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/invoice', invoiceRouter)
app.use('/api/admin', adminRouter)

module.exports = app;
