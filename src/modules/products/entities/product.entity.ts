import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BinaryLike } from 'crypto';

export type productDocument = Product & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'products',
})
export class Product {
  @Prop({
    required: [true, 'product name must be filled'],
    type: String,
    trim: true,
  })
  product_name: string;

  @Prop({
    required: [true, 'company name must be filled'],
    type: String,
    trim: true,
  })
  company_name: string;

  @Prop({
    required: [true, 'category must be filled'],
    type: String,
    trim: true,
  })
  category: string;

  @Prop({
    required: [true, 'price must be filled'],
    type: Number,
    trim: true,
  })
  price: number;

  @Prop({
    required: [true, 'indication must be filled'],
    type: String,
    trim: true,
  })
  indication: string;

  @Prop({
    required: [false, 'pharmacology must be filled'],
    type: String,
    trim: true,
  })
  pharmacology: string;

  @Prop({
    required: [false, 'image must be filled'],
    type: String,
  })
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
