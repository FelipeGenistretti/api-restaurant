import { Request, Response, NextFunction } from "express";
import { z } from 'zod';
import { knex } from "@/database/knex";

class ProductController {

    async index (req:Request, res:Response, next:NextFunction){
        try {
            const { name } = req.query
            const products = await knex<ProductRepository>("products")
            .select()
            .whereLike("name", `%${name ?? ""}%`)
            .orderBy("name");
            

            return res.json(products);
        } catch (error) {
            next(error)
            
        }
    }

    async create(req:Request, res:Response, next:NextFunction){
        try {
            const bodySchema = z.object({
                name: z.string({ required_error: "name is required" }).trim().min(6),
                price : z.number({ required_error: "price is required!" }).gt(0, {message:"value must be greater than 0"})
            })

            const { name, price } = bodySchema.parse(req.body)

            await knex<ProductRepository>("products").insert({ name, price })

            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async update(req:Request, res:Response, next:NextFunction){
        try {
            const bodySchema = z
            .string()
            .transform((value)=>Number(value))
            .refine((value)=> !isNaN(value), { message: "id must be a number" }) 
            const id = bodySchema.parse(req.params.id)

            return res.status(200).json({message:`Product ${id} has been updated successfully!`})

        } catch (error) {
            next(error)
        }
    }

}

export { ProductController }