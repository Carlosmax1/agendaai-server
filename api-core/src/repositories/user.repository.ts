import { UserRepository, UserCreate, User } from '@/interfaces/user.interface';
import { db } from '@/db/prisma';
import bcrypt from 'bcrypt';

export class UserRepositoryPrisma implements UserRepository {
  async create(user: UserCreate): Promise<void> {
    try {
      const userFind = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (userFind) throw new Error('User already exists');
      const hashPassword = await bcrypt.hash(user.password, 10);
      await db.user.create({
        data: {
          ...user,
          password: hashPassword,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async readAll(): Promise<User[]> {
    try {
      const users = await db.user.findMany();
      console.log(users);
      return users;
    } catch (error) {
      throw error;
    }
  }
}
