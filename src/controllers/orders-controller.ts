import { table } from "console";
import { Request, Response, NextFunction } from "express";
import { number, z } from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";


class OrdersController {
    async create(req:Request, res:Response, next:NextFunction){
        try {
            const bodySchema = z.object({
                table_session_id : z.number(),
                product_id : z.number(),
                quantity: z.number()
            })

            const { table_session_id, product_id, quantity } = bodySchema.parse(req.body);
            const session = await knex<TableSessionRepository>("tables_sessions").select().where({ id:table_session_id }).first();

            if(!session){
                throw new AppError("This session does not exist!")
            }

            if(session.closed_at){
                throw new AppError("This table is closed!")
            }

            const product = await knex<ProductRepository>("products").select().where({ id:product_id }).first();
            
            if(!product){
                throw new AppError("Product not found")
            }

            await knex<OrderRepository>("orders").insert({
                table_session_id, 
                product_id,
                quantity,
                price:product.price,
            })

            return res.json(session)
        } catch (error) {
            next(error )
        }
    }

    async index(req:Request, res:Response, next:NextFunction){
        try {
            const { table_session_id } = req.params

            const order = await knex("orders")
                .select("orders.id", "order.table_session_id", "orders.product_id", "product.name", "orders.price", "orders.quantity")
                .join("products", "products.id", "orders.product_id")
                .where({ table_session_id })

            return res.json(order)
        } catch (error) {
            next(error)
        }
    }
}

export { OrdersController }