import express from 'express';
import apiRouter from "./routes/api/index.js";
import viewsRouter from './routes/views/views-router.js';
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import http from 'http';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

// ---------- MANAGER ----------
const manager = new ProductManager('./src/data/products.json');

// ---------- MIDDLEWARE JSON ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- HANDLEBARS ----------
app.engine('handlebars', handlebars.engine());
app.set('views', `${process.cwd()}/src/views`);
app.set('view engine', 'handlebars');

// ---------- STATIC ----------
app.use(express.static(`${process.cwd()}/src/public`));

// ---------- ROUTERS ----------
app.use('/api', apiRouter);
app.use('/', viewsRouter);

// ---------- HTTP SERVER ----------
const httpServer = http.createServer(app);

// ---------- SOCKET.IO ----------
const io = new Server(httpServer);

io.on('connection', async socket => {
  console.log('Cliente conectado');

  // Envia productos actualizados al conectar
  socket.emit('updateProducts', await manager.getProducts());

  // Escucha crear producto desde la vista realtime
  socket.on('newProduct', async product => {
    const created = await manager.addProduct(product);

    console.log('Producto creado:', created);

    io.emit('updateProducts', await manager.getProducts());
    io.emit('productCreated', created);
  });
  
  // Escucha eliminar producto
  socket.on('deleteProduct', async id => {
    const deleted = await manager.deleteProduct(Number(id));

    if (deleted) {
      console.log('🗑 Producto eliminado id:', id);
      io.emit('updateProducts', deleted);
      io.emit('productDeleted', id);
    } else {
      console.log('⚠ Intento de borrar producto inexistente:', id);
    }
  });

});

// ---------- CORRE EL SERVIDOR ----------
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


