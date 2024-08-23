import express from 'express';
import cors from 'cors'
import {PORT} from './config.mjs'
import jugadorRoutes from "./routes/jugadorRoutes.js";
import userRoutes from "./routes/user.routes.js"
const app= express();
app.use(express.json());
app.use(cors());

app.use("/api/",jugadorRoutes);
app.use("/api/", userRoutes);
app.listen(PORT)
console.log(`Server is listening on port ${PORT}`);


