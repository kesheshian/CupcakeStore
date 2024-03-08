import { ClientOptions } from 'cassandra-driver';

export const scyllaClientOptions: ClientOptions = {
    contactPoints: [process.env.SCYLLADB_HOST || 'localhost'],
    localDataCenter: 'datacenter1',
};

export const scyllaKeyspace = process.env.SCYLLADB_KEYSPACE || 'cupcake_store';