import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JWTService } from 'src/common/services/jwt.service';
import { CreateCartedProdutsDto } from './dto/create-user-carted.dto';
import { CreateFavouriteDto } from './dto/create-user-favourite.dto';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../../common/cloudinary/cloudinary/cloudinary-response';
import { CreateUserPrescriptionDto } from './dto/create-user-prescription.dto';
import { CreateCustomsDto } from './dto/create-user-customs.dto';
import { CreateOrdersDto } from './dto/create-user-orders.dto';
import { UpdateOrderDto } from './dto/update-user-orders.dto';
import { UpdatePresOrderDto } from './dto/update-user-preorders.dto';
const streamifier = require('streamifier');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<userDocument>,
    private jwtService: JWTService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(createUserDto);
    newUser.password = await this.hashPassword(createUserDto.password);
    await newUser.save();
    return newUser;
  }

  public async createPrescription(
    file: Express.Multer.File,
    createDto: CreateUserPrescriptionDto,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        async (error, result) => {
          if (error) return reject(error);
          resolve(result);
          const exists = await this.userModel
            .findOne({
              _id: createDto.user_id,
            })
            .select('_id');
          if (!exists) throw new BadRequestException('Invalid service id.');
          await this.userModel.updateOne(
            { _id: exists._id },
            {
              $addToSet: {
                prescriptions: {
                  user_id: exists._id,
                  image: result.url,
                  delivered: false,
                  order_date: createDto.order_date,
                  order_id: Date.now(),
                },
              },
            },
          );
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  public async removePresOrders(id: string) {
    const exists = await this.userModel
      .findOne({
        'prescriptions.order_id': id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $pull: {
          prescriptions: {
            order_id: id,
          },
        },
      },
    );
    return exists;
  }

  public async addCartedProducts(createDto: CreateCartedProdutsDto) {
    const exists = await this.userModel
      .findOne({
        _id: createDto.user_id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $addToSet: {
          carted: {
            name: createDto.name,
            company: createDto.company,
            category: createDto.category,
            price: createDto.price,
            quantity: createDto.quantity,
          },
        },
      },
    );
    return exists;
  }

  public async addCustoms(createDto: CreateCustomsDto) {
    const exists = await this.userModel
      .findOne({
        _id: createDto.user_id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $addToSet: {
          customs: {
            product_name: createDto.product_name,
            company_name: createDto.company_name,
            power: createDto.power,
            additional: createDto.additional,
          },
        },
      },
    );
    return exists;
  }

  public async addOrders(createDto: CreateOrdersDto) {
    const exists = await this.userModel
      .findOne({
        _id: createDto.user_id,
      })
      .select('_id');
    const existso = await this.userModel
      .findOne({
        _id: createDto.user_id,
      })
      .select('carted');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $set: {
          carted: [],
        },
        $addToSet: {
          orders: {
            total: createDto.total,
            delivery_method: createDto.delivery_method,
            order_date: createDto.order_date,
            ordered: existso.carted,
            delivered: createDto.delivered,
            order_id: createDto.order_id,
          },
        },
      },
    );
    return exists;
  }

  public async removeOrders(id: string) {
    const exists = await this.userModel
      .findOne({
        'orders.order_id': id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $pull: {
          orders: {
            order_id: id,
          },
        },
      },
    );
    return exists;
  }

  async updateByAdmin(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<userDocument> {
    const user = await this.userModel
      .findOne({ _id: id })
      .select([
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
        'discount',
      ]);

    if (!user) throw new BadRequestException('Invalid ID');

    Object.keys(updateUserDto).forEach((key) => {
      user[key] = updateUserDto[key];
    });

    await user.save();

    return user;
  }

  public async DeliverOrders(id: string, updateDto: UpdateOrderDto) {
    const exists = await this.userModel
      .findOne({
        'orders.order_id': id,
      })
      .select([
        '_id',
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
      ]);

    const ordered_products = await exists.orders.find(
      ({ order_id }) => order_id == id,
    ).ordered;

    if (!exists) throw new BadRequestException('Invalid user id.');

    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $set: {
          orders: [
            ...exists.orders.filter(({ order_id }) => order_id !== id),
            {
              order_id: Date.now(),
              ordered: ordered_products,
              total: updateDto.total,
              delivered: true,
              order_date: updateDto.order_date,
              delivery_method: updateDto.delivery_method,
            },
          ],
        },
      },
    );
    await exists.save();
    return exists;

    // Object.keys(updateDto).forEach((key) => {
    //   exists[key] = updateDto[key];
    // });

    // await exists.save();

    // return exists;
  }

  public async DeliverPresOrders(id: string, updateDto: UpdatePresOrderDto) {
    const exists = await this.userModel
      .findOne({
        'prescriptions.order_id': id,
      })
      .select([
        '_id',
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
      ]);

    if (!exists) throw new BadRequestException('Invalid user id.');

    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $set: {
          prescriptions: [
            ...exists.prescriptions.filter(({ order_id }) => order_id !== id),
            {
              order_id: updateDto.order_id,
              delivered: true,
              order_date: updateDto.order_date,
              image: updateDto.image,
            },
          ],
        },
      },
    );
    await exists.save();
    return exists;

    // Object.keys(updateDto).forEach((key) => {
    //   exists[key] = updateDto[key];
    // });

    // await exists.save();

    // return exists;
  }

  public async removeCustoms(name: string) {
    const exists = await this.userModel.findOne({
      'customs.product_name': name,
    });
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $pull: {
          customs: {
            product_name: name,
          },
        },
      },
    );
    return exists;
  }

  public async addFavouriteProducts(createDto: CreateFavouriteDto) {
    const exists = await this.userModel
      .findOne({
        _id: createDto.user_id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $addToSet: {
          favourites: {
            product_name: createDto.product_name,
            company_name: createDto.company_name,
            category: createDto.category,
            price: createDto.price,
            indication: createDto.indication,
            pharmacology: createDto.pharmacology,
          },
        },
      },
    );
    return exists;
  }

  public async removeCartedProducts(name: string) {
    const exists = await this.userModel.findOne({
      'carted.name': name,
    });
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $pull: {
          carted: {
            name: name,
          },
        },
      },
    );
    return exists;
  }

  public async removeFavouriteProducts(name: string) {
    const exists = await this.userModel.findOne({
      'favourites.product_name': name,
    });
    if (!exists) throw new BadRequestException('Invalid user id.');
    await this.userModel.updateOne(
      { _id: exists._id },
      {
        $pull: {
          favourites: {
            product_name: name,
          },
        },
      },
    );
    return exists;
  }

  public async loginUser(dto: LoginUserDto) {
    const user: User = await this.userModel.findOne({ name: dto.name });
    if (!user)
      throw new BadGatewayException('User not found with the provided email');
    const passMatch = await this.comparePassword(dto.password, user.password);
    if (!passMatch)
      throw new BadRequestException("Your password didn't matched!");
    const accessToken = await this.jwtService.genAccessToken({
      name: user.name,
      phone: user.phone,
    });
    const refreshToken = await this.jwtService.genRefreshToken(user.phone);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  private async comparePassword(
    comparePassword: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(comparePassword, hash);
  }

  async findAllByAdmin() {
    const users = await this.userModel
      .find({})
      .sort({ created_at: -1 })
      .select([
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
        'discount',
      ]);
    return users;
  }

  async findAllByPublic() {
    const users = await this.userModel
      .find({})
      .sort({ created_at: -1 })
      .select([
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
        'discount',
      ]);
    return users;
  }

  async findOneByAdmin(id: string) {
    const user = await this.userModel
      .findOne({ _id: id })
      .select([
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
        'discount',
      ]);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }

  async findOneByPublic(id: string) {
    const user = await this.userModel
      .findOne({ _id: id })
      .select([
        'name',
        'phone',
        'email',
        'password',
        'address',
        'gender',
        'dateofbirth',
        'carted',
        'favourites',
        'prescriptions',
        'customs',
        'orders',
        'discount',
      ]);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }

  // async updateByAdmin(
  //   id: string,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<userDocument> {
  //   const user = await this.userModel
  //     .findOne({ _id: id })
  //     .select([
  //       'name',
  //       'phone',
  //       'email',
  //       'password',
  //       'address',
  //       'gender',
  //       'dateofbirth',
  //       'carted',
  //       'favourites',
  //       'prescriptions',
  //       'customs',
  //       'orders',
  //     ]);

  //   if (!user) throw new BadRequestException('Invalid ID');

  //   Object.keys(updateUserDto).forEach((key) => {
  //     user[key] = updateUserDto[key];
  //   });

  //   await user.save();

  //   return user;
  // }

  async removeByAdmin(id: string) {
    const user = await this.userModel
      .findOneAndRemove({ _id: id })
      .select(['_id']);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }
}
