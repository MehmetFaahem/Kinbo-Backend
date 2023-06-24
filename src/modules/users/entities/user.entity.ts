import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type userDocument = User & Document;
export type OrderDocument = Orders & Document;

@Schema()
export class CartedProducts {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  company: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  price: string;

  @Prop({ type: Number })
  quantity: number;
}
const CartedProductsSchema = SchemaFactory.createForClass(CartedProducts);

@Schema()
export class CustomOrders {
  @Prop({ type: String })
  product_name: string;

  @Prop({ type: String })
  company_name: string;

  @Prop({ type: String })
  power: string;

  @Prop({ type: String })
  additional: string;
}
const CustomOrdersSchema = SchemaFactory.createForClass(CustomOrders);

@Schema()
export class Orders {
  @Prop({ type: String, default: Date.now() })
  order_id: string;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: String })
  delivery_method: string;

  @Prop({ type: String })
  order_date: string;

  @Prop({
    required: [false, 'ordered should not be empty'],
    type: [CartedProductsSchema],
    default: [],
  })
  ordered: CartedProducts[];

  @Prop({ type: Boolean, default: false })
  delivered: boolean;
}
const OrdersSchema = SchemaFactory.createForClass(Orders);

@Schema()
export class UserPrescription {
  @Prop({ type: String })
  image: string;
}
const UserPrescriptionSchema = SchemaFactory.createForClass(UserPrescription);

@Schema()
export class FavouredProducts {
  @Prop({ type: String })
  product_name: string;

  @Prop({ type: String })
  company_name: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  price: string;

  @Prop({ type: String })
  indication: string;

  @Prop({ type: String })
  pharmacology: string;
}
const FavouredProductsSchema = SchemaFactory.createForClass(FavouredProducts);

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'users',
})
export class User {
  @Prop({
    required: [true, 'name must be filled'],
    type: String,
    trim: true,
  })
  name: string;

  @Prop({
    required: [true, 'phone must be filled'],
    type: String,
    trim: true,
  })
  phone: string;

  @Prop({
    required: [true, 'email must be filled'],
    type: String,
    trim: true,
  })
  email: string;

  @Prop({
    required: [true, 'password must be filled'],
    type: String,
    trim: true,
  })
  password: string;

  @Prop({
    required: [false, 'address must be filled'],
    type: String,
    trim: true,
    default: 'Address',
  })
  address: string;

  @Prop({
    required: [false, 'dateofbirth must be filled'],
    type: String,
    trim: true,
    default: 'Date Of Birth',
  })
  dateofbirth: string;

  @Prop({
    required: [false, 'gender must be filled'],
    type: String,
    trim: true,
    default: 'Gender',
  })
  gender: string;

  @Prop({
    required: [false, 'projects should not be empty'],
    type: [CartedProductsSchema],
    default: [],
  })
  carted: CartedProducts[];

  @Prop({
    required: [false, 'projects should not be empty'],
    type: [FavouredProductsSchema],
    default: [],
  })
  favourites: FavouredProducts[];

  @Prop({
    required: [false, 'prescriptions should not be empty'],
    type: [UserPrescriptionSchema],
    default: [],
  })
  prescriptions: UserPrescription[];

  @Prop({
    required: [false, 'customs should not be empty'],
    type: [CustomOrdersSchema],
    default: [],
  })
  customs: CustomOrders[];

  @Prop({
    required: [false, 'orders should not be empty'],
    type: [OrdersSchema],
    default: [],
  })
  orders: Orders[];
}

export const UserSchema = SchemaFactory.createForClass(User);
