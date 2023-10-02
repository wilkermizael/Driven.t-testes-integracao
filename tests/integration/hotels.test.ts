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

  /*it('should respond with status 200 and with ticket data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    expect(ticket.enrollmentId).toBe(enrollment.id); //Existe um enrollment
    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);

    expect(response.body).toMatchObject({
      status: 'PAID',
      TicketType: {
        includesHotel: true,
      },
    });
  });*/
});

//console.log(enrollment);
//expect(enrollment).toHaveLength(1);
/*expect(response.body).toEqual({
      id: expect.any(Number),
      status: 'PAID',
      ticketTypeId: expect.any(Number),
      enrollmentId: expect.any(Number),
      TicketType: {
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
        isRemote: expect.any(Boolean),
        includesHotel: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });*/
