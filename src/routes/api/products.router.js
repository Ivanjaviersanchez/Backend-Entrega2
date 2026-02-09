import { Router } from 'express';
import ProductManager from '../../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  res.json(await manager.getProducts());
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getProductById(Number(req.params.pid));
  product ? res.json(product) : res.status(404).send('Not found');
});

router.post('/', async (req, res) => {
  const newProduct = await manager.addProduct(req.body);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(Number(req.params.pid), req.body);
  updated ? res.json(updated) : res.status(404).send('Not found');
});

router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(Number(req.params.pid));
  res.sendStatus(204);
});

export default router;
