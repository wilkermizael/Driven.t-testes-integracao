import { prisma } from '@/config';

async function findWithEnrollmentPaid(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Ticket: true,
    },
  });
}
async function findTicket() {
  return prisma.ticket.findFirst();
}
async function findHotel() {
  return prisma.hotel.findFirst();
}
export const hotelsRepository = {
  findWithEnrollmentPaid,
  findTicket,
  findHotel,
};
