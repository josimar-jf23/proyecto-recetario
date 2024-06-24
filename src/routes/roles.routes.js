import { Router } from "express";

import { getRoles } from "../controllers/roles.controllers.js";

const router = Router();

router.get("/roles", getRoles);

export default router;