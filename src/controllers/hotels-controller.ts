import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await hotelsService.ticketPaid(userId);
  res.status(httpStatus.OK).send(result);
}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  const result = await hotelsService.getHotelId(userId, Number(hotelId));
  res.status(httpStatus.OK).send(result);
}
