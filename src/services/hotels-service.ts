import { hotelsRepository } from '@/repositories/hotels-repository';
import { notFoundError, notPaid } from '@/errors';

async function ticketPaid(userId: number) {
  const getEnrollment = await hotelsRepository.findWithEnrollmentPaid(userId);
  if (!getEnrollment) throw notFoundError();
  const getTicket = await hotelsRepository.findTicket(getEnrollment.id);
  if (!getTicket) throw notFoundError();
  if (
    getTicket.status === 'RESERVED' ||
    getTicket.TicketType.isRemote === true ||
    getTicket.TicketType.includesHotel === false
  ) {
    throw notPaid(); // SE O TICKET NÃO TIVER SIDO PAGO
  }

  const getHotel = await hotelsRepository.findHotel();

  if (getHotel.length === 0) throw notFoundError();

  return getHotel;
}

async function getHotelId(userId: number, hotelId: number) {
  const getEnrollment = await hotelsRepository.findWithEnrollmentPaid(userId);
  if (!getEnrollment) throw notFoundError();
  const getTicket = await hotelsRepository.findTicket(getEnrollment.id);
  if (!getTicket) throw notFoundError(); //SE NÃO EXISTIR INSCRIÇÃO, TICKET E HOTEL

  if (
    getTicket.status === 'RESERVED' ||
    getTicket.TicketType.isRemote === true ||
    getTicket.TicketType.includesHotel === false
  ) {
    throw notPaid(); // SE O TICKET NÃO TIVER SIDO PAGO
  }
  const getHotel = await hotelsRepository.findHotelById(hotelId);

  if (!getHotel) throw notFoundError();

  return getHotel;
}

export const hotelsService = {
  ticketPaid,
  getHotelId,
};
