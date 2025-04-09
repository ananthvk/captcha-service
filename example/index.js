import express from "express"

const app = express()
const port = 3001
const captchaServerBaseUrl = "http://localhost:3000/api/v1"

app.use(express.static('public'))
app.use(express.json());

app.post('/captchaverify', (req, res) => {
    if (req.body && req.body.solution && req.body.captchaId) {
        // Verify with backend server
        // Two responses - success, failure

        const solution = req.body.solution
        const captchaId = req.body.captchaId

        console.log(`Verifying ${captchaId} with solution ${solution}`)

        fetch(`${captchaServerBaseUrl}/captcha/verify`, { method: 'POST', body: JSON.stringify({ solution: solution, id: captchaId }), headers: { 'Content-Type': 'application/json' } })
            .then(res => res.json())
            .then(data => {
                if (data.error || (data.status && data.status === 'error')) {
                    console.log(`${captchaId} is invalid`)
                    res.send({ verification: 'failure' })
                }
                else if (data.status && data.status === 'success') {
                    console.log(`${captchaId} is valid`)
                    res.send({ verification: 'success' })
                }
                else {
                    console.log(`${captchaId} is invalid`)
                    res.send({ verification: 'failure' })
                }
            })
            .catch(err => {
                console.log('Error occured while verifying captcha')
                res.send({ verification: 'failure' })
            })

    } else {
        console.log('Bad request')
        res.send({ verification: 'failure' })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})