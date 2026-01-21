import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: [true, 'Location type is required'],
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: (v: number[]) => v.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ location: '2dsphere' });

export default mongoose.model<IEvent>('Event', EventSchema);
