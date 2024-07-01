import express from "express";
import { PORT } from "./src/config.js";
import usersRoutes from "./src/routes/users.routes.js";
import rolesRoutes from "./src/routes/roles.routes.js";
import seguridadRoutes from "./src/routes/seguridad.routes.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    req.session = { user: null, access_token: null };
    try {
        if(token){
            const data = jwt.verify(token, process.env.SECRET_KEY);
            req.session.user = data;
            req.session.access_token = token;
        }
    } catch (error){
        //console.log("errores",error);
    }
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "Bienvenido al proyecto recetario" });
});

app.use("", seguridadRoutes);
app.use("/api", usersRoutes);
app.use("/api", rolesRoutes);

app.listen(PORT);
console.log("server on port", PORT);
