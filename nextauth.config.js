import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { pool } from "./db"; 

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const [rows, fields] = await pool.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [user.email]
      );

      if (rows.length > 0) {
        return true; 
      } else {
        return false; 
      }
    },
  },
  session: {
    jwt: true, 
  },
});
