import { Router } from "express";
import { body } from "express-validator";
import authorize from "../middleware/authorization.js";

import {
    getUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser,
} from "../controllers/users.controllers.js";

const router = Router();

router.get("/users", authorize("users", "access"), getUsers);
router.get("/users/:userId", authorize("users", "access"), getUser);
router.post(
    "/users/create",
    [
        authorize("users", "insert"),
        body("email").isEmail().withMessage("El Correo no es valido"),
        body("password").notEmpty().withMessage("La contraseña esta vacia"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("La contraseña minimo 8 caracteres"),
    ],
    addUser
);
router.post("/users/delete", authorize("users", "delete"), deleteUser);
router.post("/users/update", authorize("users", "update"), updateUser);

export default router;
