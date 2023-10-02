import { prisma } from '@/config';

async function findWithEnrollmentPaid(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Ticket: true,
    },
  });
}
async function findTicket(enrollmentId: number) {
  return prisma.ticket.findUnique({
    where: { enrollmentId },
    include: {
      TicketType: true,
    },
  });
}
async function findHotelById(id: number) {
  return prisma.hotel.findUnique({
    where: { id },
    include: {
      Rooms: true,
    },
  });
}

async function findHotel() {
  return prisma.hotel.findMany();
}
export const hotelsRepository = {
  findWithEnrollmentPaid,
  findTicket,
  findHotel,
  findHotelById,
};
