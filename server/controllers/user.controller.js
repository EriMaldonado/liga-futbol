import bcrypt from "bcrypt";
import { pool } from "../db.js";

// Obtener todos los usuarios (para propósitos de administración o pruebas)
export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT id, username, correo FROM usuarios"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "SELECT id, username, correo FROM usuarios WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: `Usuario con ID: ${id} no encontrado` });
    }

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Buscar al usuario por correo
    const [userResult] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userResult[0];

    // Comparar contraseñas
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Devuelve los datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error); // Agrega un log para ayudar en la depuración
    return res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario (opcional, para pruebas o administración)
export const createUser = async (req, res) => {
  try {
    const { username, correo, password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO usuarios (username, correo, password) VALUES (?, ?, ?)",
      [username, correo, hashedPassword]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      correo,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, correo, password } = req.body;

    // Si se proporciona una nueva contraseña, encriptarla
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const [result] = await pool.query(
      "UPDATE usuarios SET username = ?, correo = ?, password = ? WHERE id = ?",
      [username, correo, hashedPassword || pool.escape(null), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar un usuario existente
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
