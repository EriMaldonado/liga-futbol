// nextauth.config.js

import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { pool } from "./db"; // Asegúrate de importar correctamente tu pool de conexión

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Agrega otros proveedores según tus necesidades
  ],
  callbacks: {
    async signIn(user, account, profile) {
      // Ejemplo de consulta a la base de datos para verificar si el usuario existe
      const [rows, fields] = await pool.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [user.email]
      );

      if (rows.length > 0) {
        return true; // Permite el inicio de sesión si el usuario existe en la base de datos
      } else {
        return false; // Rechaza el inicio de sesión si el usuario no existe
      }
    },
  },
  // Configuración opcional
  session: {
    jwt: true, // Habilita el uso de JWT para sesiones
  },
});
