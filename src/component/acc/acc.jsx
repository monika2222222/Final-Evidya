import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
export default function hero() {
            const [accounts, setaccounts] = useState([]);
            const [username, setusername] = useState('');
            const [password, setpassword] = useState('');
            const [message, setmessage] = useState('');
            const navigate=useNavigate();
            const staffusername='staff';
            const staffpass='12345';

            const createacc = () => {
                const existingacc = accounts.find(acc => acc.username === username);
                if (existingacc) {
                    setmessage('username already existed');
                }else if(username.trim()==='' || password.trim()===''){
                    setmessage('enter valid data');
                }
                 else {
                    setaccounts([...accounts, { username, password }]);
                    setmessage('account created successfully');
                }
                setusername('');
                setpassword('');
            };
            const signin=()=>{
                const account=accounts.find(acc=>acc.username === username && acc.password===password);
                if(account){
                    setmessage('sign in successful');
                    navigate('/Student')
                }else if(username=== staffusername && password=== staffpass){
                    navigate('/Staff')
                }else{
                    setmessage('invalid username or password');
                }
                setusername('');
                setpassword('');
            };

      

    
    return (
        <div>
            <div class="h-[10vh] flex w-full justify-between bg-slate-900">
                <div class="flex cursor-default">
                    <img class="h-[11vh] w-[5vw] my-auto ml-[2px]" src="https://i.ibb.co/vYhTFh4/E-Back-Logo.png" alt="E-Vidya" border="0" />
                    <h1 class="font-bold text-2xl my-auto text-white">E-Vidya</h1>
                </div>
                <div class="flex cursor-pointer">
                    <button class="font-semibold h-[5vh] w-[9vw] mr-[4px] my-auto text-center border-slate-100 border-[2px] transform transition-transform duration-150 active:scale-95 rounded-sm bg-slate-200">About Us <i class="fa-solid fa-users my-auto"></i></button>
                    <button class="font-semibold h-[5vh] w-[5vw] mr-[8px] my-auto text-center border-slate-100 border-[2px] transform transition-transform duration-150 active:scale-95 rounded-sm bg-slate-200">Help <i class="fa-solid fa-question my-auto"></i></button>
                </div>
            </div>
            <div class="flex justify-center h-[90vh] bg-[rgb(123,178,251)] w-full bg-[url('https://i.ibb.co/vYhTFh4/E-Back-Logo.png')] bg-contain bg-no-repeat bg-center">
                <div class="bg-[rgba(254,238,229,0.3)] backdrop-blur-[3px] rounded-lg m-auto justify-items-center grid h-[60vh] p-4 w-full min-[879px]:w-[30vw]">
                    <div class="my-auto">
                        <div class="text-center">
                            <div class="text-center text-[1.5rem] font-serif text-black ">Sign-in</div>
                            <div class="text-center mb-2 text-[1 rem] font-serif text-slate-900">useaccount</div>
                            <input
                                class="border-blue-500 border-[2px] rounded-[3px] h-10 w-52 min-[879px]:w-[17rem] text-center font-light"
                                placeholder="enter username" value={username} onChange={(e)=>setusername(e.target.value)} type="text"></input>
                            <p class="text-center min-[879px]:text-left text-xs font-serif mb-2"><a class="text-blue-800" href="abc">forget
                                username?</a>
                            </p>
                            <input
                                class="border-blue-500 border-[2px] rounded-[3px] h-10 w-52 min-[879px]:w-[17rem] text-center font-light"
                                placeholder="enter password" value={password} onChange={(e)=>setpassword(e.target.value)} type="password"></input>
                            <p class="text-center min-[879px]:text-left text-xs font-serif"><a class="text-blue-800" href="abc">forget password?</a>
                            </p>
                            <p class="text-center mt-2 text-xs font-serif">not your computer? use the <a
                                class="text-blue-800" href="abc">guest mode</a></p>
                           <button onClick={signin} class="block mx-auto mt-6 text-[0.8rem] text-center font-serif border-[1.5px] h-6 w-14 bg-blue-200 rounded-[3px] border-blue-500 transform transition-transform duration-150 active:scale-95">
                               submit </button>
                        </div>
                        <div>
                            <p class="text-center mt-8 text-xs font-serif">don't have any account?<button onClick={createacc} 
                                class="text-[0.8rem] text-blue-800 font-serif">create account</button></p>
                                <p class="text-center font-medium">{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}