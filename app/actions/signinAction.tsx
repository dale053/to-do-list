import axios from 'axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const login = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      credentials
    );

    const token = response.data?.token;

    if (!token || typeof token !== 'string') {
      throw new Error('No valid token returned from server');
    }

    return { token };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    const serverMessage =
      maybeAxiosError?.response?.data?.message ?? maybeAxiosError?.message;

    throw new Error(serverMessage || 'Login failed');
  }
};