if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const createError = require('http-errors')
const mongoose = require('mongoose');
const cors = require('cors');
const mongoStore = require('connect-mongo')
const session = require('express-session')
const passport = require('passport')
const methodOverride = require('method-override')

const dbUrl = process.env.MONGODB
// Start Mongo
const options = {
    keepAlive: true,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  
  mongoose.connect(dbUrl, options, (err) => {
    if (err) console.log(err);
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const uploadsRouter = require('./routes/uploads');

var app = express();

const corsConfig = {
    origin: ['http://localhost:3001','https://lambent-druid-75669a.netlify.app', 'https://app.elities.com'],
    credentials: true,
    optionsSuccessStatus:200,
  }
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({mongoUrl: dbUrl, collectionName: 'sessions'}),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadsRouter);

app.use(function(req,res,next){
    next(createError(404));
});


module.exports = app;
