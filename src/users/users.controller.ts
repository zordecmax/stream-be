import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * Controller layer - Handles HTTP requests
 * Controllers are responsible for:
 * - Receiving HTTP requests
 * - Validating input (with DTOs)
 * - Calling appropriate service methods
 * - Returning HTTP responses
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Create a new user
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Get all users
   */
  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Get a specific user by ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.usersService.findOne(id);
  }

  /**
   * PUT /users/:id
   * Update a user
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): User {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Delete a user
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    return this.usersService.remove(id);
  }
}
