import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateQueryPipe implements PipeTransform {
  transform(value: any) {
    const { page, limit } = value;

    if (page !== undefined) {
      const parsedPage = parseInt(page, 10);
      if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new BadRequestException('Page must be a positive integer');
      }
      value.page = parsedPage;
    }

    if (limit !== undefined) {
      const parsedLimit = parseInt(limit, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new BadRequestException('Limit must be a positive integer');
      }
      value.limit = parsedLimit;
    }

    return value;
  }
}
