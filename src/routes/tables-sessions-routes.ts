import { Router } from "express";

import { TablesSessionsController } from "@/controllers/tables-sessions-controller";

const tablesSessionsRoutes = Router();
const tableSessionsController = new TablesSessionsController();

tablesSessionsRoutes.post("/", tableSessionsController.create);
tablesSessionsRoutes.get("/", tableSessionsController.index);
tablesSessionsRoutes.put("/", tableSessionsController.update);

export { tablesSessionsRoutes }