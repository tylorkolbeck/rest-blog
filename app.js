//  APPLICATION LEVEL
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

// ATTATCH THE ROUTES
const postsRoutes = require('./api/routes/posts')
const commentsRoutes = require('./api/routes/comments')
const userRoutes = require('./api/routes/user')

//Set up mongoose connection
// const mongoConnectionString = `mongodb://${process.env.MLAB_USERNAME}:${process.env.MLAB_PASSWORD}@ds159013.mlab.com:59013/blog_db`
// Local DB
const mongoConnectionString = process.env.MONGO_LOCAL_DB // DONT FORGET TO START LOCAL MONGODB

mongoose.connect(mongoConnectionString, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// ######### Middleware ########
app.use(morgan('dev')) // logs incoming requests
// https://www.npmjs.com/package/body-parser

// make the uploads file public.
app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({extended: false})) // parses url encoded bodies
app.use(bodyParser.json()) // parses json encoded bodies
// THIS IS FOR CORS HEADER SETTINGS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // Allow cross server requests
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next() // Allow the request to continue to the routes
})


 
// DISABLE X-Powered-By header.  Prevents attackers from detecting apps running express
app.disable('x-powered- by')

app.use(cors())

// Sets up a middleware which every request is funneled through and forwarded to routes
app.use('/posts', postsRoutes) 
// app.use('/comments', commentsRoutes) // FUTURE IMPLEMENTATION
app.use('/user', userRoutes) 
// app.use('/filter/:filterTag', postsRoutes) 

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app