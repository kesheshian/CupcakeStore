import { Module, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { CupcakesModule } from './cupcakes/cupcakes.module';
import { ScyllaDbModule } from './scylladb/scylladb.module';

@Module({imports: [CupcakesModule, ScyllaDbModule]})
export class AppModule {}
