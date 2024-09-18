import { sign } from 'jsonwebtoken';
import { TokenRepository } from '@/interfaces/token.interface';
import { envs } from '@/envs';

export class GenerateTokenProvider implements TokenRepository {
  async execute(userId: string, expiresIn: number): Promise<string> {
    const token = sign({}, envs.JWT_SECRET, {
      subject: userId,
      expiresIn,
    });
    return token;
  }
}
