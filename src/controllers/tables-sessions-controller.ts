import { table } from "console";
import { Request, Response, NextFunction } from "express";
import { number, z } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

class TablesSessionsController {
    async create(req:Request, res:Response, next:NextFunction){
        try {
            const bodySchema = z.object({
                table_id: z.number()
            })
            const { table_id }= bodySchema.parse(req.body);
            const session = await knex<TableSessionRepository>("tables_sessions")
                .select()
                .where({ table_id })
                .orderBy("opened_at", "desc")
                .first();
            
            if(session && !session.closed_at){
                throw new AppError("This table is already open")
            }

            await knex<TableSessionRepository>("tables_sessions").insert({
                table_id,
                opened_at:knex.fn.now(),
            })

            return res.json()
        } catch (error) {
            next(error);
        }
    }

    async index(req:Request, res:Response, next:NextFunction){
        try {
            const sessions = await knex<TableSessionRepository>("tables_sessions").select().orderBy("closed_at");
            return res.json(sessions)
        } catch (error) {
            next(error)
        }
    }

    async update(req:Request, res:Response, next:NextFunction){
        try {
            const id = z
                .string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), "id must be a number")
                .parse(req.params.id);

            const session = await knex<TableSessionRepository>("tables_sessions").select().where({ id }).first();

            if(!session){
                throw new AppError("Session table not found")
            }

            if(session.closed_at){
                throw new AppError("this session table is already closed")
            }

            await knex<TableSessionRepository>("tables_sessions").update({
                closed_at:knex.fn.now(),
            }).where({ id })
            return res.json()


        } catch (error) {
            next(error)
        }
    }
}

export { TablesSessionsController }