import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateCartedProdutsDto } from '../dto/create-user-carted.dto';
import { CreateFavouriteDto } from '../dto/create-user-favourite.dto';
import { CreateUserPrescriptionDto } from '../dto/create-user-prescription.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from 'src/common/decorator/custom-validation.decorator';
import { CreateCustomsDto } from '../dto/create-user-customs.dto';
import { CreateOrdersDto } from '../dto/create-user-orders.dto';
import { UpdateOrderDto } from '../dto/update-user-orders.dto';
import { UpdatePresOrderDto } from '../dto/update-user-preorders.dto';

@ApiTags('User')
@ApiResponse({
  status: 201,
  description: 'User has been successfully created.',
})
@ApiResponse({
  status: 404,
  description: 'Something Went Wrong',
})
@Controller('users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create User' })
  @Post('/')
  @ApiBody({
    type: CreateUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User Created Successfully',
      data: user,
    };
  }

  @Post('/prescriptions')
  @ApiOperation({ summary: 'Create a Service Project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateUserPrescriptionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Service Project has been successfully created.',
  })
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 20000000 } }))
  async createServiceProject(
    @UploadedFile() image: Express.Multer.File,
    @Body() createDto: CreateUserPrescriptionDto,
  ) {
    const ourService = await this.usersService.createPrescription(
      image,
      createDto,
    );
    return {
      message: 'Service project created successfully.',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginUserDto,
  })
  @Post('/login')
  async loginUser(@Body() dto: LoginUserDto) {
    const data = await this.usersService.loginUser(dto);
    return {
      message: 'User logged successfully',
      data: data,
    };
  }

  @ApiOperation({ summary: 'Add Carted Produts' })
  @ApiBody({
    type: CreateCartedProdutsDto,
  })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully added.',
  })
  @Post('/carted')
  async addCartedProducts(@Body() createDto: CreateCartedProdutsDto) {
    const ourService = await this.usersService.addCartedProducts(createDto);
    return {
      message: 'carted successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Add Customs' })
  @ApiBody({
    type: CreateCustomsDto,
  })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully added.',
  })
  @Post('/customs')
  async addCustoms(@Body() createDto: CreateCustomsDto) {
    const ourService = await this.usersService.addCustoms(createDto);
    return {
      message: 'customed successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Add Orders' })
  @ApiBody({
    type: CreateOrdersDto,
  })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully added.',
  })
  @Post('/orders')
  async addOrders(@Body() createDto: CreateOrdersDto) {
    const ourService = await this.usersService.addOrders(createDto);
    return {
      message: 'ordered successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Remove Customed Produts' })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully removed',
  })
  @Delete('/customs/:name')
  async removeCustoms(@Param('name') name: string) {
    const ourService = await this.usersService.removeCustoms(name);
    return {
      message: 'removed successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Remove ordered Produts' })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully removed',
  })
  @Delete('/orders/:id')
  async removeOrders(@Param('id') id: string) {
    const ourService = await this.usersService.removeOrders(id);
    return {
      message: 'removed successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Remove ordered Produts' })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully removed',
  })
  @Delete('/prescrip/:id')
  async removePresOrders(@Param('id') id: string) {
    const ourService = await this.usersService.removePresOrders(id);
    return {
      message: 'removed successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Add Favourite Produts' })
  @ApiBody({
    type: CreateFavouriteDto,
  })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully added.',
  })
  @Post('/favour')
  async addFavouriteProducts(@Body() createDto: CreateFavouriteDto) {
    const ourService = await this.usersService.addFavouriteProducts(createDto);
    return {
      message: 'favoured successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Remove Carted Produts' })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully removed',
  })
  @Delete('/carted/:name')
  async removeCartedProducts(@Param('name') name: string) {
    const ourService = await this.usersService.removeCartedProducts(name);
    return {
      message: 'removed successfully',
      data: ourService,
    };
  }

  @ApiOperation({ summary: 'Remove Favoured Produts' })
  @ApiResponse({
    status: 201,
    description: 'product has been successfully removed',
  })
  @Delete('/favour/:name')
  async removeFavouriteProducts(@Param('name') name: string) {
    const ourService = await this.usersService.removeFavouriteProducts(name);
    return {
      message: 'removed successfully',
      data: ourService,
    };
  }

  @Get('/')
  async findAll() {
    const users = await this.usersService.findAllByAdmin();
    return {
      message: 'Users Fetched Successfully',
      data: users,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOneByAdmin(id);
    return {
      message: 'Users Fetched Successfully',
      data: user,
    };
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateByAdmin(id, updateUserDto);
    return {
      message: 'User Updated Successfully',
      data: user,
    };
  }

  @Put('/orders/:id')
  async deliver(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const user = await this.usersService.DeliverOrders(id, updateOrderDto);
    return {
      message: 'Delivered Successfully',
      data: user,
    };
  }

  @Put('/prescrip/:id')
  async deliverpres(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdatePresOrderDto,
  ) {
    const user = await this.usersService.DeliverPresOrders(id, updateOrderDto);
    return {
      message: 'Delivered Successfully',
      data: user,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.removeByAdmin(id);
    return {
      message: 'User Removed Successfully',
      data: user,
    };
  }
}
