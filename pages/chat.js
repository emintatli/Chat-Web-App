import ChatUser from "../components/chatUser"
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import IncomingMessages from "../components/incomingMessages"
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import ImageIcon from '@material-ui/icons/Image';
import { useRef,useState,useEffect } from "react";
import AlertDialog from "../components/dialog"
import { useRouter } from 'next/router'
import Router from 'next/router'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { io } from "socket.io-client";
import Image from 'next/image'
export async function getServerSideProps(context){
	const req= context.req;
return{
props:{
token:req.cookies.token||""
}
}
}
const Chat=(props)=>{
    const messagesEndRef = useRef(null)
    const mesaj_input=useRef();
    const kisi_ekle_id =useRef();
    const router = useRouter();
    const [message_bar_loading,setMessage_bar_loading]=useState(false);
    const [kisiEkleLoading,setKisiEkleLoading]=useState(false);
    const [userState,setUserState]=useState();
    const [messageList,setMessageList]=useState("");
    const [sideBar,setSidebar]=useState("");
    const [hedef,setHedef]=useState("");
  // SOCKET ---
    const socket = io("https://radiant-tor-19923.herokuapp.com");
    const [chat,setChat]=useState([{time:0}]);
    const [incoming,setIncoming]=useState();


    useEffect(()=>{
        socket.on("message",(msg)=>{setIncoming({message:msg.message,from:msg.from,time:msg.time})})
        if(incoming!==undefined){
            if(chat[chat.length-1].time!==incoming.time){
                setChat([...chat,incoming])
                console.log(chat)
                scrollToBottom();
                console.log(userState.username)
            }
            
        }
       
      },[socket])

      console.log(chat)
      
      const sendMessage=()=>{
        socket.emit("message",{target:hedef,message:mesaj_input.current.value,from:userState.username})
        console.log(`send mesage kısmı join:${hedef} mesaj:${mesaj_input.current.value}`)
        mesaj_input.current.value="";
      }
      const joinRoom=(value)=>{
          
        socket.emit("join",{target:value})
        console.log(`join kısmı :${value}`)
      }
      // SOCKET ---

    useEffect(()=>{
        if(props.token===""){
            
            router.push("/")
        }
        const asdasd=async()=>{
            const request =await fetch("/api/auth",{
              method:"GET",
            });
            const sonuc=await request.json();
            setUserState(sonuc)
            const sonuc_ek=sonuc.to_messages.map((value)=>{return{from:value.from,mesaj:value.message,time:value.time}});
            const sonuc_son_deger=sonuc_ek.sort((a, b) => parseFloat(b.time)-parseFloat(a.time));
            const sonuc_s=sonuc_son_deger.reduce((unique, o) => {
                if(!unique.some(obj => obj.from === o.from)) {unique.push(o);} return unique;},[]);
            console.log(sonuc_s)
            setSidebar(sonuc_s);
            // SOCKET 
            joinRoom(sonuc.username);
            // SOCKET
            
          }
          asdasd();
    },[]);

    const logoutHandler=async()=>{
       const request= await fetch("/api/auth",{
            method:"POST",
            body:JSON.stringify({type:"logout"})
        })
        const data =await request.json();
        console.log(data);
        router.push("/")
    }
    const sidebaruserOnclick=(event)=>{
       
       
       
        if(userState){
           
            setHedef(event.target.id);
            joinRoom(event.target.id);
            const ilgili_gelen_mesajlar=userState.from_messages.map((value)=>{
                if(event.target.id===value.to){
                    return {message:value.message,time:value.time,type:"other"}
                }
                else return null
            })
            const ilgili_giden_mesajlar=userState.to_messages.map((value)=>{
               if(event.target.id===value.from){
                return {message:value.message,time:value.time,type:"main"}
               }
               else return null
                    
    
            })
            console.log(userState)
            const ilgili_mesajlar=ilgili_gelen_mesajlar.concat(ilgili_giden_mesajlar);
            const ilgili_mesajlar_son=ilgili_mesajlar.filter((value)=>{return value!==null})
            const ilgili_mesajlar_son_n=ilgili_mesajlar_son.sort((a, b) => parseFloat(a.time)-parseFloat(b.time));
            setMessageList(ilgili_mesajlar_son_n)
            console.log(ilgili_mesajlar_son_n)
            
        }
       

    }
    const kisiEkleHandler=async()=>{
        if(kisi_ekle_id.current.value===""){return null}
        setKisiEkleLoading(true);
        const request=await fetch("/api/auth",{
            method:"POST",
            body:JSON.stringify({type:"send_message_request",from:userState.username,to:kisi_ekle_id.current.value})
        });
        Router.reload(window.location.pathname);
        setKisiEkleLoading(false);
    }
   
    const mesajGonderHandler=async()=>{
        setMessage_bar_loading(true);
        const request=await fetch("/api/auth",{
            method:"POST",
            body:JSON.stringify({type:"send_message",from:userState.username,to:hedef,message:mesaj_input.current.value})
        });
        const data=await request.json();
        if(data.message==="success"){
            
        setMessage_bar_loading(false);
        sendMessage();
        }
        else{
            console.log("error")
        }

        
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    
  
    return (<>{userState?<div className="h-1001 d-flex align-items-center justify-content-center">
        <div className="container card h-90 margin-0">
            <div className="card-body d-flex justify-content-center paddingstart-0 overflow-scroll user-overflow margin-0">
               
            <div className="card w-25 noborder border-end message-list sidebar-items">
            <div className="card d-flex flex-row noborder border-bottom align-items-center">
                    <div className="card-body d-flex align-items-center ">
                    <IconButton aria-label="change profile pic" className="">
                     
                    <Avatar alt="asdasd" src="" className="m-1"/> 

                      </IconButton><span className="fs-6">{userState.username}</span>
                      
                    </div>
                   
                    <AlertDialog title="Çıkış yap" desc="Çıkış yapmak istiyor musunuz?" yes={logoutHandler}/> 
                     
                </div>
                <div className="card d-flex flex-row noborder border-bottom align-items-center">
                    <div className="card-body d-flex align-items-center ">
                    <TextField id="kisi_ekle_id" inputRef={kisi_ekle_id} label="Kullanıcı adı" fullWidth={true}/>
                    <IconButton aria-label="add" onClick={kisiEkleHandler} disabled={kisiEkleLoading}>
                <PersonAddIcon />
                </IconButton>
                    </div>
                </div>
                <div className="card-body d-flex flex-column overflow-scroll user-overflow margin-0 m-1">
               
                {sideBar!==""&&sideBar.map((value)=>{
                    return<div id={value.from} key={Math.random()} onClick={sidebaruserOnclick}><ChatUser  name={value.from} mesaj={value.mesaj} id={value.from} src="/user.png"/></div>})}
               
           
            

                    </div>
            </div>{hedef!==""?<div className="w-100">
            <div className="text-field-menu card h-100 noborder ">
                <div className="card noborder border-bottom p-3 top-menu d-flex flex-row align-items-center top-menu-items">
                <Avatar alt="asdasd" src="" className="m-1 "/> <span className="fs-4 ms-2">{hedef}</span>
                </div>
                
                <div className="card-body d-flex flex-column message-list pattern">
                {messageList!==""&&messageList.map((value)=><IncomingMessages key={Math.random()} user={value.type} message={value.message}/>)}
                {!!chat&&chat.map((value)=>value.time!==0&&<IncomingMessages key={Math.random()} user={value.from===userState.username?"other":"main"}  message={value.message}/>)}
                
                <br/>
             <div ref={messagesEndRef}></div>
                </div>
            
            <div className="card top-menu noborder border-top message-menu">
                <div className={`card-body d-flex ${(hedef==="test1"||hedef===""||message_bar_loading)&&"disableddiv"}`}>
                <TextField id="standard-basic" inputRef={mesaj_input} label="Mesaj" fullWidth={true}/>
                <IconButton aria-label="delete" onClick={mesajGonderHandler}>
                <SendIcon />
                </IconButton>
               
                </div>
            </div>
            </div></div>:<div className="card-body d-flex justify-content-center align-items-center"><Image width="500px" height="500px" src="/back.svg"/></div>}
            </div>
        </div>
    </div>
:<><div className="h-1001 d-flex align-items-center justify-content-center">
<div className="container card justify-content-center align-items-center h-90">
    <div className="card-body d-flex justify-content-center align-items-center">
    <div className="spinner-border spinner-main" role="status">
        </div>
    </div>
</div>

</div>
</>}</>
    )


}
export default Chat;