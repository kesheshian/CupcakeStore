import { Client } from 'cassandra-driver';
import { scyllaClientOptions, scyllaKeyspace } from '../config';

async function cleanupScyllaDB(): Promise<void> {
  let client = new Client(scyllaClientOptions);
  await client.connect();
  const result = await client.execute(`SELECT * FROM system_schema.keyspaces WHERE keyspace_name = '${scyllaKeyspace}'`);

  // If the keyspace doesn't exist, there's nothing to clean up
  if (result.rows.length === 0) return;

  client = new Client({
    ...scyllaClientOptions,
    keyspace: scyllaKeyspace,
  });

  await client.execute(`TRUNCATE ${scyllaKeyspace}.cupcakes`);
  await client.shutdown();
}

module.exports = async (): Promise<void> => {
  await cleanupScyllaDB();
};
