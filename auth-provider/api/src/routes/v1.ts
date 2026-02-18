import { Router } from 'express';
import passport from 'passport';
import { publishUserCreation } from '../config/rabbit.js';

const router = Router();


if (process.env.USE_GOOGLE_AUTH === 'true') {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', 
    passport.authenticate('google', { session: false }),
    (req, res) => {
      publishUserCreation(req.user);
      res.status(202).json({ message: "Provisioning Account", user: req.user });
    }
  );
}

if (process.env.USE_GITHUB_AUTH === 'true') {
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
  router.get('/github/callback', 
    passport.authenticate('github', { session: false }),
    (req, res) => {
      publishUserCreation(req.user);
      res.status(202).json({ message: "Provisioning GitHub Account", user: req.user });
    }
  );
}


export default router;