const request = require('supertest');
const app = require('../../app');
const { connectDatabase } = require("../../services/mongo")

describe('Test lauches API', () => {
    
    beforeAll( async() => {
        await connectDatabase();
    })

    describe('Test GET/launches', () => {
        test('Test for successfully get all launches', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200)
        })
    })
    
    describe('Test POST/launches', () => {
    
        const launchData = {
            launchDate: "January 27, 2031",
            mission: "Kepler Exploration XI",
            rocket: "Explorer IS2",
            target: "Kepler-1652 b"
        }
    
        const launchDataWithoutDate = {
            mission: "Kepler Exploration XI",
            rocket: "Explorer IS2",
            target: "Kepler-1652 b"
        }
    
        const launchDataWithInvalidLaunchDate = {
            launchDate: "a",
            mission: "Kepler Exploration XI",
            rocket: "Explorer IS2",
            target: "Kepler-186 a"
        }
    
        test('Test for successfully add new launch', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchData)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(201)
            
            const requestDate = new Date(launchData.launchDate);
            const responseDate = new Date(response.body.launchDate);
            expect(responseDate).toStrictEqual(requestDate);
    
            expect(response.body).toMatchObject(launchDataWithoutDate);
        })
    
        test('Test for missing required launch property', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(400)
            
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
    
        })
    
        test('Test for invalid launch date', async () => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidLaunchDate)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(400)
        
            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            })
    
        })
        
    })

})

