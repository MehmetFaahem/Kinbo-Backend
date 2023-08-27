import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, reviewDocument } from './entities/review.entity';
import { Model } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private ReviewModel: Model<reviewDocument>,
  ) {}
  public async create(createReviewDto: CreateReviewDto) {
    const review = await this.ReviewModel.create({ ...createReviewDto });
    await review.save();
    return review;
  }

  async findAllByAdmin() {
    const review = await this.ReviewModel.find({})
      .sort({ created_at: -1 })
      .select(['image']);
    return review;
  }

  async findAllByPublic() {
    const review = await this.ReviewModel.find({})
      .sort({ created_at: -1 })
      .select(['image']);
    return review;
  }

  async findOneByAdmin(id: string) {
    const review = await this.ReviewModel.findOne({ _id: id })
      .sort({ created_at: -1 })
      .select(['image']);
    if (!review) throw new BadRequestException('Invalid ID');
    return review;
  }

  async findOneByPublic(id: string) {
    const review = await this.ReviewModel.findOne({ _id: id })
      .sort({ created_at: -1 })
      .select(['image']);
    if (!review) throw new BadRequestException('Invalid ID');
    return review;
  }

  async updateOneByAdmin(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<reviewDocument> {
    const review = await this.ReviewModel.findOne({ _id: id })
      .sort({ created_at: -1 })
      .select(['image']);

    if (!review) throw new BadRequestException('Invalid ID');
    Object.keys(updateReviewDto).forEach((key) => {
      review[key] = updateReviewDto[key];
    });

    await review.save();
    return review;
  }

  async removeByAdmin(id: string) {
    const review = await this.ReviewModel.findOneAndRemove({ _id: id }).select([
      '_id',
    ]);

    if (!review) throw new BadRequestException('Invalid ID');
    return review;
  }
}
