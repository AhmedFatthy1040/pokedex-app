import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super();
  }

  async validate(token: string): Promise<{ token: string }> {
    const validToken = this.configService.get<string>('AUTH_TOKEN');

    if (token !== validToken) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    return { token };
  }
}
