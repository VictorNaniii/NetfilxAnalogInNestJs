import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.goard';
import { OnlyAdminGuard } from '../guards/adimin.goard';
import { TypeRole } from '../aut.interface';
export type Auth = 'admin' | 'user' | undefined;

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
