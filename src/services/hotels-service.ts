import { hotelsRepository } from '@/repositories/hotels-repository';
import { notFoundError, notPaid } from '@/errors';

async function ticketPaid(userId: number) {
  const getEnrollment = await hotelsRepository.findWithEnrollmentPaid(userId);
  const getTicket = await hotelsRepository.findTicket(userId);
  const getHotel = await hotelsRepository.findHotel();
  if (!getEnrollment || !getTicket || !getHotel) throw notFoundError();
  if (
    getTicket.status === 'RESERVED' ||
    getTicket.TicketType.includesHotel === false ||
    getTicket.TicketType.isRemote === true
  )
    throw notPaid('notPaid');

  return true;
}

export const hotelsService = {
  ticketPaid,
};
