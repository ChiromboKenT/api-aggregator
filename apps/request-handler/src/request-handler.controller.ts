import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { RequestHandlerService } from './request-handler.service';
import { ApiResponse } from './request.dto';

@Controller('api/v1')
export class RequestHandlerController {
  constructor(private readonly requestHandlerService: RequestHandlerService) {}

  @Get('/games')
  getAllGames(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
  ): Promise<ApiResponse> {
    return this.requestHandlerService.getAllGames(page, pageSize);
  }

  @Get('/games/:id')
  getGameById(@Query('id', ParseIntPipe) id: number): Promise<ApiResponse> {
    return this.requestHandlerService.getGameById(id);
  }

  @Get('/games/:id/articles/:timestamp')
  getGameArticlesById(
    @Query('id', ParseIntPipe) id: number,
    @Query('timestamp', ParseIntPipe) timestamp: number,
  ): Promise<ApiResponse> {
    return this.requestHandlerService.getGameArticlesById(id, timestamp);
  }
}
