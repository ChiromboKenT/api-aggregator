import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { RequestHandlerService } from './request-handler.service';
import { ApiResponse } from './request.dto';
import { Response } from 'express';
import { v4 as uuid4 } from 'uuid';

@Controller('api/v1/sse')
export class RequestHandlerController {
  constructor(private readonly requestHandlerService: RequestHandlerService) {}

  @Get('/games')
  async getAllGames(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    @Res() response: Response,
  ) {
    //Use SSE to send updates to the client
    const clientId = uuid4();

    //Initiate the get all games service
    await this.requestHandlerService.getAllGames(page, pageSize, clientId);

    // Register the client to receive updates
    const unsubscribe = this.requestHandlerService.registerClient(
      response,
      clientId,
      'games',
    );
    // Configure SSE
    this.configureSSE(response, unsubscribe, 'games');
    //return this.requestHandlerService.getAllGames(page, pageSize);
  }

  @Get('/games/:id')
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    //Use SSE to send updates to the client
    const clientId = uuid4();

    //Initiate the get game by id service
    await this.requestHandlerService.getGameById(id, clientId);

    // Register the client to receive updates
    const unsubscribe = this.requestHandlerService.registerClient(
      response,
      clientId,
      `games/:id`,
    );

    // Configure SSE
    this.configureSSE(response, unsubscribe, `games/:id`);
  }

  @Get('/games/:id/articles/:timestamp')
  async getGameArticlesById(
    @Param('id', ParseIntPipe) id: number,
    @Param('timestamp', ParseIntPipe) timestamp: number,
    @Query('location') location: string,
    @Res() response: Response,
  ) {
    //Use SSE to send updates to the client
    const clientId = uuid4();

    //Initiate the get game articles by id service
    await this.requestHandlerService.getGameArticlesById(
      id,
      timestamp,
      clientId,
      location,
    );

    // Register the client to receive updates
    const unsubscribe = this.requestHandlerService.registerClient(
      response,
      clientId,
      `games/:id/articles/:timestamp`,
    );
    // Configure SSE
    this.configureSSE(response, unsubscribe, `games/:id/articles/:timestamp`);
  }

  configureSSE = (response: Response, unsubscribe, url: string) => {
    // Set the headers to indicate this is an SSE connection
    response.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    // Flusing the headers will establish the connection
    response.flushHeaders();

    response.on('DONE', (data: any) => {
      unsubscribe();
      //Close the connection when the client disconnects
      response.end(
        JSON.stringify({
          data,
          message: 'Successfully retrieved: ' + url,
        }),
      );
    });

    // Close the connection when the client disconnects
    response.on('close', () => {
      unsubscribe();
    });
  };
}
