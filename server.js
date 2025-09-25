// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './config/mongodb.js';
// import connectCloudinary from './config/cloudinary.js';
// import userRouter from './routes/userRoute.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from './routes/orderRoute.js';


// //app config
// const app=express();
// const port=process.env.PORT || 4000
// connectDB()
// connectCloudinary();

// //middleware


// app.use(express.json());


// app.use(cors());




// //api endpoints



// app.use('/api/user',userRouter)
// app.use('/api/product',productRouter)
// app.use('/api/cart',cartRouter)
// app.use('/api/order',orderRouter)

// app.get('/',(req,res)=>{
//     res.send('api working');
// })

// app.listen(port,()=>{
//     console.log('server strated at '+port)
// })

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import passport from 'passport'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import './config/passport.js'; // Import passport configuration

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send('api working');
});

app.listen(port, () => {
    console.log('server started at ' + port);
});