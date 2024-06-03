import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import {
  MovieResponse,
  StarWarMoviesResponse,
} from '../../helpers/types/starwar.types';

@Injectable()
export class StarWarService {
  constructor(private readonly httpService: HttpService) {}
  async getMovies(): Promise<Array<MovieResponse>> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<StarWarMoviesResponse>(`https://swapi.dev/api/films`)
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new HttpException(
              'Something happended, please try again',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
    return data.results;
  }

  async getMovie(id: string): Promise<MovieResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<MovieResponse>(`https://swapi.dev/api/films/${id}`)
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            if (error.response && error.response.status === 404) {
              return of({ data: null });
            }
            throw new HttpException(
              'Something happended, please try again',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
    return data;
  }
}
