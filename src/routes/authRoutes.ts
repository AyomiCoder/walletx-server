import { Request, Response, Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

export default router;




// import { Request, Response, Router } from 'express';
// import { register, login } from '../controllers/authController';

// const router = Router();

// // Register Route
// router.post('/register', (req: Request, res: Response) => register(req, res));

// // Login Route
// router.post('/login', (req: Request, res: Response) => login(req, res));

// export default router;

