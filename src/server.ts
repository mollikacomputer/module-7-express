import express, { type Application, type Request, type Response } from 'express'
import {Pool} from 'pg'
const app :Application= express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));

const pool = new Pool({
  connectionString:"postgresql://neondb_owner:npg_s5fkG7AoNBVY@ep-quiet-surf-ap15ybnl-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});



const initDB = async ()=>{
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `)
      console.log("database connect successfully!")
  } catch (error) {
    console.log(error)
  }
};
initDB();

// const initDB = async ()=>{
//   try {
//     await pool.query(`
//       // write query here
//       `)
//   } catch (error) {
//     console.log(error)
//   }
// }

app.get('/', (req : Request, res : Response) => {
  res.send({'message': 'Express server', 'Author':'Mollika Computer'})
});

//2 post api
app.post('/api/users', async(req:Request, res: Response)=>{
  // console.log(req.body)
  // const body = req.body;
  const {name, email, password, age} = req.body;
  try {
    
  const result = await pool.query(`
    INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4) RETURNING *
    `, [name, email, password, age])
    console.log(result)
  res.status(201).json({
    message:"User created successfully!",
    data: result.rows[0]
  })
  } catch (error:any) {
    res.status(500).json({
      message:error.message,
      error:error,
  })
  }
});

// get all data
app.get('/api/users', async(req:Request, res: Response)=>{
  try {
    const result = await pool.query(` SELECT * FROM users`)
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows,
    })
  } catch (error: any) {
    res.status(500).json({
      success:false,
      message:error.message,
      error:error,
    })
  }
});
// get single data
app.get('/api/users/:id', async(req : Request, res : Response)=>{
  // const result = await pool;
  // const id = req.params.id;
  const {id} = req.params;
  // console.log(id);
  try {
    const result = await pool.query(`
      SELECT * FROM users WHERE id = $1
      `, [id]);

     if(result.rows.length === 0){
      res.status(500).json({
      success:false,
      message:"User not found!",
      data:{},
      })};

      console.log(result);
      res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
      data: result.rows[0],
    });
  } catch (error:any) {
        res.status(500).json({
      success:false,
      message:error.message,
      error:error,
    });
  }
  

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
// 7.8 start

// postgresql://neondb_owner:npg_s5fkG7AoNBVY@ep-quiet-surf-ap15ybnl.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
