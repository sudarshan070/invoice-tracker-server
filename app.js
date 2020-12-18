var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')

require('dotenv').config()

const mongoURL = process.env.MONGO_URI

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log("connected", err ? err : true);
})

mongoose.set('useCreateIndex', true)



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var invoiceRouter = require('./routes/invoice')
var adminRouter = require('./routes/admin')

var app = express();

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
