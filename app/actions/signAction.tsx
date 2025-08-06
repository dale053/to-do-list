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

    if (!response.data || !response.data.token) {
      throw new Error('No token returned from server');
    }

    return response.data;
  } catch (error: unknown) {
    // Manual type guard without isAxiosError
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response === 'object' &&
      'data' in (error as any).response &&
      typeof (error as any).response.data === 'object' &&
      (error as any).response.data !== null &&
      'message' in (error as any).response.data
    ) {
      const message = (error as any).response.data.message;
      throw new Error(typeof message === 'string' ? message : 'Login failed');
    }

    // Fallback for unknown errors
    throw new Error('An unexpected error occurred');
  }
};
