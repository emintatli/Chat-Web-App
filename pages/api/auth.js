const { MongoClient } = require("mongodb");
import { sha256 } from 'js-sha256';
import cookie from "cookie"
const mongo_url_main ="mongodb_AUTH_URL";
function tokenHandler(email,password){
  
    const date=Date.now()
    const secretKey="secret"; 
    const longText=date.toString()+secretKey+email+password;
    const token=sha256(longText);
    return token; 

  
  
  
  
}
export default async function handler(req, res) {
  if(req.method==="POST"){
    
    const request_data=JSON.parse(req.body)
    const client = new MongoClient(mongo_url_main, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // REGİSTER START
    if(request_data.type==="register"){
      try{
        await client.connect();
        const database = client.db("chat_app");
        const collection = database.collection("users");
        const doc={
          username:request_data.username,
          password:request_data.password,
          token:"",
        }
        const exist_user = await collection.findOne({username:request_data.username});
        if(!exist_user){
          const result = await collection.insertOne(doc);
          res.status(200).json({ message:"success" })
        }
        else{
          res.status(400).json({ message:"user exists" })
        }
        
      }
      catch(error){
        res.status(500).json({ message:error })
      }
      finally{
        await client.close();
      }


    }
     // REGİSTER END

     //LOGİN START
     else if(request_data.type==="login"){
       try{
         const token=tokenHandler(request_data.username,request_data.password)
      await client.connect();
      const database = client.db("chat_app");
      const collection = database.collection("users");
      const exist_user = await collection.findOne({username:request_data.username,password:request_data.password});
     
      if(exist_user){
        const updateDoc = {
          $set: {
            token:token
        }};
        
        const result = await collection.updateOne(exist_user, updateDoc);
        res.setHeader("Set-Cookie",cookie.serialize("token",token,
        {httpOnly:true,
          secure:process.env.NODE_ENV!=="development", //https
          maxAge:60*60, // timeout
          sameSite:"strict",
          path:"/",
        }))
        res.status(200).json({ message:"success"})
    }
      else{
        res.status(400).json({ message:"error" })
      }
     }
    
    catch(error){
      res.status(400).json({ message:"errorüü" })
    }
    finally{
      await client.close();
    }
  }
//LOGİN END
//LOGOUT START
if(request_data.type==="logout"){
  res.setHeader("Set-Cookie",cookie.serialize("token","",
  {httpOnly:true,
    secure:process.env.NODE_ENV!=="development", //https
    maxAge:1, // timeout
    sameSite:"strict",
    path:"/",
  }))

  res.status(200).json({message:"logged out"})
}
//LOGOUT END
// SEND MESSAGE START
if(request_data.type==="send_message"){
const main_user=request_data.from;
const target_user=request_data.to;
const message=request_data.message;
try{
await client.connect();
const database = client.db("chat_app");
const collection = database.collection("users");
const exist_user = await collection.findOne({token:req.cookies.token});
if(exist_user&&exist_user.username===main_user){
  const collection2 = database.collection("messages");
  const result = await collection2.insertOne({
    time:Date.now(),
    message:message,
    to:target_user,
    from:main_user
  });
  res.status(200).json({ message:"success" })
}
else{
  res.status(400).json({ message:"yetkisiz işlem" })
}
}
catch(error){
  res.status(400).json({ message:"errorüü" })
}
finally{
  await client.close();
}

}
else if(request_data.type==="send_message_request"){
  const main_user=request_data.from;
  const target_user=request_data.to;
  try{
  await client.connect();
  const database = client.db("chat_app");
  const collection = database.collection("users");
  const exist_user = await collection.findOne({token:req.cookies.token});
  if(exist_user&&exist_user.username===main_user){
    const collection2 = database.collection("messages");
    const result = await collection2.insertOne({
      time:Date.now(),
      message:`Merhaba ${main_user} !`,
      to:main_user,
      from:target_user
    });
    const result2 = await collection2.insertOne({
      time:Date.now(),
      message:`Merhaba ${target_user} !`,
      to:target_user,
      from:main_user
    });
    res.status(200).json({ message:"success" })
  }
  else{
    res.status(400).json({ message:"yetkisiz işlem" })
  }
  }
  catch(error){
    res.status(400).json({ message:"errorüü" })
  }
  finally{
    await client.close();
  }
}
// SEND MESSAGE END

  }

// AUTH START
if(req.method==="GET"){
  
  const client = new MongoClient(mongo_url_main, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try{
    await client.connect();
    const database = client.db("chat_app");
    const collection = database.collection("users");
    const user = await collection.findOne({token:req.cookies.token});
    const collection2 = database.collection("messages");
    const from_messages = await collection2.find({from:user.username}).toArray().then((a)=>a);
    const to_messages=await collection2.find({to:user.username}).toArray().then((a)=>a);
    res.status(200).json({username:user.username,from_messages:from_messages,to_messages:to_messages})
}
catch(error){
  console.log(error.toString())
}

}


}
