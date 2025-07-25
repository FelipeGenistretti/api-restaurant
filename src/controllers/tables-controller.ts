import { Request, Response, NextFunction } from "express";
import knex from "knex";

class TablesController {
    async index(req:Request, res:Response, next:NextFunction){
        try {
            const tables = await knex<TableRepository>("tables").select().orderBy("table_number")
            return res.json()
        } catch (error) {
            next(error);
        }

    }

    
}

export { TablesController }