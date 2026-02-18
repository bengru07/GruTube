import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { v4 as uuidv4 } from 'uuid';

if (process.env.USE_GOOGLE_AUTH === 'true') {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth is enabled but GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing in .env');
  }
  
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/v1/google/callback"
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      const userPayload = {
        id: uuidv4(),
        externalId: profile.id,
        provider: 'google',
        email: profile.emails?.[0].value,
        name: profile.displayName,
        profilePic: profile.photos?.[0].value,
        handle: `@user_${uuidv4().slice(0, 8)}`,
        channelId: uuidv4()
      };
      return done(null, userPayload);
    }
  ));
}

if (process.env.USE_GITHUB_AUTH === 'true') {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.warn('GitHub OAuth is enabled but GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing in .env');
  }

  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/auth/v1/github/callback"
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      const userPayload = {
        id: uuidv4(),
        externalId: profile.id,
        provider: 'github',
        email: profile.emails?.[0].value || `${profile.username}@github.placeholder`,
        name: profile.displayName || profile.username,
        profilePic: profile._json.avatar_url,
        handle: `@user_${uuidv4().slice(0, 8)}`,
        channelId: uuidv4()
      };
      return done(null, userPayload);
    }
  ));
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));