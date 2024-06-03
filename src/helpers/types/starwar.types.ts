export type MovieResponse = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  created: string;
  edited: string;
  url: string;
};

export type StarWarMoviesResponse = {
  results: Array<MovieResponse>;
};
