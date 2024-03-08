import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();

    return await app.init();
  });

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    return await app.close();
  });

  describe('when listing cupcakes', () => {
    it('should return an empty list if there are no cupcakes', async () => {
      const response = await request(app.getHttpServer())
        .get('/cupcake')
        .expect(200);

      expect(response.body).toEqual([]);
    });
    
    it('should return the list of cupcakes', async () => {
      await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 1', description: 'Description 1', price: 10, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/cupcake')
        .expect(200);

      expect(response.body).toEqual(expect.any(Array));
    });    
  });

  describe('when adding a new cupcake', () => {
    it('should return the newly created cupcake', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 1', description: 'Description 1', price: 10, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);
        
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Cupcake 1',
          description: 'Description 1',
          price: 10,
          ingredients: ['ingredient 1', 'ingredient 2']
        })
      );

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toEqual(expect.any(String));
    });

    it('should create a db record', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 2', description: 'Description 2', price: 9.99, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);
        
      const dbResponse = await request(app.getHttpServer())
        .get(`/cupcake/${response.body.id}`)
        .expect(200);

        expect(dbResponse.body).toEqual(
          expect.objectContaining({
            name: 'Cupcake 2',
            description: 'Description 2',
            price: 9.99,
            ingredients: ['ingredient 1', 'ingredient 2']
          })
        );
    });

    it('should reject the request if the body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({})
        .expect(400);
    });

    it('should reject the request if the price is not a number', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 2', description: 'Description 2', price: 'invalid', ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(400);
    });

    it('should reject the request if the price is less then 0', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 2', description: 'Description 2', price: '-100.00', ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(400);
    });
  });

  describe('when getting a cupcake', () => {
    it('should return the cupcake', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 3', description: 'Description 3', price: 11, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      const dbResponse = await request(app.getHttpServer())
        .get(`/cupcake/${response.body.id}`)
        .expect(200);

      expect(dbResponse.body).toEqual(
        expect.objectContaining({
          name: 'Cupcake 3',
          description: 'Description 3',
          price: 11,
          ingredients: ['ingredient 1', 'ingredient 2']
        })
      );
    });

    it('should return a 404 if the cupcake does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/cupcake/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return a 400 if the id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/cupcake/invalid_id')
        .expect(400);
    });
  });

  describe('when deleting a cupcake', () => {
    it('should delete the cupcake', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 4', description: 'Description 4', price: 12, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/cupcake/${response.body.id}`)
        .expect(204);

      const dbResponse = await request(app.getHttpServer())
        .get(`/cupcake/${response.body.id}`)
        .expect(404);
    });

    it('should return a 404 if the cupcake does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete('/cupcake/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return a 400 if the id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/cupcake/invalid_id')
        .expect(400);
    });
  });

  describe('when updating a cupcake', () => {
    it('should update the cupcake', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 5', description: 'Description 5', price: 13, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      const updatedCupcake = {
        name: 'Cupcake 5',
        description: 'Updated description',
        price: 14,
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3']
      };

      const dbResponse = await request(app.getHttpServer())
        .put(`/cupcake/${response.body.id}`)
        .send(updatedCupcake)
        .expect(200);

      expect(dbResponse.body).toEqual(
        expect.objectContaining(updatedCupcake)
      );
    });

    it('should return a 404 if the cupcake does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put('/cupcake/00000000-0000-0000-0000-000000000000')
        .send({ name: 'Cupcake 6', description: 'Description 6', price: 15, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(404);
    });

    it('should return a 400 if the id is invalid', async () => {
      const response = await request(app.getHttpServer())
        .put('/cupcake/invalid_id')
        .send({ name: 'Cupcake 7', description: 'Description 7', price: 16, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(400);
    });

    it('should reject the request if the price is not a number', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 8', description: 'Description 8', price: 17, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      const updatedCupcake = {
        name: 'Cupcake 8',
        description: 'Updated description',
        price: 'invalid',
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3']
      };

      const dbResponse = await request(app.getHttpServer())
        .put(`/cupcake/${response.body.id}`)
        .send(updatedCupcake)
        .expect(400);
    });

    it('should reject the request if the price is less then 0', async () => {
      const response = await request(app.getHttpServer())
        .post('/cupcake')
        .send({ name: 'Cupcake 9', description: 'Description 9', price: 18, ingredients: ['ingredient 1', 'ingredient 2']})
        .expect(201);

      const updatedCupcake = {
        name: 'Cupcake 9',
        description: 'Updated description',
        price: '-100.00',
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3']
      };

      const dbResponse = await request(app.getHttpServer())
        .put(`/cupcake/${response.body.id}`)
        .send(updatedCupcake)
        .expect(400);
    });
  });
});
