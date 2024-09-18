import { Login, LoginRepository, LoginResponse, LoginErrors } from '@/interfaces/login.interface';
import bcrypt from 'bcrypt';
import { db } from '@/db/prisma';
import { GenerateTokenProvider } from '@/providers/GenerateTokenProvider';
import { dayjs } from '@/lib/dayjs';

export class LoginRepositoryPrisma implements LoginRepository {
  async login(login: Login): Promise<LoginResponse | LoginErrors> {
    try {
      const user = await db.user.findUnique({
        where: {
          email: login.email,
        },
      });
      if (!user) return { error: 'invalid_credentials' };
      const isPasswordValid = await bcrypt.compare(login.password, user.password);
      if (!isPasswordValid) return { error: 'invalid_credentials' };
      const generateTokenProvider = new GenerateTokenProvider();
      const expiresIn = dayjs().add(1, 'day').unix();
      const token = await generateTokenProvider.execute(user.id, expiresIn);
      return {
        token,
        expiresIn,
        user: {
          id: user.id,
          email: user.email,
        },
      } as LoginResponse;
    } catch (error) {
      throw error;
    }
  }
}
