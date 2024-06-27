const req = require('supertest');
const app = require("../../app");
const { connectDatabase } = require("../../services/mongo")

describe('Test GET/planets ',() => {
    
    beforeAll( async() => {
        await connectDatabase();
    })

    test('Test for successfully get all planets', async () => {
        const res = await req(app)
            .get('/v1/planets')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
    })
})