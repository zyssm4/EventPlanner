
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Language } from '../types';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, language } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      language: language || Language.EN
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const updateLanguage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { language } = req.body;

    await User.update(
      { language },
      { where: { id: req.userId } }
    );

    res.json({ message: 'Language updated' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'name', 'language', 'createdAt']
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
