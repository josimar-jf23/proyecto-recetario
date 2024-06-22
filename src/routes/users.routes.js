import { Router } from "express";

import { getUsers } from "../controllers/users.controllers.js";

const router = Router();

router.get("/", (req, res) => {
    let obj_res={ message:"hola mundo" };
    res.json(obj_res);
});
router.get("/list_users", getUsers);

export default router;