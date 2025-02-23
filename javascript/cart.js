let cart = [];

function addToCart(item) {
    console.log('Adding to cart:', item); // Debug log
    const existingItem = cart.find(i => i.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: item.name,
            price: parseFloat(item.price),
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>£${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.name}')" class="remove-btn">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: £${total.toFixed(2)}`;
}

async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    try {
        const response = await fetch('/order/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            })
        });
        
        if (response.ok) {
            cart = [];
            updateCartDisplay();
            window.location.href = '/profile';
        } else {
            alert('Failed to create order');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Error processing order');
    }
}