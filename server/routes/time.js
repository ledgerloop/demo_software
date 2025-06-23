import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock time entry storage (replace with actual database)
const timeEntries = [];

// Get all time entries
router.get('/', (req, res) => {
  try {
    res.json(timeEntries);
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get time entry by ID
router.get('/:id', (req, res) => {
  try {
    const entry = timeEntries.find(e => e.id === req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Time entry not found' });
    }
    res.json(entry);
  } catch (error) {
    console.error('Get time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create time entry
router.post('/', [
  body('projectName').notEmpty().trim(),
  body('duration').isNumeric().toInt(),
  body('hourlyRate').isNumeric().toFloat(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    timeEntries.push(entry);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update time entry
router.put('/:id', [
  body('duration').optional().isNumeric().toInt(),
  body('hourlyRate').optional().isNumeric().toFloat(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entryIndex = timeEntries.findIndex(e => e.id === req.params.id);
    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    timeEntries[entryIndex] = {
      ...timeEntries[entryIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(timeEntries[entryIndex]);
  } catch (error) {
    console.error('Update time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete time entry
router.delete('/:id', (req, res) => {
  try {
    const entryIndex = timeEntries.findIndex(e => e.id === req.params.id);
    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Time entry not found' });
    }

    timeEntries.splice(entryIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Delete time entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;