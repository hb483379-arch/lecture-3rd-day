// 1. Generate 25 Products
const products = [];
for (let i = 1; i <= 25; i++) {
    products.push({ 
        id: i, 
        name: `Organic Herbal Item ${i}`, 
        price: 200 + (i * 20),
        img: `https://picsum.photos/200/200?random=${i}`
    });
}

// 2. Load Cart
let cart = JSON.parse(localStorage.getItem('herbal_cart')) || [];

// 3. Display Products
function display(items = products) {
    const list = document.getElementById('product-list');
    if(!list) return;
    list.innerHTML = items.map(p => `
        <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition group">
            <div class="overflow-hidden rounded-xl mb-3 h-32">
                <img src="${p.img}" class="h-full w-full object-cover group-hover:scale-110 transition duration-500" alt="Herbal">
            </div>
            <h3 class="font-bold text-[10px] h-8 overflow-hidden text-gray-800 mb-1">${p.name}</h3>
            <p class="text-green-700 font-bold mb-3 text-xs italic">Rs. ${p.price}</p>
            <button onclick="addToCart(${p.id})" class="mt-auto bg-gray-800 text-white py-2 rounded-lg text-[9px] font-bold hover:bg-green-700 transition uppercase">Add to Cart</button>
        </div>`).join('');
    updateUI();
}

// 4. Search
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    display(filtered);
}

// 5. Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) { existing.qty += 1; } 
    else { cart.push({ ...product, qty: 1 }); }
    saveAndRefresh();
    showPopup();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('herbal_cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const itemsDiv = document.getElementById('cart-items');
    if(!itemsDiv) return;
    let total = 0, count = 0;
    itemsDiv.innerHTML = ""; 
    cart.forEach(item => {
        total += (item.price * item.qty);
        count += item.qty;
        itemsDiv.innerHTML += `
            <div class="bg-white p-2 rounded-xl border flex justify-between items-center shadow-sm text-[10px]">
                <div class="flex items-center gap-2">
                    <img src="${item.img}" class="w-8 h-8 rounded object-cover">
                    <div>
                        <p class="font-bold">${item.name}</p>
                        <p class="text-gray-500">Rs.${item.price} x ${item.qty}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold text-green-700">Rs.${item.price * item.qty}</span>
                    <button onclick="removeFromCart(${item.id})" class="text-red-400"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    });
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total').innerText = total;
}

// 6. UI Toggles
function toggleMenu() { document.getElementById('side-menu').classList.toggle('-translate-x-full'); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('translate-x-full'); }
function openWallet() { 
    if(cart.length === 0) return alert("Cart is empty!");
    document.getElementById('wallet-modal').classList.remove('hidden'); 
}
function closeWallet() { document.getElementById('wallet-modal').classList.add('hidden'); }

function showPopup() {
    const popup = document.getElementById('success-popup');
    if(!popup) return;
    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('hidden'), 2000);
}

// 7. WHATSAPP CHATBOT FUNCTIONS
function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.classList.toggle('hidden');
}

function sendWhatsAppMsg() {
    const input = document.getElementById('wa-input');
    const msg = input.value.trim();
    if(msg !== "") {
        const url = `https://wa.me/9779809407713?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        input.value = "";
        toggleChat();
    } else {
        alert("Please type something first!");
    }
}

window.onload = () => display(products);