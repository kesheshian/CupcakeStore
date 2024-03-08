import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { CupcakesService } from './cupcakes.service';
import { Cupcake } from './cupcake.model';
import { validate as validateUuid} from 'uuid';

@Controller('cupcake')
export class CupcakesController {
  constructor(private readonly cupcakesService: CupcakesService) {}

  @Post()
  @HttpCode(201)
  addCupcake(@Body() cupcake: Cupcake): Promise<Cupcake> {
    if (Object.keys(cupcake).length === 0) {
      throw new HttpException('Request should contain at least one Cupcake property', HttpStatus.BAD_REQUEST);
    }

    // Validate the price property if present
    if (cupcake.price != null && isNaN(cupcake.price) || cupcake.price < 0) {
        throw new HttpException('Price should be a a non-negative number', HttpStatus.BAD_REQUEST);
    }

    return this.cupcakesService.create(cupcake);
  }

  @Get()
  @HttpCode(200)
  listCupcakes(): Promise<Cupcake[]> {
    return this.cupcakesService.findAll();
  }

  @Get(':cupcakeId')
  @HttpCode(200)
  async getCupcakeById(@Param('cupcakeId') cupcakeId: string): Promise<Cupcake> {
    if (!cupcakeId || !validateUuid(cupcakeId)) {
      throw new HttpException('Invalid cupcake ID', HttpStatus.BAD_REQUEST);
    }
    
    const result = await this.cupcakesService.getById(cupcakeId);
    
    if (result == null) {
      throw new HttpException('Cupcake not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Delete(':cupcakeId')
  @HttpCode(204)
  async deleteCupcake(@Param('cupcakeId') cupcakeId: string): Promise<void> {
    if (!cupcakeId || !validateUuid(cupcakeId)) {
      throw new HttpException('Invalid cupcake ID', HttpStatus.BAD_REQUEST);
    }

    const cupcake = await this.cupcakesService.getById(cupcakeId);
    
    if (cupcake == null) {
      throw new HttpException('Cupcake not found', HttpStatus.NOT_FOUND);
    }

    await this.cupcakesService.remove(cupcakeId);
  }

  @Put(':cupcakeId')
  @HttpCode(200)
  async updateCupcake(@Param('cupcakeId') cupcakeId: string, @Body() cupcakeData: Cupcake): Promise<Cupcake> {
    if (!cupcakeId || !validateUuid(cupcakeId)) {
      throw new HttpException('Invalid cupcake ID', HttpStatus.BAD_REQUEST);
    }

    const cupcake = await this.cupcakesService.getById(cupcakeId);
    
    if (cupcake == null) {
      throw new HttpException('Cupcake not found', HttpStatus.NOT_FOUND);
    }

    // Validate the price property if present
    if (cupcakeData.price != null && isNaN(cupcakeData.price) || cupcakeData.price < 0) {
      throw new HttpException('Price should be a non-negative number', HttpStatus.BAD_REQUEST);
    }

    return this.cupcakesService.update(cupcakeId, cupcakeData);
  }
}
