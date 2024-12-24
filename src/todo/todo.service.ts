import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from 'src/todo/schemas/todo.schema';
import { CreateTodoData } from './dtos/create-todo.dto';
import { UpdateTodoData } from './dtos/update-todo.dto';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  private successResponse(message: string, data?: any) {
    return { message, data };
  }

  private errorResponse(message: string, status: HttpStatus): never {
    throw new HttpException(message, status);
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const todos = await this.todoModel
        .find()
        .skip(skip)
        .limit(limit)
        .select('-updatedAt -createdAt');
      const count = await this.todoModel.countDocuments();
      const isFirstPage = page === 1;
      const isLastPage = skip + todos.length >= count;

      return this.successResponse('Todos retrieved successfully.', {
        data: todos,
        meta: {
          total: count,
          page,
          limit,
          isFirstPage,
          isLastPage,
        },
      });
    } catch (error) {
      this.logger.error('Error retrieving todos', error.stack);
      this.errorResponse(
        'Error retrieving todos: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTodo(todoData: CreateTodoData) {
    try {
      const createdTodo = await this.todoModel.create(todoData);

      if (!createdTodo) {
        this.errorResponse(
          'Failed to create todo',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return this.successResponse('Todo successfully created.', createdTodo);
    } catch (error) {
      this.logger.error('Error creating todo', error.stack);
      this.errorResponse(
        'Error creating todo: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTodo(id: string, todoData: UpdateTodoData) {
    try {
      const updatedTodo = await this.todoModel.findByIdAndUpdate(id, todoData, {
        new: true,
      });

      if (!updatedTodo) {
        this.errorResponse(
          'Todo not found or update failed',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.successResponse('Todo successfully updated.', updatedTodo);
    } catch (error) {
      this.logger.error('Error updating todo', error.stack);
      this.errorResponse(
        'Error updating todo: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTodoStatus(id: string) {
    try {
      const updatedTodo = await this.todoModel.findByIdAndUpdate(
        id,
        [
          {
            $set: {
              completed: { $not: '$completed' },
            },
          },
        ],
        { new: true },
      );

      if (!updatedTodo) {
        this.errorResponse(
          'Todo not found or status update failed',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.successResponse(
        'Todo status successfully updated.',
        updatedTodo,
      );
    } catch (error) {
      this.logger.error('Error updating todo status', error.stack);
      this.errorResponse(
        'Error updating todo status: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTodo(id: string) {
    try {
      const deletedTodo = await this.todoModel.findByIdAndDelete(id);

      if (!deletedTodo) {
        this.errorResponse(
          'Todo not found or deletion failed',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.successResponse('Todo successfully deleted.');
    } catch (error) {
      this.logger.error('Error deleting todo', error.stack);
      this.errorResponse(
        'Error deleting todo: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
