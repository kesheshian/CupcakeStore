import { Module } from '@nestjs/common';
import { CupcakesService } from './cupcakes.service';
import { CupcakesController } from './cupcakes.controller';

@Module({
  providers: [CupcakesService],
  controllers: [CupcakesController]
})
export class CupcakesModule {}
