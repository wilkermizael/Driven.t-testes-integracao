import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { getHotelId, getHotels } from '@/controllers/hotels-controller';
import { hotelId } from '@/schemas/hotels-schemas';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', validateParams(hotelId), getHotelId);

export { hotelsRouter };
//.get('/:hotelId', getHotelById);
