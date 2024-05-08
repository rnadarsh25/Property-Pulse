import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/db';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        // this will hep user to choose google account each time, else it will auto select the first logged account
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // Invoked when successful signedIn
    async signIn({ profile }) {
      // 1. connect to db,
      await connectDB();
      // 2. check if user exists,
      const isUserExists = await User.findOne({ email: profile.email });
      //3. if not, add user to db,
      if (!isUserExists) {
        //truncate name if too long
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      //4. return truue to allow sign in
      return true;
    },

    // modifies the session object.
    async session({ session }) {
      if (!session) return session;
      // 1. get user for db
      const user = await User.findOne({ email: session.user.email });
      // 2. assign user id to session
      session.user.id = user._id.toString();
      // 3. return session
      return session;
    },
  },
};
