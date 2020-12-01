var stripe = Stripe(stripePublicKey);

(function() {
  'use strict';

  var elements = stripe.elements({
   
    // Stripe's examples are localized to specific languages, but if
    // you wish to have Elements automatically detect your user's locale,
    // use `locale: 'auto'` instead.
    locale: window.__exampleLocale
  });

  // Floating labels
  var inputs = document.querySelectorAll('.cell.example.example2 .input');
  Array.prototype.forEach.call(inputs, function(input) {
    input.addEventListener('focus', function() {
      input.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      input.classList.remove('focused');
    });
    input.addEventListener('keyup', function() {
      if (input.value.length === 0) {
        input.classList.add('empty');
      } else {
        input.classList.remove('empty');
      }
    });
  });

  var elementStyles = {
    base: {
      color: '#32325D',
      fontWeight: 500,
      fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      '::placeholder': {
        color: '#CFD7DF',
      },
      ':-webkit-autofill': {
        color: '#e39f48',
      },
    },
    invalid: {
      color: '#E25950',

      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  };

  var elementClasses = {
    focus: 'focused',
    empty: 'empty',
    invalid: 'invalid',
  };

  var cardNumber = elements.create('cardNumber', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardNumber.mount('#example2-card-number');

  var cardExpiry = elements.create('cardExpiry', {
    style: elementStyles,
    classes: elementClasses,
  });
  cardExpiry.mount('#example2-card-expiry');

  var cardCvc = elements.create('cardCvc', {
        style: elementStyles,
        classes: elementClasses,
    });
    cardCvc.mount('#example2-card-cvc');


  ///////////////////////////////////////////////

 
var form = document.getElementById('payment-form');

var resultContainer = document.getElementById('payment-result');
cardNumber.on('change', function(event) {
  if (event.error) {
    resultContainer.textContent = event.error.message;
  } else {
    resultContainer.textContent = '';
  }
});

var biling_details = { 
  address: {
    city: document.getElementById('example2-city').value, 
    line1: document.getElementById('example2-address').value,
    postal_code: document.getElementById('example2-zip').value,
    state: document.getElementById('example2-code').value,
  },
  email : document.getElementById('example2-mail')

}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  var name = document.getElementById('example2-name').value + " " + document.getElementById('example2-surname').value
  var billing_details = { 
    address: {
      city: document.getElementById('example2-city').value, 
      country: document.getElementById('example2-code').value,
      line1: document.getElementById('example2-address').value,
      postal_code: document.getElementById('example2-zip').value,
      state: document.getElementById('example2-country').value,
    },
    email: document.getElementById('example2-mail').value,
    name: name  
  }
  resultContainer.textContent = "";
  stripe.createPaymentMethod({
    type: 'card',
    card: cardNumber,
    billing_details : billing_details
    
  }).then(handlePaymentMethodResult);
});

function handlePaymentMethodResult(result) {
  if (result.error) {
    // An error happened when collecting card details, show it in the payment form
    resultContainer.textContent = result.error.message;
  } else {
    // Otherwise send paymentMethod.id to your server (see Step 3)
    var items = []
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var quantity = quantityElement.value
        var id = cartRow.dataset.itemId
        items.push({
            id: id,
            quantity: quantity
        })
    }
    console.log(result)
    fetch('/pay', {
      method: 'POST',
      redirect: 'follow',
      headers: { 
        'Content-Type': 'application/json',
        
     },
      body: JSON.stringify(
        { payment_method_id: result.paymentMethod.id,
          items: items,
          billing_details : result.paymentMethod.billing_details
        })

    }).then(function(result) {
      console.log("result !!!!!!!!! ")
      console.log(result)
      window.location.href = result.url;
      return result.json();
    }).then(handleServerResponse);
  }
}

function handleServerResponse(responseJson) {
  if (responseJson.error) {
    // An error happened when charging the card, show it in the payment form
    console.log("reponse !!")
    console.log(responseJson)
    resultContainer.textContent = responseJson.error;

  } else {
    // Show a success message
    resultContainer.textContent = 'Success!';
  }
}


})();


