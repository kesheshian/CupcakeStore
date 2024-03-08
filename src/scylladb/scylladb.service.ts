import { Injectable } from '@nestjs/common';
import { Client, types } from 'cassandra-driver';
import { scyllaClientOptions, scyllaKeyspace } from '../../config';

@Injectable()
export class ScyllaDbService {
    private client: Client;

    /** Connect to the ScyllaDB cluster */
    async connect(): Promise<void> {
      this.client = new Client(scyllaClientOptions);
      await this.client.connect();
      await this.createSchema();
  
      // Optionally, reconnect with the keyspace specified after creation
      this.client = new Client({
        ...scyllaClientOptions,
        keyspace: scyllaKeyspace,
      });

      console.info('Connecting to ScyllaDB and schema initializing...');

      await this.client.connect(); 
    }

    /** Create the keyspace and table if they don't exist */
    async createSchema(): Promise<types.ResultSet> {
      await this.client.execute(`CREATE KEYSPACE IF NOT EXISTS cupcake_store WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1}`);
  
      // Re-initialize client to use the newly created keyspace for further operations
      this.client = new Client({
        ...scyllaClientOptions,
        keyspace: scyllaKeyspace,
      });
  
      await this.client.connect();
  
      // Continue with table creation
      return this.client.execute(
        `CREATE TABLE IF NOT EXISTS cupcake_store.cupcakes (
            id UUID PRIMARY KEY,
            name TEXT,
            description TEXT,
            price DECIMAL,
            ingredients LIST<TEXT>
         )`
      );
    }
    
    /** Execute a query on the ScyllaDB cluster */
    execute(query: string, params: any[] = [], options: object = {}): Promise<types.ResultSet> {
      return this.client.execute(query, params, options);
    }

    /** Closes the dababase connection */
    close(): Promise<void> {
      return this.client.shutdown();
    }
}
