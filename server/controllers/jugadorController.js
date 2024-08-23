import { error } from "console";
import { pool } from "../db.js";

export const getPlayers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = search
      ? `SELECT * FROM jugador WHERE 
          nombre LIKE ? OR 
          fecha_nacimiento LIKE ? OR 
          jugador_id = ?`
      : `SELECT * FROM jugador`;
    const params = search ? [`%${search}%`, `%${search}%`,`%${search}`, search] : [];

    const [result] = await pool.query(query, params);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPlayer = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM jugador WHERE jugador_id = ?", [
      req.params.id,
    ]);
    if (result.length === 0)
      return res
        .status(404)
        .json({ message: `Jugadpr con ID: ${req.params.id} no encontrado` });

    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPlayer= async (req, res) => {
 try {
     const { nombre, fecha_nacimiento, equipo_id } = req.body;
     const [result] = await pool.query(
       "INSERT INTO jugador(nombre,fecha_nacimiento, equipo_id) VALUES (?,?,?)",
       [nombre, fecha_nacimiento, equipo_id]
     );

     res.json({
       id: result.insertId,
       nombre,
       fecha_nacimiento,
       equipo_id,
     });
 } catch (error) {
    return res.status(500).json({ message: error.message });
 }
};

export const updatePlayer = async (req, res) => {
  try {
    const [result] = await pool.query("UPDATE jugador SET ? where jugador_id= ? ", [
      req.body,
      req.params.id,
    ]);
    res.json(result);
  } catch (error) {
   return res.status(500).json({ message: error.message }); 
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM jugador WHERE jugador_id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    res.status(200).json({ message: "Jugador eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

