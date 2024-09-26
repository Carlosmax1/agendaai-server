import { User, UserCreate } from '@/interfaces/user.interface';
import { UserRepositoryPrisma } from '@/repositories/user.repository';

export class UserUseCase {
  private userRepository: UserRepositoryPrisma;

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }

  async create(user: UserCreate): Promise<void> {
    try {
      await this.userRepository.create(user);
    } catch (error) {
      throw error;
    }
  }

  async readAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.readAll();
      return users;
    } catch (error) {
      throw error;
    }
  }
}
