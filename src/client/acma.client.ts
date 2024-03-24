import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ConfigService } from 'src/config/config.service';
import { AuthResponse } from './interfaces/auth-response.interface';
import { UserReponse } from './interfaces/user-response.interface';
import { CONSTANTS } from 'src/constants';

@Injectable()
export class AcmaClient {
  private acmaAxios: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.acmaAxios = axios.create({
      baseURL: this.config.get('ACMA_BASE_URL'),
    });
  }

  async authRequest(token: string): Promise<AuthResponse> {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await this.acmaAxios.post<AuthResponse>(
        CONSTANTS.ACMA_VERIFY_ENDPOINT,
        { token },
        axiosConfig,
      );
      return response.data;
    } catch (error) {
      if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error.message);
      }
      if (error?.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async getUserInfo(usersIds: string[], token: string): Promise<UserReponse[]> {
    //Find another way to this faking shit
    const queryParams = usersIds.map((id) => `userIds[]=${id}`).join('&');
    const urlWithParams = `${CONSTANTS.ACMA_USER_IDS}?${queryParams}`;

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await this.acmaAxios.get<UserReponse[]>(urlWithParams, axiosConfig);
      return response.data;
    } catch (error) {
      if (error?.response?.status === HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error.message);
      }
      if (error?.response?.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
