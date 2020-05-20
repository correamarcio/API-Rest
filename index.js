const express = require("express")
const app = new express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

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
    ]
}

app.get("/times", (req, res) => {
    res.statusCode = 200
    res.json(DB.times)
})

app.get("/time/:id", (req, res) => {
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

app.post("/time", (req, res) => {
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
        res.sendStatus(409)
    }
    DB.times.push({
        id,
        name,
        points,
        goals
    })
    res.sendStatus(200)
})

app.delete("/time/:id", (req, res) => {
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

app.put("/time/:id", (req, res) => {
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


app.listen("8080", () => {})