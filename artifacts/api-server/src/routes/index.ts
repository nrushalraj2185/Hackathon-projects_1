import { Router, type IRouter } from "express";
import healthRouter from "./health";
import weatherRouter from "./weather";
import cropsRouter from "./crops";
import marketplaceRouter from "./marketplace";
import farmRouter from "./farm";
import laborRouter from "./labor";
import equipmentRouter from "./equipment";
import transportRouter from "./transport";
import schemesRouter from "./schemes";
import sensorsRouter from "./sensors";
import alertsRouter from "./alerts";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/weather", weatherRouter);
router.use("/crops", cropsRouter);
router.use("/marketplace", marketplaceRouter);
router.use("/farm", farmRouter);
router.use("/labor", laborRouter);
router.use("/equipment", equipmentRouter);
router.use("/transport", transportRouter);
router.use("/schemes", schemesRouter);
router.use("/sensors", sensorsRouter);
router.use("/alerts", alertsRouter);

export default router;
