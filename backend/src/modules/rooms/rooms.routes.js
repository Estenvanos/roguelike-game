import { Router } from "express";
import { create, list, findByName } from "./rooms.controller.js";

const router = Router();

router.post("/", create);
router.get("/", list);
router.get("/:name", findByName);

export default router;
