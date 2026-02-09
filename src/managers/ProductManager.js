import fs from 'fs/promises';

export default class ProductManager {
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

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.#readFile();
    const lastId = products.reduce((max, p) => p.id > max ? p.id : max, 0);

    const newProduct = {
      id: lastId + 1,
      status: true,
      ...product
    };

    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updatedFields,
      id
    };

    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const newProducts = products.filter(p => p.id !== id);

    // Si no cambió nada → no existía
    if (products.length === newProducts.length) {
      console.log("No se encontró producto con id:", id);
      return null;
    }

    await this.#writeFile(newProducts);
    console.log("Producto eliminado correctamente:", id);

    return newProducts;
  }
}
