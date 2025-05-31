import express from 'express';
import { addToKnowledgebase } from '../controllers/knowledgebaseController.js';
import { queryKnowledgebase } from '../controllers/queryController.js';

const router = express.Router();

router.post('/knowledgebase', addToKnowledgebase);
router.post('/query', queryKnowledgebase);

export default router;
