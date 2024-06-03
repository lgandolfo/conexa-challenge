import { Test, TestingModule } from '@nestjs/testing';
import { StarWarService } from './starwar.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Movie } from '../../helpers/types/movie.types';

const mockMovie: Movie = {
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

class HttpServiceMock {
  get(url: string) {
    if (url === 'https://swapi.dev/api/films') {
      return of({
        data: {
          results: [mockMovie],
        },
      });
    } else if (url === 'https://swapi.dev/api/films/1') {
      return of({ data: mockMovie });
    }
    return of({ data: null });
  }
}

describe('StarWarService', () => {
  let service: StarWarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarWarService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get<StarWarService>(StarWarService);
  });

  it('should fetch Star Wars movies', async () => {
    const movies = await service.getMovies();
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toEqual(mockMovie.title);
  });

  it('should fetch a Star Wars movie by id', async () => {
    const movieId = '1';
    const movie = await service.getMovie(movieId);
    expect(movie.title).toEqual(mockMovie.title);
  });

  it('should handle 404 error when fetching a non-existing movie', async () => {
    const nonExistingMovieId = '100';
    const movie = await service.getMovie(nonExistingMovieId);
    expect(movie).toBeNull();
  });
});
