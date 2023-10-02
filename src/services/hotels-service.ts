import { Hotel } from '@prisma/client';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { notFoundError, notPaid } from '@/errors';

async function ticketPaid(userId: number) {
  const getEnrollment = await hotelsRepository.findWithEnrollmentPaid(userId);
  const getTicket = await hotelsRepository.findTicket();
  const getHotel = await hotelsRepository.findHotel();
  console.log(getTicket);
  if (!getEnrollment || !getTicket || !getHotel) throw notFoundError();
  console.log('aqui');
  if (getTicket.status === 'RESERVED') throw notPaid();
  console.log(getTicket.status);
  return true;
}
async function getHotels() {
  const getHotel: Hotel = await hotelsRepository.findHotel();
  return getHotel;
}
export const hotelsService = {
  ticketPaid,
  getHotels,
};
