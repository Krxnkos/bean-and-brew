let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
            <div>
                <h4 class="font-medium text-dark-green">${item.name}</h4>
                <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-dark-green">£${(item.price * item.quantity).toFixed(2)}</span>
                <button onclick="removeFromCart('${item.name}')"
                        class="text-red-500 hover:text-red-700 transition-colors duration-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `£${total.toFixed(2)}`;
}

function addToCart(item) {
    const parsedItem = typeof item === 'string' ? JSON.parse(item) : item;
    const existingItem = cart.find(i => i.name === parsedItem.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...parsedItem, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item added to cart', 'success');
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
}

async function checkout() {
    try {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create order');
        }

        // Clear cart
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        
        showNotification('Order placed successfully!', 'success');
        
        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = `/orders/${data.orderId}`;
        }, 1500);

    } catch (error) {
        console.error('Checkout error:', error);
        showNotification(error.message || 'Failed to process order', 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', updateCartDisplay);