/**
 * DTO (Data Transfer Object) for creating a new user
 * DTOs define the shape of data for API requests/responses
 */
export class CreateUserDto {
  readonly email: string;
  readonly name: string;
  readonly age?: number;
}
