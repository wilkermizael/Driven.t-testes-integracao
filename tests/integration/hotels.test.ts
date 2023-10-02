import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createHotel,
  createTicketTypeWithParams,
  createRoom,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if no exist ENROLLMENT', async () => {
    // NÃO EXISTE INSCRIÇÃO
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist TICKET', async () => {
    // NÃO EXISTE TICKET
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist HOTEL', async () => {
    // NÃO EXISTE HOTEL
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
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

  it('should respond with status 402 if isRemote is true', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('PAID');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if includesHotel is false', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('PAID');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and with ticket data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const { body, status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toEqual(httpStatus.OK);
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          image: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if no exist ENROLLMENT', async () => {
    // NÃO EXISTE INSCRIÇÃO
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist TICKET', async () => {
    // NÃO EXISTE TICKET
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 if no exist HOTEL', async () => {
    // NÃO EXISTE HOTEL
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, true);
    const hotel = await createHotel();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const { status } = await server.get(`/hotels/${hotel.id + 1}`).set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ticket was not PAID', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const hotel = await createHotel();
    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('RESERVED');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if isRemote is true', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotel();
    const { status } = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('PAID');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 if includesHotel is false', async () => {
    // TICKET NÃO ESTÁ PAGO
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(ticket.status).toBe('PAID');
    expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and with ticket data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithParams(false, true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const { body, status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(status).toEqual(httpStatus.OK);
    expect(body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      image: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      Rooms: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          capacity: expect.any(Number),
          hotelId: hotel.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    });
  });
});
