const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey, stripePublicKey)
console.log(process.env.NODE_ENV)
const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

var lastcharge
var mail
var errormessage

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/store', function(req,res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end()
        } else {
            res.render('store.ejs', {
                stripePublicKey : stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })

})
app.get('/success', function(req,res){
    
    res.render('success.ejs', {
        charge: lastcharge,
        email:mail
    })
    
})

app.get('/fail', function(req,res){
    
    res.render('fail.ejs', {
        errormessage: errormessage,
    })
        
})




app.post('/purchase', function(req,res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end()
        } else {
            console.log('purchase')
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.forEach(function(item){
                const itemJson = itemsArray.find(function(i){
                    return i.id == item.id
                })
                total = total + itemJson.price * item.quantity
            })
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'

            }).then(function(charge){
                const name = charge.source.name
                lastcharge = charge
                mail = req.body.email
                res.redirect(301, '/success')
            
            }).catch(function(error){
                errormessage = error
                res.redirect(301, '/fail')
            })
        }
    })

})

app.listen(8080)
