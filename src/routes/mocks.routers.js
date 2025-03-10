import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingpets", mocksController.generatePets);
router.get("/mockingusers", mocksController.generateUsers);
router.post("/generateData/:users/:pets", mocksController.generateData);

export default router;
