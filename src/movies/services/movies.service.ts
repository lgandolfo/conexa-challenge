import { Injectable } from '@nestjs/common';

import { CreateMovieDto } from '../dto/create-movie.dto';
import { StarWarService } from '../../startwar/services/starwar.service';
import { Movie } from '../../helpers/types/movie.types';

@Injectable()
export class MoviesService {
  constructor(private readonly starwarService: StarWarService) {}
  async getMovies(): Promise<Array<Movie>> {
    const movies = await this.starwarService.getMovies();
    const formatedMovies = movies.map((movie, index) => ({
      id: index + 1,
      ...movie,
    }));
    return formatedMovies;
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<string> {
    return `${createMovieDto.name} created successfully`;
  }

  async findOne(id: string): Promise<Movie | null> {
    const response = await this.starwarService.getMovie(id);
    if (!response) return null;
    return { id: parseInt(id), ...response };
  }

  update(): string {
    return 'Movie updated successfully';
  }

  delete(): string {
    return 'Movie deleted successfully';
  }

  async movieExists(id: string): Promise<boolean> {
    const movie = await this.findOne(id);
    return !!movie;
  }
}
