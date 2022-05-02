import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user
      .create({
        data: createUserDto,
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('登録情報が無効です');
          }
        }
        throw error;
      });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('登録IDなし');
          }
        }
        throw error;
      });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user
      .update({
        where: {
          id,
        },
        data: updateUserDto,
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new ForbiddenException('情報が無効です');
          }
        }
        throw error;
      });
  }

  async remove(id: number) {
    return await this.prisma.user
      .delete({
        where: {
          id,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new ForbiddenException('情報が無効です');
          }
        }
        throw error;
      });
  }
}
