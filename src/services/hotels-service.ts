import { Hotel } from '@prisma/client';
import { hotelsRepository } from '@/repositories/hotels-repository';
import { notFoundError, notPaid } from '@/errors';

async function ticketPaid(userId: number) {
  const getEnrollment = await hotelsRepository.findWithEnrollmentPaid(userId);
  const getTicket = await hotelsRepository.findTicket();
  console.log(getTicket);
  const getHotel = await hotelsRepository.findHotel();
  if (!getEnrollment || !getTicket || !getHotel) throw notFoundError(); //SE NÃO EXISTIR INSCRIÇÃO, TICKET E HOTEL
  if (
    getTicket.status === 'RESERVED' ||
    getTicket.TicketType.isRemote === true ||
    getTicket.TicketType.includesHotel === false
  )
    throw notPaid(); // SE O TICKET NÃO TIVER SIDO PAGO

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
