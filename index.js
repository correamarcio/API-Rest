const express = require("express")
const app = new express()
const bodyParser = require("body-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")

const JWTSecret = "esteéumtokenaleatorio"

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

function auth(req, res, next) {
    const authtoken = req.headers['authorization']
    if (authtoken != undefined) {
        const bearer = authtoken.split(" ")
        let token = bearer[1]

        jwt.verify(token, JWTSecret, (error, data) => {
            if (error) {
                res.status(401)
                res.json({
                    token: 'invalido'
                })
            } else {
                req.token = token
                console.log(data)
                req.loggedUser = {
                    id: data.id,
                    email: data.email
                }
                next()
            }
        })

        next()

    } else {
        res.status(401)
        res.json({
            token: 'invalido'
        })
    }
}

var DB = {
    times: [{
            id: 1,
            name: 'Flamengo',
            points: 81,
            goals: 30
        },
        {
            id: 2,
            name: 'Vasco',
            points: 3,
            goals: 1
        },
        {
            id: 3,
            name: 'Botafogo',
            points: 5,
            goals: 4
        },
        {
            id: 4,
            name: 'Fluminense',
            points: 6,
            goals: 8
        },
    ],
    users: [{
        id: 1,
        name: "Marcio",
        email: "marcio@programador.com.br",
        password: "learn"
    }, {
        id: 2,
        name: "José",
        email: "jose@programador.com.br",
        password: "node"
    }]
}

app.get("/times", auth, (req, res) => {

    res.statusCode = 200
    res.json({
        user: req.loggedUser,
        times: DB.times
    })
})



app.get("/time/:id", auth, (req, res) => {
    let id = req.params.id
    if (isNaN(id) || id == undefined) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        var time = DB.times.find(time => time.id == id)
        if (time == undefined) {
            res.sendStatus(404)
        } else {
            res.json(time)
            res.statusCode = 200
        }
    }
})

app.post("/time", auth, (req, res) => {
    let {
        name,
        points,
        goals,
        id,
    } = req.body
    if (!(isNaN(name)) || name == undefined || isNaN(points) || points == undefined || isNaN(goals) || goals == undefined) {
        res.sendStatus(404)
    }
    var time = DB.times.find(time => time.id == id)

    if (time != undefined) {
        return res.sendStatus(409)
    }
    DB.times.push({
        id,
        name,
        points,
        goals
    })
    res.sendStatus(200)
})

app.delete("/time/:id", auth, (req, res) => {
    let id = req.params.id
    if (isNaN(id) || id == undefined) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        let index = DB.times.findIndex(time => time.id == id)

        if (index == -1) {
            res.sendStatus(404)
        } else {
            DB.times.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

app.put("/time/:id", auth, (req, res) => {
    let id = req.params.id
    if (isNaN(id) || id == undefined) {
        res.sendStatus(400)
    } else {
        let id = parseInt(req.params.id)
        var time = DB.times.find(time => time.id == id)
        if (time == undefined) {
            res.sendStatus(404)
        } else {
            let {
                name,
                points,
                goals,
                id,
            } = req.body

            if (id != undefined) {
                time.id = id
            }

            if (name != undefined) {
                time.name = name
            }

            if (goals != undefined) {
                time.goals = goals
            }

            if (points != undefined) {
                time.points = points
            }

            res.sendStatus(200)
        }
    }
})

app.post("/auth", (req, res) => {
    var {
        email,
        password
    } = req.body
    if (email == undefined || !(isNaN(email))) {
        res.status(400)
        res.json({
            error: "O email enviado é invalido!"
        })
    } else {
        let user = DB.users.find(u => u.email == email)

        if (user == undefined) {
            res.status(404)
            res.json({
                error: "O email enviado não existe na base de dados!"
            })
        } else {
            if (user.password == password) {

                jwt.sign({
                    id: user.id,
                    email: user.id
                }, JWTSecret, {
                    expiresIn: '48h'
                }, (err, token) => {
                    if (err) {
                        res.status(400)
                        res.json({
                            err: "Falha interna"
                        })
                    } else {
                        res.status(200)
                        res.json({
                            token: token
                        })
                    }
                })
            } else {
                res.status(401)
                res.json({
                    error: "Dados invalidos"
                })
            }
        }
    }
})

app.listen("8080", () => {})