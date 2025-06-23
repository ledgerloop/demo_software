import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock invoice storage (replace with actual database)
const invoices = [];

// Get all invoices
router.get('/', (req, res) => {
  try {
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoice by ID
router.get('/:id', (req, res) => {
  try {
    const invoice = invoices.find(i => i.id === req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create invoice
router.post('/', [
  body('clientId').notEmpty(),
  body('invoiceNumber').notEmpty().trim(),
  body('total').isNumeric().toFloat(),
  body('items').isArray(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoice = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    invoices.push(invoice);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update invoice
router.put('/:id', [
  body('total').optional().isNumeric().toFloat(),
  body('items').optional().isArray(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const invoiceIndex = invoices.findIndex(i => i.id === req.params.id);
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(invoices[invoiceIndex]);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete invoice
router.delete('/:id', (req, res) => {
  try {
    const invoiceIndex = invoices.findIndex(i => i.id === req.params.id);
    if (invoiceIndex === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    invoices.splice(invoiceIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;