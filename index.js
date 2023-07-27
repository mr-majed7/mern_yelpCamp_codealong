if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const campgrounds = require('./routes/campgroundR')
const reviews = require('./routes/reviewR')
const users = require('./routes/userR')
const ExpressError = require('./utility/exrror');
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./modeldata/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const dbLink = process.env.DB_LINK

// 'mongodb://127.0.0.1:27017/yelp'

mongoose.connect(dbLink)
    .then(()=>{
        console.log('DB CONNECTED')
    })
    .catch(err =>{
        console.log("ERROR, COULD NOT CONNECT")
        console.log(err)
    })

app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const store = MongoStore.create({
    mongoUrl: dbLink,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'SeCrEt'
    }
});

const sessionConfig = {
    store,
    secret: 'SeCrEt',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 60480000,
        maxAge: 60480000
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet({
      contentSecurityPolicy: false,
      xDownloadOptions: false,
    })
  );

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    app.locals.user = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/',users)
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)


app.get('/', (req,res)=>{
    res.render('home')
})
app.all('*', (req,res,next)=>{
    next(new ExpressError(404,'PAGE NOT FOUND'));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if (!err.message) err.message = "SOMETHING WENT WRONG"
    res.status(statusCode).render('error', {err})
})



app.listen(3000,()=>{
    console.log("LISTENING ON PORT 3000!")
})