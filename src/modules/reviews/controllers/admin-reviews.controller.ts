import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ReviewsService } from '../reviews.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('default')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('/upload')
  @ApiBody({ type: CreateReviewDto })
  async create(@Body() createReviewDto: CreateReviewDto) {
    const review = await this.reviewsService.create(createReviewDto);
    return {
      message: 'Review Created Successfully',
      data: review,
    };
  }

  @Get('/')
  async findAll() {
    const review = await this.reviewsService.findAllByAdmin();
    return {
      message: 'Review Fetched Successfully',
      data: review,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOneByAdmin(id);
    return {
      message: 'Review Fetched Successfully',
      data: review,
    };
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.updateOneByAdmin(
      id,
      updateReviewDto,
    );
    return {
      message: 'Review Updated Successfully',
      data: review,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const review = await this.reviewsService.removeByAdmin(id);
    return {
      message: 'Review Deleted Successfully',
      data: review,
    };
  }
}
