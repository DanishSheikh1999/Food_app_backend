import RestaurantRouter from "../../../src/restaurant/entrypoint/RestaurantRouter"
import  mongoose from "mongoose"
import  express from 'express'
import dotenv from "dotenv"
dotenv.config()
import request from 'supertest'
import {cleanDb,prepareDb} from '../../restaurant/data/helpers/helper'
import IRestaurantRepo from "../../../src/restaurant/data/repository/IRestaurantRepi"
import RestaurantRepo from "../../../src/restaurant/data/repository/RestaurantRepo"
import ITokenService from "../../../src/auth/services/ITokenService"
import ITokenStore from "../../../src/auth/services/ITokenStore"
import TokenValidator from "../../../src/auth/helper/TokenValidator"
import { RestaurantDoc } from "../../../src/restaurant/data/metadata/RestaurantModel"
import { expect } from "chai"

describe("RouterTest",()=>{
    let client:mongoose.Mongoose
    let app:express.Application
    let repository:IRestaurantRepo
    let savedRestaurants:RestaurantDoc[]
    before(() =>{
        client = new mongoose.Mongoose()
        const connectionStr = encodeURI(process.env.TEST_DB as string)
        client.connect(connectionStr,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true})

        repository = new RestaurantRepo(client)
        let tokenService = new FakeTokenService()
    let tokenStore = new FakeTokenStore()

    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
      '/restaurants',
      RestaurantRouter.configure(
        
        new TokenValidator(tokenService, tokenStore),
        repository,
      )
    )
  })

  beforeEach(async () => {
    savedRestaurants = await prepareDb(client)
  })

  afterEach(async () => {
    await cleanDb(client)
  })

  after(() => {
    client.disconnect()
  })


  it("findAll",async ()=>{
      await request(app)
      .get("/restaurants?page=1&limit=2")
      .set("Authorization","token")
      .expect(200)
      .then((res) => {
        expect(res.body.metadata).to.not.be.empty
        expect(res.body.restaurants).to.not.be.empty
      })

  })

  it("findOne",async ()=>{
      const id = savedRestaurants[0].id
      const path = '/restaurants/restaurant/'+id
     console.log(path)
    await request(app)
    .get(path)
    .set("Authorization","token")
    .expect(200)
    .then((res) => {
      expect(res).to.not.be.empty
    })

})


it("findbyLocation",async ()=>{
    
    const path = '/restaurants/location?page=1&limit=2&longitude=40.33&latitude=73.23'
   console.log(path)
  await request(app)
  .get(path)
  .set("Authorization","token")
  .expect(200)
  .then((res) => {
    expect(res).to.not.be.empty
  })

})
it("search",async ()=>{
    
    const path = '/restaurants/search?page=1&limit=2&query=name'
   console.log(path)
  await request(app)
  .get(path)
  .set("Authorization","token")
  .expect(200)
  .then((res) => {
    expect(res).to.not.be.empty
  })

})

it('returns 200 and restaurant menu', async () => {
    const id = savedRestaurants[0].id
    await request(app)
      .get(`/restaurants/restaurant/menu/${id}`)
      .set('Authorization', 'token')
      .expect(200)
      .then((res) => {
        expect(res.body).to.not.be.empty
        expect(res.body.menu).to.not.be.empty
      })
  })
})

export default class FakeTokenService implements ITokenService {
    encode(payload: string | object): string | object {
      return payload
    }
    decode(token: string | object): string | object {
      return token
    }
  }
  
  class FakeTokenStore implements ITokenStore {
    save(token: string): void {
      console.log(token)
    }
    async get(token: string): Promise<string> {
      return ''
    }
  }