import axios from 'axios';

export interface SignupPayload {
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  token?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Registers a new user.
 */
export const signup = async (
  credentials: SignupPayload
): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(
      `${API_BASE_URL}/auth/signup`,
      credentials
    );

    return response.data;
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.data?.message === 'string'
    ) {
      throw new Error((error as any).response.data.message);
    }

    throw new Error('An unexpected error occurred during signup');
  }
};