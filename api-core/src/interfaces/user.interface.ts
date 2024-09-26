export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UserRepository = {
  create(user: UserCreate): Promise<void>;
  readAll(): Promise<User[]>;
};
