import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LamaTube from "../img/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
const Container = styled.div`
     position: absolute;
    top: 37px;
    padding: 10px 20px;
    float: left;
    width: 180px;
    border-radius: 20px;
    box-shadow: 30px;
    overflow: hidden;
    visibility: visible;
    opacity: 1;
    transition: all 0.2s ease-in-out 0s;
    z-index: 50;
  color: ${({ theme }) => theme.text};
  background-color:${({ theme }) => theme.bgLighter};



  @media (max-width: 800px){
      width:140px
  }
  @media (max-width: 480px){
      width:110px
  }
`;
// const Logo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 5px;
//   font-weight: bold;
//   margin-bottom: 25px;

//   @media (max-width: 768px) {
//     font-size: 16px;
//     margin-bottom: 15px;
//   }
// `;

// const Img = styled.img`
//   height: 25px;

//   @media (max-width: 768px) {
//     height: 20px;
//   }
// `;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 7px 0px;
  font-size:16px;
  &:hover {
    background-color: ${({ theme }) => theme.soft};
  }

  @media (max-width: 768px) {
    gap: 8px;
    padding: 3px 0px;
  }
   @media (max-width: 800px){
      font-size:13px
  }
  @media (max-width: 480px){
      font-size:10px
  }
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};

  @media (max-width: 768px) {
    margin: 10px 0px;
  }
`;

const Login = styled.div`
  font-size:16px;

  @media (max-width: 800px){
      font-size:13px
  }
  @media (max-width: 480px){
      font-size:10px
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;

  @media (max-width: 768px) {
    padding: 4px 12px;
    font-size: 13px;
  }
  @media (max-width: 768px) {
   padding: 3px 8px;
  font-size: 10px;
  }
`;

const Title = styled.h2`
  font-size: 13px;
  font-weight: 500;
  color: #aaaaaa;
  margin-bottom: 20px;
  padding: 5px;

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 15px;
  }
`;

const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector((state) => state.user);
  const sidebarOpen=useSelector((state)=>state.sidebar);
  const [sideOpen,setSideOpen]=useState(true);

  const dispatch=useDispatch();
  useEffect(()=>{
    setSideOpen(!sideOpen)
  },[sidebarOpen])
  return (
    <Container>

    
      {
           sideOpen === true?<>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Item>
              <HomeIcon />
              Home
            </Item>
            </Link>
            <Link to="trends" style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                <ExploreOutlinedIcon />
                Explore
              </Item>
            </Link>
            <Link
              to="subscriptions"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Item>
                <SubscriptionsOutlinedIcon />
                Subscriptions
              </Item>
            </Link>
            <Hr />
            <Item>
              <VideoLibraryOutlinedIcon />
              Library
            </Item>
            <Item>
              <HistoryOutlinedIcon />
              History
            </Item>
            <Hr />
            {!currentUser ?
              <>
                <Login>
                  Sign in to like videos, comment, and subscribe.
                  <Link to="signin" style={{ textDecoration: "none" }}>
                    <Button>
                      <AccountCircleOutlinedIcon />
                      SIGN IN
                    </Button>
                  </Link>
                </Login>
                <Hr />
              </>:<>
              <Login>
                    <Button onClick={()=>dispatch(logout())}>
                      SIGN OUT
                    </Button>
                </Login>
              </>
            }
            <Title>BEST OF YOUTUBE</Title>
            <Item>
              <LibraryMusicOutlinedIcon />
              Music
            </Item>
            <Item>
              <SportsBasketballOutlinedIcon />
              Sports
            </Item>
            <Item>
              <SportsEsportsOutlinedIcon />
              Gaming
            </Item>
            <Item>
              <MovieOutlinedIcon />
              Movies
            </Item>
           
            <Item onClick={() => setDarkMode(!darkMode)}>
              <SettingsBrightnessOutlinedIcon />
              {darkMode ? "Light" : "Dark"} Mode
            </Item>
            </>:""
            }

    </Container>
  );
};

export default Menu;
