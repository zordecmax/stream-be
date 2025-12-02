/**
 * DTO for updating an existing user
 * All fields are optional since partial updates are allowed
 */
export class UpdateUserDto {
  readonly email?: string;
  readonly name?: string;
  readonly age?: number;
}
