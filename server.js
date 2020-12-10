if(process.env.NODE_ENV !== 'production'){
   require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey, stripePublicKey)
const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

var lastcharge
var mail
var errormessage
var billing_details
var lastamount

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

app.get('/store2', function(req,res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end()
        } else {
            res.render('store2.ejs', {
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

app.get('/success2', function(req,res){
    
    res.render('success2.ejs', {
        billing_details: billing_details,
        lastamount:  lastamount
       
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

app.post('/pay', async (request, response) => {
    try {
       const data = fs.readFileSync('items.json', 'utf8')
       const itemsJson = JSON.parse(data)
       const itemsArray = itemsJson.music.concat(itemsJson.merch)
       let total = 0
       request.body.items.forEach(function(item){
           const itemJson = itemsArray.find(function(i){
               return i.id == item.id
           })
           total = total + itemJson.price * item.quantity
       }) 
       billing_details = request.body.billing_details
      // Create the PaymentIntent
      let intent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        payment_method: request.body.payment_method_id,
  
        // A PaymentIntent can be confirmed some time after creation,
        // but here we want to confirm (collect payment) immediately.
        confirm: true,
  
        // If the payment requires any follow-up actions from the
        // customer, like two-factor authentication, Stripe will error
        // and you will need to prompt them for a new payment method.>
        error_on_requires_action: true
      });
      return generateResponse(response, intent);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        // Display error on client
        console.log("DisplayError on client")

        return response.send({ error: e.message });
      } else {
        // Something else happened
        console.log("something else happend")
        return response.status(500).send({ error: e.type });
      }
    }
  });

  function generateResponse(response, intent) {
    if (intent.status === 'succeeded') {
      console.log("succeeded")
      lastamount = intent.amount
      response.redirect(301, '/success2')
     //return response.send({ success: true });
    } else {
      console.log("unexpected status")
      return response.status(500).send({error: 'Unexpected status ' + intent.status});
    }
  }
console.log("browse the website at http://localhost:8080/")
app.listen(8080)
