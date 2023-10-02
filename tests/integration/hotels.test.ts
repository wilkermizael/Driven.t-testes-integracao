import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createTicketTypeHotelFalse,
  createHotel,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 404 if no exist ENROLLMENT', async () => {
    // NÃO EXISTE INSCRIÇÃO
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotel').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist TICKET', async () => {
    // NÃO EXISTE TICKET
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotel').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist HOTEL', async () => {
    // NÃO EXISTE HOTEL
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotel').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ticket was not PAID', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await createHotel();
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('RESERVED');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and with ticket data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    expect(ticket.enrollmentId).toBe(enrollment.id); //Existe um enrollment
    const hotel = await createHotel();
    const { body, status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toEqual(httpStatus.OK);
    console.log(hotel);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });
});
