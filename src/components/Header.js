import React from 'react'
import styled from 'styled-components'
import { useEffect } from 'react';
import {signInWithPopup,signOut,onAuthStateChanged} from 'firebase/auth';
import {auth,provider} from './firebase';
import {useDispatch,useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { setUserLoginDetails,selectUserName,selectUserPhoto, setSignOutState } from "../features/user/userSlice";
// import { Dropdown } from '@carbon/react';
function Header(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(user)
                navigate('/home')
            }
        })
    },[userName])
    const signInWithGoogle = () =>{
        if(!userName){
            signInWithPopup(auth,provider).then((result)=>{
            setUser(result.user);
            }).catch((error)=>{
            console.log(error)
            })
        }else if(userName){
            signOut(auth).then(()=>{
                dispatch(setSignOutState())
                navigate('/')
            }).catch((err)=>alert(err.message));
        }
    };
    const setUser = (user) =>{
        dispatch(
            setUserLoginDetails({
                name:user.displayName,
                email:user.email,
                photo:user.photoURL,
            })
        );
    }
    return (
    <Nav>
        <Logo>
            <img src="/images/logo.svg" alt=""/>
        </Logo>

        {!userName ? (
            <Login onClick = {signInWithGoogle}>LOGIN</Login>
            ):(
            <>
        <NavMenu>
            <a href='/home'>
                <img src='/images/home-icon.svg'/>
                <span>HOME</span>
            </a>
            <a>
                <img src='/images/search-icon.svg'/>
                <span>SEARCH</span>
            </a>
            <a>
                <img src='/images/watchlist-icon.svg'/>
                <span>WATCHLIST</span>
            </a>
            <a>
                <img src='/images/original-icon.svg'/>
                <span>ORIGINALS</span>
            </a>
            <a>
                <img src='images/movie-icon.svg'/>
                <span>MOVIES</span>
            </a>
            <a>
                <img src='images/series-icon.svg'/>
                <span>SERIES</span>
            </a>
        </NavMenu>
        <SignOut>
        <UserImg src={userPhoto} />
        <DropDown>
            <span onClick={signInWithGoogle}>SignOut</span>
        </DropDown>
        </SignOut>
        </>)
        }
        {/* <Login onClick={signInWithGoogle}>LOGIN</Login> */}
    </Nav>
  )
}
const Nav = styled.nav`
    position:fixed;
    top:0;
    left:0;
    right:0;
    height:70px;
    background-color:#090b13;
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:0 36px;
    letter-spacing:16px;
    z-index:3;

`;

const Logo = styled.a`
    padding:0;
    width:80px;
    margin-top:4px;
    max-height:70px;
    font-size:0;
    display:inline-block;
    img{
        display:block;
        width:100%;
    }
`;
const NavMenu = styled.div`
    align-items:center;
    display:flex;
    flex-flow:row nowrap;
    height:100%;
    justify-content:flex-end;
    margin:0px;
    padding:0px;
    position:relative;
    margin-right:auto;
    margin-left:25px;
    a{
        display:flex;
        padding:0 12px;

        img{
            height:20px;
            mid-width:20px;
            width:20px;
            z-index:auto;
        }
        span{
            color:rgb(249,249,249);
            font-size:13px;
            letter-spacing:1.42px;
            line-height:1.08;
            padding:2px 2px;
            position:relative;
        
            &:before{
                background-color:rgb(249,249,249);
                border-radius:0px 0px 4px 4px;
                bottom:-5px;
                content:"";
                left:0px;
                height:2px;
                position:absolute;
                right:0px;
                transform:scaleX(0);
                transition:all 250ms cubic-bezier(0.25,0.46,0.45,0.94) 0s;
            }
        }
        &:hover{
            span:before{
                transform: scaleX(1);
                visibility:visible;
                opacity: 1 !important;
            }
        }
    }
    @media(max-width:768px){
        display:none;
    }
`;

const Login = styled.a`
    border : 1px solid rgb(249,249,249);
    letter-spacing:1.42px;
    padding:8px 16px;
    border-radius:4px;
    transitin:all 0.2s ease 0s;
    &:hover{
        background-color:rgb(249,249,249);
        color:#040714;
    }
`;

const UserImg = styled.img`
    height:100%;
    

`;

const DropDown = styled.div`
    position:absolute;
    top:48px;
    right:0px;
    background:rgb(19,19,19);
    border:1px solid rgba(151,151,151,0.34);
    border-radius:4px;
    box-shadow:rgb(0 0 0 / 50%) 0px 0px 18px 0px;
    padding:10px;
    font-size:14px;
    letter-spacing:3px;
    width:100px;
    opacity:0;
`;
const SignOut = styled.div`
    position:relative;
    height:48px;
    width:48px;
    display:felx;
    cursor:pointer;
    align-items:center;
    justify-content:center;

    ${UserImg}{
        border-radius:50%;
        width:100%;
        height:100%;
    }
    &:hover{
        ${DropDown}{
            opacity:1;
            transition-duration:1s;
        }
    }
`;
export default Header