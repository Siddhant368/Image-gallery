import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateImageDto } from './dto/create-image.dto.js';
import { UpdateImageDto } from './dto/update-image.dto.js';
import { QueryImageDto } from './dto/query-image.dto.js';
import { Image, ImageDocument } from './schemas/image.schema.js';
import {
  CloudinaryService,
  UploadFile,
} from '../cloudinary/cloudinary.service.js';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createImageDto: CreateImageDto, file: UploadFile) {
    let result;
    try {
      result = await this.cloudinaryService.uploadImage(file);
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException('Failed to upload image to cloud storage');
    }

    try {
      const image = new this.imageModel({
        title: createImageDto.title,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });

      return await image.save();
    } catch (error) {
      // Rollback: if MongoDB save fails, delete from Cloudinary
      console.error('MongoDB save error, rolling back Cloudinary upload:', error);
      try {
        await this.cloudinaryService.deleteImage(result.public_id);
      } catch (rollbackError) {
        console.error('CRITICAL: Failed to rollback Cloudinary image:', rollbackError);
      }
      throw new InternalServerErrorException('Failed to save image record to database');
    }
  }

  async findAll(query: QueryImageDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const sortOrder = query.sort === 'oldest' ? 1 : -1;
    const filter: any = {};

    if (query.search) {
      // Escape regex to prevent injection
      const escapedSearch = query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      filter.title = { $regex: escapedSearch, $options: 'i' };
    }

    const [data, total] = await Promise.all([
      this.imageModel
        .find(filter)
        .select('-__v') // Clean response
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.imageModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid Image ID format');
    }

    const image = await this.imageModel.findById(id).lean().exec();
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid Image ID format');
    }

    const updatedImage = await this.imageModel
      .findByIdAndUpdate(
        id,
        { title: updateImageDto.title },
        { new: true, runValidators: true }
      )
      .exec();

    if (!updatedImage) {
      throw new NotFoundException('Image not found');
    }
    return updatedImage;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid Image ID format');
    }

    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Step 1: Delete from Cloudinary
    try {
      await this.cloudinaryService.deleteImage(image.publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new InternalServerErrorException('Failed to delete image from cloud storage');
    }

    // Step 2: Delete from MongoDB
    try {
      await this.imageModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('MongoDB delete error:', error);
      throw new InternalServerErrorException('Failed to delete image record from database');
    }

    return { message: 'Image deleted successfully' };
  }
}