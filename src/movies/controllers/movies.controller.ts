import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from '../services/movies.service';

import { CreateMovieDto } from '../dto/create-movie.dto';
import { AuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../helpers/enums/role';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Movie } from '../../helpers/types/movie.types';

@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(): Promise<Array<Movie>> {
    return this.moviesService.getMovies();
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Post()
  createMovie(@Body() createMovieDto: CreateMovieDto): Promise<string> {
    if (!createMovieDto.name) throw new BadRequestException();
    return this.moviesService.createMovie(createMovieDto);
  }

  @Roles(Role.Regular)
  @UseGuards(RoleGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Movie> {
    const movie = await this.moviesService.findOne(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(@Param('id') id: string): Promise<string> {
    const movieExists = await this.moviesService.movieExists(id);
    if (!movieExists) throw new BadRequestException('Invalid movie');
    return this.moviesService.update();
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    const movieExists = await this.moviesService.movieExists(id);
    if (!movieExists) throw new BadRequestException('Invalid movie');
    return this.moviesService.delete();
  }
}
