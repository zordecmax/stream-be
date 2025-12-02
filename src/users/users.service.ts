import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

/**
 * Service layer - Contains business logic
 * Services are responsible for:
 * - Business logic implementation
 * - Data manipulation
 * - Database interactions
 * - Communication with external services
 */
@Injectable()
export class UsersService {
  // In-memory storage for demo purposes
  // In production, you'd use a database (TypeORM, Prisma, etc.)
  private users: User[] = [];
  private idCounter = 1;

  /**
   * Create a new user
   */
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.idCounter++,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Get all users
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Get a single user by ID
   */
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update a user
   */
  update(id: number, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    return this.users[userIndex];
  }

  /**
   * Delete a user
   */
  remove(id: number): void {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }
}
