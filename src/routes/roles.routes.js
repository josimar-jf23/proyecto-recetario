import { Router } from "express";
import { body } from "express-validator";
import authorize from "../middleware/authorization.js";

import { getRoles, getRole,addRole } from "../controllers/roles.controllers.js";

const router = Router();

router.get("/roles",authorize("roles", "access"), getRoles);
router.get("/roles/:roleId",authorize("roles", "access"), getRole);
router.post(
    "/roles/create",
    [
        authorize("roles", "insert"),
        body("name").notEmpty().withMessage("El Nombre esta vacia"),
        body("permissions").notEmpty().withMessage("Los permisos esta vacia"),
        body("modules").notEmpty().withMessage("Los modulos esta vacia"),
    ],
    addRole
);

export default router;