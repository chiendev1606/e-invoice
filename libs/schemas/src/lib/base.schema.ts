import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

export class BaseSchema {
  _id: ObjectId;

  @Virtual({
    get: (docs: any) => docs._id.toHexString(),
  })
  id: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const createSchema = <T = any>(schemaDefinition: Type<T>) => {
  const schema = SchemaFactory.createForClass(schemaDefinition);
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
  schema.set('timestamps', true);
  schema.set('versionKey', false);
  return schema;
};
