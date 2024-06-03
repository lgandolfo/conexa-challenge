import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { StarWarService } from '../../startwar/services/starwar.service';
import { Movie } from '../../helpers/types/movie.types';
import { CreateMovieDto } from '../dto/create-movie.dto';

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

describe('MoviesController', () => {
  let service: MoviesService;
  let starwarService: StarWarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: StarWarService,
          useValue: {
            getMovies: jest.fn(),
            getMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    starwarService = module.get<StarWarService>(StarWarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return movies data', async () => {
      jest.spyOn(starwarService, 'getMovies').mockResolvedValue([movie]);

      const result = await service.getMovies();

      expect(result).toEqual([movie]);
      expect(starwarService.getMovies).toHaveBeenCalledWith();
    });
  });

  describe('createMovie', () => {
    it('should create movie', async () => {
      const createMovieDto: CreateMovieDto = {
        name: 'Test Movie',
      };

      const expectedResult = 'Test Movie created successfully';
      const result = await service.createMovie(createMovieDto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return movie data', async () => {
      const movieId = '1';
      jest.spyOn(starwarService, 'getMovie').mockResolvedValue(movie);
      const result = await service.findOne(movieId);

      expect(result).toEqual(movie);
      expect(starwarService.getMovie).toHaveBeenCalledWith(movieId);
    });

    it('should return movie not found', async () => {
      const movieId = '100';
      jest.spyOn(starwarService, 'getMovie').mockResolvedValue(null);
      const result = await service.findOne(movieId);

      expect(result).toEqual(null);
      expect(starwarService.getMovie).toHaveBeenCalledWith(movieId);
    });
  });

  describe('update', () => {
    it('should update movie', async () => {
      const expectedResult = 'Movie updated successfully';
      const result = await service.update();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete movie', async () => {
      const expectedResult = 'Movie deleted successfully';
      const result = await service.delete();
      expect(result).toEqual(expectedResult);
    });
  });
});
