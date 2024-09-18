import { Login } from '@/interfaces/login.interface';
import { LoginRepositoryPrisma } from '@/repositories/login.repository';

export class LoginUseCase {
  private loginRepository: LoginRepositoryPrisma;
  constructor() {
    this.loginRepository = new LoginRepositoryPrisma();
  }

  async login(login: Login) {
    const response = await this.loginRepository.login(login);
    return response;
  }
}
