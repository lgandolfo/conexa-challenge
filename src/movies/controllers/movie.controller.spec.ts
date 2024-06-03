import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { StarWarModule } from '../../startwar/startwar.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StarWarService } from '../../startwar/services/starwar.service';
import { Movie } from '../../helpers/types/movie.types';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  const movie: Movie = {
    id: 1,
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl:
      "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
    director: 'George Lucas',
    producer: 'Gary Kurtz, Rick McCallum',
    release_date: '1977-05-25',
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/1/',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StarWarModule],
      providers: [
        MoviesService,
        {
          provide: APP_GUARD,
          useExisting: AuthGuard,
        },
        AuthGuard,
        JwtService,
        ConfigService,
        {
          provide: StarWarService,
          useValue: {},
        },
      ],
      controllers: [MoviesController],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies data', async () => {
      jest.spyOn(moviesService, 'getMovies').mockResolvedValue([movie]);

      const result = await controller.getMovies();

      expect(result).toEqual([movie]);
      expect(moviesService.getMovies).toHaveBeenCalledWith();
    });
  });

  describe('createMovie', () => {
    it('should create movie', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'Test Movie',
      };

      const expectedResult = 'Test Movie created successfully';
      jest
        .spyOn(moviesService, 'createMovie')
        .mockResolvedValue(expectedResult);

      const result = await controller.createMovie(createMovieDto);

      expect(result).toEqual(expectedResult);
      expect(moviesService.createMovie).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findOne', () => {
    it('should return movie data', async () => {
      const movieId = '1';
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(movie);

      const result = await controller.findOne(movieId);

      expect(result).toEqual(movie);
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
    });

    it('should return movie not found', async () => {
      const movieId = '1';
      jest.spyOn(moviesService, 'findOne').mockResolvedValue(null);

      try {
        await controller.findOne(movieId);
      } catch (error) {
        expect(
          (error as BadRequestException).getResponse() as string,
        ).toMatchObject(new NotFoundException('Movie not found').getResponse());
      }
      expect(moviesService.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('update', () => {
    it('should update movie', async () => {
      const movieId = '1';
      const expectedResult = 'Movie updated successfully';
      jest.spyOn(moviesService, 'movieExists').mockResolvedValue(true);
      jest
        .spyOn(moviesService, 'update')
        .mockReturnValue('Movie updated successfully');

      const result = await controller.update(movieId);

      expect(result).toEqual(expectedResult);
      expect(moviesService.movieExists).toHaveBeenCalledWith(movieId);
      expect(moviesService.update).toHaveBeenCalledWith();
    });

    it('should update movie failed', async () => {
      const movieId = '1';
      jest.spyOn(moviesService, 'movieExists').mockResolvedValue(false);
      jest.spyOn(moviesService, 'update');

      try {
        await controller.update(movieId);
      } catch (error) {
        expect(
          (error as BadRequestException).getResponse() as string,
        ).toMatchObject(new BadRequestException('Invalid movie').getResponse());
      }
      expect(moviesService.movieExists).toHaveBeenCalledWith(movieId);
      expect(moviesService.update).not.toHaveBeenCalledWith();
    });
  });

  describe('delete', () => {
    it('should delete movie', async () => {
      const movieId = '1';
      const expectedResult = 'Movie deleted successfully';
      jest.spyOn(moviesService, 'movieExists').mockResolvedValue(true);
      jest
        .spyOn(moviesService, 'delete')
        .mockReturnValue('Movie deleted successfully');

      const result = await controller.delete(movieId);

      expect(result).toEqual(expectedResult);
      expect(moviesService.movieExists).toHaveBeenCalledWith(movieId);
      expect(moviesService.delete).toHaveBeenCalledWith();
    });

    it('should delete movie failed', async () => {
      const movieId = '1';
      jest.spyOn(moviesService, 'movieExists').mockResolvedValue(false);
      jest.spyOn(moviesService, 'delete');

      try {
        await controller.delete(movieId);
      } catch (error) {
        expect(
          (error as BadRequestException).getResponse() as string,
        ).toMatchObject(new BadRequestException('Invalid movie').getResponse());
      }
      expect(moviesService.movieExists).toHaveBeenCalledWith(movieId);
      expect(moviesService.delete).not.toHaveBeenCalledWith();
    });
  });
});
