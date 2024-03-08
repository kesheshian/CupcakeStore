import { Injectable } from '@nestjs/common';
import { ScyllaDbService } from '../scylladb/scylladb.service';
import { Cupcake } from './cupcake.model';
import { types } from 'cassandra-driver';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CupcakesService {
    constructor(private scyllaDbService: ScyllaDbService) {}

    async findAll(): Promise<Cupcake[]> {
        const query = 'SELECT * FROM cupcake_store.cupcakes';
        const result = await this.scyllaDbService.execute(query);

        return this.toCupcakeList(result.rows);
    }

    async getById(cupcakeId: string): Promise<Cupcake|null> {
        const query = 'SELECT * FROM cupcake_store.cupcakes WHERE id = ?';
        const result = await this.scyllaDbService.execute(query, [cupcakeId], { prepare: true });
        
        if (result.rowLength === 0) return null;

        return this.toCupcake(result.first());
    }

    async create(cupcake: Cupcake): Promise<Cupcake> {
        cupcake.id = uuidv4();
        const query = 'INSERT INTO cupcake_store.cupcakes (id, name, description, price, ingredients) VALUES (?, ?, ?, ?, ?)';
        const result = await this.scyllaDbService.execute(query, [
            cupcake.id, 
            cupcake.name, 
            cupcake.description, 
            types.BigDecimal.fromNumber(cupcake.price), 
            cupcake.ingredients
        ]);

        return cupcake;
    }

    async remove(cupcakeId: string): Promise<void> {
        const query = 'DELETE FROM cupcake_store.cupcakes WHERE id = ?';
        await this.scyllaDbService.execute(query, [cupcakeId], { prepare: true });
    }
      
    async update(cupcakeId: string, cupcakeData: Cupcake): Promise<Cupcake> {
        const query = 'UPDATE cupcake_store.cupcakes SET name = ?, description = ?, price = ?, ingredients = ? WHERE id = ?';
        await this.scyllaDbService.execute(query, [
            cupcakeData.name, 
            cupcakeData.description, 
            types.BigDecimal.fromNumber(cupcakeData.price), 
            cupcakeData.ingredients,
            cupcakeId
        ], { prepare: true });
        
        return { ...cupcakeData, id: cupcakeId };
    }

    private toCupcake(row: types.Row): Cupcake {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price.toNumber(),
            ingredients: row.ingredients,
        };
    }
    
    private toCupcakeList(rows: types.Row[]): Cupcake[] {
        return rows.map(row => this.toCupcake(row));
    }
}
