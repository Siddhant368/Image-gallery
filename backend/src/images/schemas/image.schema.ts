import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({
  timestamps: true,
})
export class Image {
  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
  })
  imageUrl: string;

  @Prop({
    required: true,
    trim: true,
  })
  publicId: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

// Index for efficient sorting by newest/oldest
ImageSchema.index({ createdAt: -1 });

// Text index on title could be added here for full-text search, but 
// since we are using regex for partial matching, a regular index is less useful.
// If you switch to $text search in the future, you can uncomment this:
// ImageSchema.index({ title: 'text' });