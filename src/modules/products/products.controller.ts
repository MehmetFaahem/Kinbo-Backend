import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create Product' })
  @Post('/')
  @ApiBody({
    type: CreateProductDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    const user = await this.productsService.create(createProductDto);
    return {
      message: 'Product Created Successfully',
      data: user,
    };
  }

  @Get('/')
  async findAll() {
    const users = await this.productsService.findAll();
    return {
      message: 'Product Fetched Successfully',
      data: users,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.productsService.findOne(id);
    return {
      message: 'Product Fetched Successfully',
      data: user,
    };
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const user = await this.productsService.update(id, updateProductDto);
    return {
      message: 'Product Updated Successfully',
      data: user,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const user = await this.productsService.remove(id);
    return {
      message: 'Product Removed Successfully',
      data: user,
    };
  }
}
