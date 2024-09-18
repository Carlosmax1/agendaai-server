export type TokenRepository = {
  execute: (userId: string, expiresIn: number) => Promise<string>;
};
