const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf3gx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
       console.log('Database Connected Successfully')
       const database=client.db('tourism');
       const offerCollection=database.collection('offers');
       const orderCollection=database.collection('orders')
       //Get API
       app.get('/offers',async(req,res)=>{
           const cursor=offerCollection.find({});
           const offers=await cursor.toArray();
           res.send(offers)
       })
    //    GET single offer
    app.get('/offers/:offerId', async(req,res)=>{
        const id=req.params.offerId;
        const query={_id:ObjectId(id)};
        const offer=await offerCollection.findOne(query);
        res.json(offer)
        

    })
    app.get('/orders',async(req,res)=>{
        const cursor=orderCollection.find({});
        const orders=await cursor.toArray();
        res.send(orders)
    })
    //  // Add orders API
    //  app.post('/offers/orders', async (req, res) => {
    //     const order = req.body;
    //     const result = await orderCollection.insertOne(order);
    //     res.json(result);
    // })
    app.post('/offers', async (req, res) => {
          const offer = req.body;
             const result = await offerCollection.insertOne(offer);
             res.json(result);})
    app.post('/orders', async (req, res) => {
          const order = req.body;
             const result = await orderCollection.insertOne(order);
             res.json(result);})
// Delete API
app.delete('/orders/:id', async (req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const result= await orderCollection.deleteOne(query);
    res.json(result)
})
// Update API
app.put('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const updateUser = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
          status:updateUser.status="Approved"
        },
    };
    const result = await orderCollection.updateOne(filter, updateDoc, options);
    res.send(result)

})



    }
    finally{

    }
}
run().catch(console.dir)
 app.get('/',(req,res)=>{
     res.send('Running Tourism wonderfully')
 });
 app.listen(port,()=>{
     console.log('Running volunteer network on port',port)
 })