const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../db.json'));
const middlewares = jsonServer.defaults();
import { WelcomeController } from './controllers';
import { Router, Request, Response, NextFunction } from 'express';

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req: Request, res: Response) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// custom
server.use('/welcome', WelcomeController);

// pre process
server.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Add this before server.use(router)
server.use(
  jsonServer.rewriter({
    '/api/*': '/$1',
    '/blog/:resource/:id/show': '/:resource/:id'
  })
);

// Use default router
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on ' + __dirname);
});
