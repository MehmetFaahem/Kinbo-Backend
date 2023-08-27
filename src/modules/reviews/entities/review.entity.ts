import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type reviewDocument = Review & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'default_image',
})
export class Review {
  @Prop({
    required: [true, 'image must be provided'],
    type: String,
    trim: true,
  })
  image: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
