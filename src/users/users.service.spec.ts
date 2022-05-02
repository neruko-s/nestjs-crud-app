import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let userId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  describe('User CRUD', () => {
    it('create', async () => {
      const user = await userService.create({
        firstName: 'Hogeo',
        lastName: 'Hogeta',
        email: 'hoge@hogehoge.hogeo',
      });
      expect(user.email).toBe('hoge@hogehoge.hogeo');
      userId = user.id;
    });
    it('create email重複', async () => {
      try {
        await userService.create({
          firstName: 'Hogeo',
          lastName: 'Hogeta',
          email: 'hoge@hogehoge.hogeo',
        });
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });

    it('findAll', async () => {
      const users = await userService.findAll();
      expect(users[0].id).toBe(userId);
      expect(users.length).toBe(1);
    });

    it('findOne', async () => {
      const user = await userService.findOne(userId);
      expect(user.id).toBe(userId);
    });
    it('findOne 該当なし', async () => {
      try {
        await userService.findOne(9999);
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });

    it('update', async () => {
      const data = {
        firstName: 'Hogeo2',
        lastName: 'Hogeta',
        email: 'hoge@hogehoge.hogeo',
      };
      const user = await userService.update(userId, data);
      expect(user.firstName).toBe('Hogeo2');
    });
    it('update 該当idなし', async () => {
      const data = {
        firstName: 'Hogeo2',
        lastName: 'Hogeta',
        email: 'hoge@hogehoge.hogeo',
      };
      try {
        await userService.update(9999, data);
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });

    it('remove', async () => {
      const user = await userService.remove(userId);
      expect(user.id).toBe(userId);
    });
    it('remove 該当idなし', async () => {
      try {
        await userService.remove(userId);
      } catch (error) {
        expect(error.status).toBe(403);
      }
    });
  });
});
