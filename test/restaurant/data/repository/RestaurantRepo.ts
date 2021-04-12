import  mongoose from 'mongoose';
import RestaurantRepo from '../../../../src/restaurant/data/repository/RestaurantRepo'
import dotenv from 'dotenv'
import { cleanDb, prepareDb } from '../helpers/helper';
import { expect } from 'chai';

import Restaurant, { Location } from "../../../../src/restaurant/domain/Restaurant";
dotenv.config()

describe("RestaurantRepo",()=>{
    let client:mongoose.Mongoose
    let sut:RestaurantRepo
    let insertId:string

    beforeEach( async () =>{
        
        client = new mongoose.Mongoose()
        const connectionStr = encodeURI(process.env.TEST_DB as string)
        client.connect(connectionStr,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true})

            sut = new RestaurantRepo(client);
            const doc = await prepareDb(client)
            insertId = doc[0].id
    })

    afterEach(async()=>{
        await cleanDb(client)
        client.disconnect()
    })

    describe("findAll",()=>{

       

        it("should return 2 restaurants",async ()=>{
            
                const result = await sut.findAll(1,2);
                
                expect(result).to.not.be.empty;
                expect(result.restaurants.length).eq(2);
                console.log(result.restaurants[0].name);
            })
      
    })

    describe("findOne",()=>{
        

        it("should not return anything",async ()=>{
            
            await sut.findOne('no_id').catch((err) => {
                expect(err).not.be.empty
              })
            })

            it("should  return the restaurant",async ()=>{
            
                const result = await sut.findOne(insertId)
                
                expect(result).to.not.be.empty;
            })
       
    })


  describe('findByLocation', () => {
    

    it('return a promise reject with error message', async () => {
      const location = new Location(20.33, 73.33)
      await sut.findbyLocation(1, 2,location).catch((err) => {
        expect(err).not.be.empty
      })
    })

    it('should return a found restaurant', async () => {
      const location = new Location(40.33, 73.23)
      const results = await sut.findbyLocation( 1, 2,location)

      expect(results.restaurants.length).eq(2)
    })
  })


  describe('search', () => {
   

    it('returns promise reject with error message when no restaurant is found', async () => {
      const query = 'not present'
      await sut.search(1, 2, query).catch((err) => {
        expect(err).to.not.be.empty
      })
    })

    it('returns restaurants that matches query string', async () => {
      const query = 'restaurant name'
      const results = await sut.search(1, 2, query)
      expect(results.restaurants.length).to.eq(2)
    })
  })

  describe('getMenu', () => {
   

    it('returns menu', async () => {
      
    const result = await sut.getMenu(insertId);
    expect(result).to.not.be.empty
    console.log(result[0].displayImageUrl)
    })

   
  })
})