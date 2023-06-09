const express = require('express')
const app = express()
const toyService = require('./services/toy.service')
// const userService = require('./services/user.service')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')

const PIXELS_API = 'V4Q5ywIXUcmr4WrPtaYPURVzw1QzzSfjHJ9bFdDF9BBaCddb5tTkNQI1'

if (process.env.NODE_ENV === 'production') {
} else {
app.use(express.static(path.resolve(__dirname,'public')))
 const corsOptions = {
origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
credentials: true
}
   app.use(cors(corsOptions))
}

// App Configuration
// const corsOptions = {
//     origin: [
//         'http://127.0.0.1:8080',
//         'http://localhost:8080',
//         'http://127.0.0.1:3000',
//         'http://localhost:3000'
//     ],
//     credentials: true
// }
// app.use(cors(corsOptions))
// app.use(express.static('public'))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body



// **************** Toys API ****************:
// List
app.get('/api/toy', (req, res) => {
    // const { name, labels, inStock, price, createdAt } = req.query
    // const filterBy = { name, labels, inStock }
    // const sortBy = {price, createdAt, name}
    const { filterBy, sortBy } = req.query
    toyService.query(filterBy, sortBy )
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            console.log('Cannot load toys')
            res.status(400).send('Cannot load toys')
        })
})

// Add
app.post('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add toy')
    const { name, inStock, price, labels } = req.body

    const toy = {
        name,
        price: +price,
        labels,
        inStock

    }
        // toyService.save(toy, loggedinUser)
        toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch(err => {
            console.log('Cannot add toy')
            res.status(400).send('Cannot add toy')
        })

})

// Edit
app.put('/api/toy', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update toy')

    const { name, inStock, price, _id, labels } = req.body
    const toy = {
        _id,
        name,
        price: +price,
        inStock,
        labels
    }
        // toyService.save(toy, loggedinUser)
        toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch(err => {
            console.log('Cannot update toy')
            res.status(400).send('Cannot update toy')
        })

})

// Read - getById
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.get(toyId)
        .then(toy => res.send(toy))
        .catch(err => res.status(403).send(err))
})

// Remove
app.delete('/api/toy/:toyId', (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot delete toy')

    const { toyId } = req.params
        // toyService.remove(toyId, loggedinUser)
        toyService.remove(toyId)
        .then(msg => {
            res.send({ msg, toyId })
        })
        .catch(err => {
            console.log('err:', err)
            res.status(400).send('Cannot remove toy, ' + err)
        })
})


// **************** Users API ****************:
// app.get('/api/auth/:userId', (req, res) => {
//     const { userId } = req.params
//     userService.getById(userId).then(user => {
//         res.send(user)
//     })
// })

// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body
//     userService.checkLogin(credentials)
//         .then(user => {
//             const token = userService.getLoginToken(user)
//             res.cookie('loginToken', token)
//             res.send(user)
//         })
//         .catch(err => {
//             res.status(401).send('Not you!')
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body
//     userService.save(credentials)
//         .then(user => {
//             const token = userService.getLoginToken(user)
//             res.cookie('loginToken', token)
//             res.send(user)
//         })
//         .catch(err => {
//             console.log(err)
//             res.status(401).send('Nope!')
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })


const port = process.env.PORT || 3030
app.get('/**', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
console.log(`App listening on port ${port}!`)
})