import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		forwardRef(() => UsersModule),
		JwtModule.register({
			secret: process.env.JWT_PRIVATE_KEY || 'secret',
			signOptions: {
				expiresIn: '24h',
			},
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
