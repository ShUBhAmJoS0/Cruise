
import express from 'express';
import {
    submitProblem,
    getAllProblems,
    resolveProblem,
    deleteProblem
} from '../controller/userProblemController.js';
import authToken from '../middleware/firebaseAuth.js';

const router = express.Router();

// Public route for submitting problems
// (Optionally uses authToken if available to link to user, but doesn't require it)
// In server.js, authToken is applied as a global middleware before these routes
// but we want this one to be accessible even without a token.
router.post('/', submitProblem);

// Admin / management routes
router.get('/', getAllProblems);
router.post('/:id/resolve', resolveProblem);
router.delete('/:id', deleteProblem);

export default router;
