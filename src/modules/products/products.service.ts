import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, productDocument } from './entities/product.entity';
import { Model } from 'mongoose';
import { CloudinaryResponse } from 'src/common/cloudinary/cloudinary/cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<productDocument>,
  ) {}

  public async create(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ) {
    if (file) {
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          async (error, result) => {
            if (error) return reject(error);
            resolve(result);
            const review = await this.productModel.create({
              ...createProductDto,
              image: result.url,
            });
            await review.save();
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }

    const review = await this.productModel.create({
      ...createProductDto,
    });
    await review.save();
    return review;
  }

  async findAll() {
    const users = await this.productModel
      .find({})
      .sort({ created_at: -1 })
      .select([
        'product_name',
        'company_name',
        'category',
        'price',
        'indication',
        'pharmacology',
        'image',
      ]);
    return users;
  }

  async findOne(id: string) {
    const user = await this.productModel
      .findOne({ _id: id })
      .select([
        'product_name',
        'company_name',
        'category',
        'price',
        'indication',
        'pharmacology',
        'image',
      ]);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<productDocument> {
    const user = await this.productModel.findOne({ _id: id }).select([
      'product_name',
      'company_name',
      'category',
      'price',
      'indication',
      'pharmacology',
      // 'image',
    ]);

    if (!user) throw new BadRequestException('Invalid ID');

    Object.keys(updateProductDto).forEach((key) => {
      user[key] = updateProductDto[key];
    });

    await user.save();

    return user;
  }

  async remove(id: string) {
    const user = await this.productModel
      .findOneAndRemove({ _id: id })
      .select(['_id']);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }
}
