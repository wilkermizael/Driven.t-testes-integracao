import { prisma } from '@/config';

async function findWithEnrollmentPaid(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Ticket: true,
    },
  });
}
async function findTicket(userId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId: userId },
    include: {
      TicketType: true,
    },
  });
}
async function findHotel() {
  return prisma.hotel.findFirst();
}
export const hotelsRepository = {
  findWithEnrollmentPaid,
  findTicket,
  findHotel,
};
