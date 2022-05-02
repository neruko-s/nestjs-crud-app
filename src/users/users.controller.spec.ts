import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const createUserDto: CreateUserDto = {
  firstName: 'firstName #1',
  lastName: 'lastName #1',
  email: 'email@email.emaillll',
};

const updateUserDto: UpdateUserDto = {
  firstName: 'newFirstName #1',
  lastName: 'newLastName #1',
  email: 'email@email.emaillll',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockDate = new Date();
  const mockUpdateDate = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((user: CreateUserDto) =>
              Promise.resolve({
                id: 1,
                createdAt: mockDate,
                updatedAt: mockDate,
                ...user,
              }),
            ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                email: 'email@email.emaillll',
              },
              {
                firstName: 'firstName #2',
                lastName: 'lastName #2',
                email: 'email2@email.emaillll',
              },
            ]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                createdAt: mockDate,
                updatedAt: mockDate,
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                email: 'email@email.emaillll',
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((id: number, user: UpdateUserDto) =>
                Promise.resolve({
                  id,
                  createdAt: mockDate,
                  updatedAt: mockUpdateDate,
                  ...user,
                }),
              ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      usersController.create(createUserDto);
      expect(usersController.create(createUserDto)).resolves.toEqual({
        id: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should find all users', () => {
      usersController.findAll();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a user', () => {
      expect(usersController.findOne('1')).resolves.toEqual({
        id: 1,
        createdAt: mockDate,
        updatedAt: mockDate,
        firstName: 'firstName #1',
        lastName: 'lastName #1',
        email: 'email@email.emaillll',
      });
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      expect(usersController.update('1', updateUserDto)).resolves.toEqual({
        id: 1,
        createdAt: mockDate,
        updatedAt: mockUpdateDate,
        ...updateUserDto,
      });
      expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove the user', () => {
      usersController.remove('2');
      expect(usersService.remove).toHaveBeenCalled();
    });
  });
});
