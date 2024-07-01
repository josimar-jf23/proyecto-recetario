import { Router } from "express";
import { body } from "express-validator";

import {
    addUser,
    login,
    logout,
} from "../controllers/users.controllers.js";

const router = Router();

router.post(
    "/register",
    [
        body("email").isEmail().withMessage("El Correo no es valido"),
        body("password").notEmpty().withMessage("La contraseña esta vacia"),
        body('password').isLength({ min: 8 }).withMessage("La contraseña minimo 8 caracteres")
    ],
    addUser
);
router.post(
    "/login",
    [
        body("email").notEmpty().withMessage("El correo esta vacio"),
        body("password").notEmpty().withMessage("La contraseña esta vacia"),
        body("email").isEmail().withMessage("El correo no es valido"),        
    ],
    login
);
router.post("/logout", logout);

export default router;
