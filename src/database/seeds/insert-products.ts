import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("products").del();

    // Inserts seed entries
    await knex("products").insert([
    { name: "Produto 1", price: 10.99 },
    { name: "Produto 2", price: 20.50 },
    { name: "Produto 3", price: 15.75 },
    { name: "Produto 4", price: 8.99 },
    { name: "Produto 5", price: 12.00 },
    { name: "Produto 6", price: 30.20 },
    { name: "Produto 7", price: 25.10 },
    { name: "Produto 8", price: 18.40 },
    { name: "Produto 9", price: 22.00 },
    { name: "Produto 10", price: 16.80 }

    ]);
};
