import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock client storage (replace with actual database)
const clients = [];

// Get all clients
router.get('/', (req, res) => {
  try {
    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get client by ID
router.get('/:id', (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create client
router.post('/', [
  body('name').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('hourlyRate').isNumeric().toFloat(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    clients.push(client);
    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update client
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('hourlyRate').optional().isNumeric().toFloat(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const clientIndex = clients.findIndex(c => c.id === req.params.id);
    if (clientIndex === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }

    clients[clientIndex] = {
      ...clients[clientIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(clients[clientIndex]);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete client
router.delete('/:id', (req, res) => {
  try {
    const clientIndex = clients.findIndex(c => c.id === req.params.id);
    if (clientIndex === -1) {
      return res.status(404).json({ error: 'Client not found' });
    }

    clients.splice(clientIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;