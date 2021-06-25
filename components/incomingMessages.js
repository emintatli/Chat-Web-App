const IncomingMessages=(props)=>{

    if(props.user==="main"){

    return(
<>
               <div className="d-flex"> <div className="arrow-left"></div><li className="card main-users-message user-list mb-1 p-2">
                        {props.message}

                    </li></div>

</>


    )
    }
    else if(props.user==="other"){
        return(<>
         
            <div className="d-flex align-self-end">
            <li className="card other-users-message user-list mb-1 p-2">
            {props.message}
            </li><div className="arrow-right"></div>
                    </div>
        
                  
</>
)}


}

export default IncomingMessages;