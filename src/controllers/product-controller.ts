import { Request, Response, NextFunction } from "express";
import { z } from 'zod';
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

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
            const id = z
            .string()
            .transform((value)=>Number(value))
            .refine((value)=> !isNaN(value), { message: "id must be a number" }) 
            .parse(req.params.id)

            const bodySchema = z.object({
                name: z.string({ required_error: "name is required" }).trim().min(6),
                price : z.number({ required_error: "price is required!" }).gt(0, {message:"value must be greater than 0"})
            })

            const { name, price } = bodySchema.parse(req.body)

            const product = await knex<ProductRepository>("products").select().where({ id }).first();

            if(!product){
                throw new AppError("Product not found!")
            }

            await knex<ProductRepository>("products").update({name, price, updated_at:knex.fn.now()}).where({ id });

            return res.status(200).json({message:`Product ${id} has been updated successfully!`})

        } catch (error) {
            next(error)
        }
    }

    async remove(req:Request, res:Response, next:NextFunction) {
        try {
            const id = z
                .string()
                .transform((value)=>Number(value))
                .refine((value)=> !isNaN(value), { message: "id must be a number" }) 
                .parse(req.params.id)

                const product = await knex<ProductRepository>("products").select().where({ id }).first()

                if(!product){
                    throw new AppError("Product not found!")
                }

                await knex<ProductRepository>("products").delete().where({ id })
                return res.json()
        } catch (error) {
            next(error)
        }
    }

}

export { ProductController }