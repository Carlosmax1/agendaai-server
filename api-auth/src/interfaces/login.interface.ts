export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginErrors {
  error: 'invalid_credentials' | 'internal_error';
}

export type LoginRepository = {
  login: (login: Login) => Promise<LoginResponse | LoginErrors>;
  logout: () => Promise<void>;
};
