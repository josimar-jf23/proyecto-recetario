import express from 'express'
import {PORT} from './src/config.js'
import usersRoutes from './src/routes/users.routes.js'
const app=express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message:"hola mundo" });
});

app.use('/users',usersRoutes);

app.listen(PORT);
console.log("server on port",PORT);