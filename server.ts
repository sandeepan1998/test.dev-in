import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'super-secret-key-for-poper';

// Mock Database
let users: any[] = [
  { id: '1', name: 'Admin User', email: 'admin@poper.com', password: 'password', role: 'admin' },
  { id: '2', name: 'Test User', email: 'user@poper.com', password: 'password', role: 'user' }
];

let services: any[] = [
  { id: '1', name: 'Classic Pop', description: 'A timeless popup experience with elegant decorations.', price: 500, image: 'https://picsum.photos/seed/classic/800/600' },
  { id: '2', name: 'Neon Nights', description: 'Vibrant neon lights and modern aesthetic for late-night events.', price: 800, image: 'https://picsum.photos/seed/neon/800/600' },
  { id: '3', name: 'Rustic Charm', description: 'Wooden accents, warm lighting, and a cozy atmosphere.', price: 600, image: 'https://picsum.photos/seed/rustic/800/600' }
];

let bookings: any[] = [
  { id: '1', userId: '2', serviceId: '1', date: '2026-04-15', status: 'confirmed', details: { size: 'Medium', theme: 'Classic' } }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' });
    
    const newUser = { id: String(Date.now()), name, email, password, role: 'user' };
    users.push(newUser);
    
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  });

  // Middleware to verify token
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      // Decode Firebase token (or our mock token)
      const decoded = jwt.decode(token) as any;
      if (!decoded) throw new Error('Invalid token');
      
      req.user = {
        id: decoded.user_id || decoded.id,
        role: decoded.email === 'admin@poper.com' ? 'admin' : (decoded.role || 'user')
      };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Services
  app.get('/api/services', (req, res) => {
    res.json(services);
  });

  // Bookings
  app.get('/api/bookings', authenticate, (req: any, res: any) => {
    if (req.user.role === 'admin') {
      res.json(bookings);
    } else {
      res.json(bookings.filter(b => b.userId === req.user.id));
    }
  });

  app.post('/api/bookings', authenticate, (req: any, res: any) => {
    const { serviceId, date, details } = req.body;
    const newBooking = {
      id: String(Date.now()),
      userId: req.user.id,
      serviceId,
      date,
      status: 'pending',
      details
    };
    bookings.push(newBooking);
    res.json(newBooking);
  });

  // Admin
  app.get('/api/admin/users', authenticate, (req: any, res: any) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
