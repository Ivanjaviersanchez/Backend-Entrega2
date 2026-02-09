const socket = io();

const list = document.getElementById('productList');
const form = document.getElementById('productForm');


// CREAR PRODUCTO
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    title: form.title.value,
    price: Number(form.price.value)
  };
  
  console.log("Enviando nuevo producto al servidor:", data);
  socket.emit('newProduct', data);
  form.reset();
});


// ELIMINAR PRODUCTO
function deleteProduct(id) {
    console.log("Solicitando eliminación id:", id);
    socket.emit('deleteProduct', id);
}

// Función al HTML dinámico
window.deleteProduct = deleteProduct;


// RENDER DINÁMICO
socket.on('updateProducts', products => {
  list.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');

    li.innerHTML = `
      ${product.title} - $${product.price}
      <button onclick="deleteProduct(${product.id})">
        Eliminar
      </button>
    `;

    list.appendChild(li);
  });
});

// ---------- ALERTAS VISUALES ----------
socket.on('productCreated', product => {
  alert(`Producto agregado: ${product.title}`);
  console.log("✅ Producto agregado:", product);
});

socket.on('productDeleted', id => {
  alert(`Producto eliminado (id: ${id})`);
  console.log("❌ Producto eliminado id:", id);
});


