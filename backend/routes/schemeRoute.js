import express from 'express';
import {
  getCentralSchemes,
  getStateSchemes,

  deleteScheme,
  createScheme
} from '../controllers/schemeController.js';

const router = express.Router();

router.get('/central', getCentralSchemes);
router.get('/state', getStateSchemes);
router.post('/', createScheme);
router.delete('/:id', deleteScheme);

export default router;