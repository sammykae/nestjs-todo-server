import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any) {
    // Check if the value is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Todo not found');
    }

    // Return the value if valid (or you can process the value further if needed)
    return value;
  }
}
