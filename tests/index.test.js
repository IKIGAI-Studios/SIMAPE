import { app, server } from '../index.js';
import request from 'supertest';
import Usuario from '../models/usuarioModel.js';

const api = request(app)

const usersTest = [
    {
        matricula: '123',
        nombre: 'usuario',
        adscripcion: 'sjr',
        tipo_usuario: 'Administrador',
        usuario: 'user1',
        pass: '123',
        estatus: true
    },
    {
        matricula: '1234',
        nombre: 'usuario',
        adscripcion: 'sjr',
        tipo_usuario: 'Operativo',
        usuario: 'user2',
        pass: '123',
        estatus: true
    }
];


beforeAll(() => {
    Usuario.destroy({where:{}, trucate:true});
    usersTest.forEach(user => {
        Usuario.create(user);
    });
});

describe('SERVER', () => {
    test('server starts correctly', async () =>{
        await api.get('/').expect(200);
    });
});

describe('GET /test', () => {
    test('get an array of users', async () =>{
        const res = await api.get('/test');
        expect(res.body).toHaveLength(usersTest.length);
    });
});

afterAll(() => {
    server.close();
});