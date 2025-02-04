// Require
require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const port = process.env.PORT ? process.env.PORT : '3000'

// Creates a connection in MongoDB Database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log('hello')
    console.log(`Connected to MongoDB Database ${mongoose.connection.name}`)
})


// Controllers
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
// const vipCtrl = require('./controllers/vip')
const applicationsCtrl = require('./controllers/applications')

// Middleware
app.use(express.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(passUserToView)

// Route handlers
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)

// View all applications
app.get('/users/:userId/applications', applicationsCtrl.index)
// app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)

// Anything under here, the user must be signed in
app.use(isSignedIn)

// View new application form
app.get('/users/:userId/applications/new', applicationsCtrl.newApplication)
// Post the application form
app.post('/users/:userId/applications', applicationsCtrl.createApplication)
// Show page for individual applications
app.get('/users/:userId/applications/:applicationId', applicationsCtrl.show)
// Deletes the application
app.delete('/users/:userId/applications/:applicationId', applicationsCtrl.deleteApplication)
// View an edit form
app.get('/users/:userId/applications/:applicationId/edit', applicationsCtrl.edit)
app.put('/users/:userId/applications/:applicationId', applicationsCtrl.update)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})


