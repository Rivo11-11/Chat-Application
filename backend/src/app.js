
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const notFoundMiddleware = require('./middlewares/not-found');
const handleErrorMiddleware = require('./middlewares/error-handler')
const api = require('./routes/api')

const app = express();

// chains of Middlewares

app.use(cors()) ;  //
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());



// app.use(express.static(path.join(__dirname, '..','public')))

app.use('/v1',api)
app.use(handleErrorMiddleware)
app.use(notFoundMiddleware)

// '/*' make our frontend handle the client-side routing
// app.get('/*', (req,res) => {
//     res.sendFile(path.join(__dirname, '..','public','index.html'))
// })

module.exports = app