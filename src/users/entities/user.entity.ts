/**
 * Entity representing a User in the database
 * Entities define the structure of your data models
 */
export class User {
  id: number;
  email: string;
  name: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}
