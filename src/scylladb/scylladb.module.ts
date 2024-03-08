import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ScyllaDbService } from './scylladb.service';

@Global()
@Module({
  providers: [ScyllaDbService],
  exports: [ScyllaDbService],
})
export class ScyllaDbModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly scyllaDbService: ScyllaDbService) {}

  async onModuleInit() {
    return await this.scyllaDbService.connect();
  }

  async onModuleDestroy() {
    return await this.scyllaDbService.close();
  }
}