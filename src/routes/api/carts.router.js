import { Router } from 'express';
import CartManager from '../../managers/CartManager.js';

const router = Router();
const manager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
  res.status(201).json(await manager.createCart());
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(Number(req.params.cid));
  cart ? res.json(cart) : res.status(404).send('Not found');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await manager.addProductToCart(
    Number(req.params.cid),
    Number(req.params.pid)
  );
  cart ? res.json(cart) : res.status(404).send('Not found');
});

export default router;
