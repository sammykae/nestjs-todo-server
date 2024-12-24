import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoData } from './dtos/create-todo.dto';
import { UpdateTodoData } from './dtos/update-todo.dto';
import { ObjectIdValidationPipe } from 'src/pipes/check-objectId.pipe';
import { ValidateQueryPipe } from 'src/pipes/check-query.pipe';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UsePipes(ValidateQueryPipe)
  findAll(@Query(ValidateQueryPipe) query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query;
    return this.todoService.findAll(page, limit);
  }

  @Post()
  createTodo(@Body() todoData: CreateTodoData) {
    return this.todoService.createTodo(todoData);
  }
  @Put(':id')
  updateTodo(
    @Body() todoData: UpdateTodoData,
    @Param('id', ObjectIdValidationPipe) id: string,
  ) {
    return this.todoService.updateTodo(id, todoData);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.todoService.deleteTodo(id);
  }

  @Patch(':id')
  updateTodoStatus(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.todoService.updateTodoStatus(id);
  }
}
