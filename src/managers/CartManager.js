import fs from 'fs/promises';

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.#readFile();
    const lastId = carts.reduce((max, c) => c.id > max ? c.id : max, 0);

    const newCart = {
      id: lastId + 1,
      products: []
    };

    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.#readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const product = cart.products.find(p => p.product === pid);
    if (product) {
      product.quantity++;      // Si existe incrementa en 1 el producto
    } else {
      cart.products.push({ product: pid, quantity: 1 });   // Si no existe sube un producto
    }

    await this.#writeFile(carts);
    return cart;
  }
}
