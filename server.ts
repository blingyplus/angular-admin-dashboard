import express, { Request } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

// Create Express app
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env['MONGODB_URI'] || '')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT
const authenticateToken = (req: AuthenticatedRequest, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env['JWT_SECRET'] || '', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env['JWT_SECRET'] || ''
    );
    return res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    return res.status(400).json({ error: 'Error logging in' });
  }
});

app.get(
  '/api/profile',
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = await User.findById(req.user?.userId).select('-password');
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching profile' });
    }
  }
);

// Start server
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
