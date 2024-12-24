import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoData } from './create-todo.dto';

export class UpdateTodoData extends PartialType(CreateTodoData) {}
