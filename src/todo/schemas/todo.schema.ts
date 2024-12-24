import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Todo {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  desc: string;

  @Prop({ trim: true })
  category: string;

  @Prop({ type: Boolean, default: false })
  completed: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
