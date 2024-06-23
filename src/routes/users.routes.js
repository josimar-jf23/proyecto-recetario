import { Router } from "express";

import { getUsers } from "../controllers/users.controllers.js";

const router = Router();

router.get("/", getUsers);
//router.get("/list_users", getUsers);

export default router;