import Link from 'next/link'
import { useRef,useState } from 'react'
import CustomizedSnackbars from "../components/alert"
import Image from 'next/image'
export default function Kayit() {
  const kullanici_adi=useRef();
  const kullanici_sifre=useRef();
  const [loading,SetLoading]=useState(false);
  const buttonloading=<div className="spinner-grow spinner-grow-sm text-info" role="status"></div>
  const [durum,setDurum]=useState(<></>);
  const registerHandler=async()=>{
    if(kullanici_adi.current.value===""||kullanici_sifre.current.value===""){
      setDurum(<CustomizedSnackbars type="error" text="Boş alanları doldurunuz"/>)
      return null
    }
    SetLoading(true);
    const request =await fetch("/api/auth",{
      method:"POST",
      body:JSON.stringify({type:"register",username:kullanici_adi.current.value,password:kullanici_sifre.current.value})
    });
    const sonuc=await request.json();
    if(sonuc.message==="success"){
      setDurum(<CustomizedSnackbars type="success" text="Hesap oluşturuldu"/>)
    }
    else if (sonuc.message==="user exists"){
      setDurum(<CustomizedSnackbars type="error" text="Kullanıcı adı kayıtlı"/>)
    }
    else{
      setDurum(<CustomizedSnackbars type="error" text="Beklenmeyen bir hata oluştu"/>)
    }
    SetLoading(false);
    
  }



  return (
    <>
    
    <div className="d-flex flex-column justify-content-center align-items-center a-100 cursor1">
    <Image src="/back.svg" width="100px" height="100px" className="mb-2"/>
    {durum}
    <div className="card mt-2">
      <div className="card-body m-3 d-flex flex-column">
        <p className="fs-3">Kayit ol</p>
        <input ref={kullanici_adi} type="text" className="form-control" placeholder="Kullanıcı adı"></input>
        <input ref={kullanici_sifre} type="password" className="form-control mt-1" placeholder="Şifre"></input>
        <p>Hesabınız var mı ? <Link href="/"><u>Giriş Yap</u></Link></p> 
        <button type="button" onClick={registerHandler} className={`btn btn-outline-secondary mt-1 align-self-end ${loading&&"disabled"}`}>{loading?buttonloading:"Kayit ol"}</button>
       
      </div>
      
    </div>
    
    </div>
    
    </>
  )
}
