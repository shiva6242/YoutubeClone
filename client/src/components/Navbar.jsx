import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaVideo } from "react-icons/fa";
import LamaTube from "../img/logo.png";
import { FiMenu } from "react-icons/fi";
import Upload from "./Upload";
import { setSideBarOpen } from "../redux/sidebarSlice";
import { RiVideoUploadFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { logout } from "../redux/userSlice";


const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  z-index: 999;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const Search = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 10px;
  height:30%;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    width: 40%;
  }

  @media (max-width: 480px) {
    width: 35%;
    height: 30%;
  }
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`;

const Button = styled.button`
  padding: 5px 15px;
    padding: 2px 9px;
    background-color: transparent;
    border: 1px solid rgb(62, 166, 255);
    color: rgb(62, 166, 255);
    border-radius: 18px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    gap: 5px;
    font-size: 14px;

  @media (max-width: 768px) {
    padding: 5px 10px;
  }

  @media (max-width: 480px) {
    padding: 2px 8px;
    font-size: 9px;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  &:hover{
    cursor:pointer;
  }
  @media (max-width:730px){
  display:none;
  }

`;
const User1 = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  &:hover{
    cursor:pointer;
  }


`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 6.5px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    gap: 1px;
  }
`;

const Img = styled.img`
  height: 25px;

  @media (max-width: 768px) {
    height: 20px;
  }

  @media (max-width: 480px) {
    height: 16px;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;

  @media (max-width: 480px) {
    width: 26px;
    height: 22px;
  }
`;

const AvatarFrame = styled.span`
  width: 16px;
  height: 30px;
  border-radius: 45%;
  padding: 0px 9px;
  font-size: 23px;
  background-color: green;
  color: white;

  @media (max-width: 480px) {
    width: 10px;
        height: 19px;
        font-size: 16px;
        padding: 1px 7px;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 23px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Text = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const HiddenUser = styled.div`
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  position: absolute;
  top: 57px;
  right: 0px;
    color: ${({ theme }) => theme.text};
  background-color:${({ theme }) => theme.bgLighter};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width:180px;
  // @media (min-width: 730px) {
  //   display: none;
  // }
  @media (max-width:700px){
    width:110px;

  }
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size:16px;
  cursor: pointer;
  padding: 7px 0px;

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
const Anchor=styled.a`
  textDecoration:none;
   color: "inherit" 
`

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [showIcon, setShowIcon] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyTimer = () => {
      const newTimer = new Date().getHours();
      if (newTimer <= 18 && newTimer >= 0) {
        setShowIcon(true);
      } else {
        setShowIcon(false);
      }
    };
    verifyTimer();
  }, [showIcon]);

  const handleSideBar = () => {
    dispatch(setSideBarOpen());
  };

  const toggleUser = () => {
    setShowUser((prev) => !prev);
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Logo>
            <Menu>
              <FiMenu onClick={handleSideBar} />
            </Menu>
            <Img src={LamaTube} />
            <Text>YouTube</Text>
          </Logo>
          <Search>
            <Input placeholder="Search" onChange={(e) => setQ(e.target.value)} />
            <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)} />
          </Search>
          {currentUser ? (
            <>
              <User>
                {showIcon && (
                    
                      <a href="/videocall" style={{ textDecoration: "none", color: "inherit" }}>
                        <Menu>
                      <FaVideo />
                      </Menu>
                      </a>
                   
                  
                )}
              </User>
              <User>
               <Menu>
                 <RiVideoUploadFill onClick={() => setOpen(true)} />
               </Menu>
               </User>
               <User1>
                {currentUser.img ? (
                  <Avatar src={currentUser.img} onClick={toggleUser} />
                ) : (
                  <AvatarFrame onClick={toggleUser}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFrame>
                )}
                <Text>{currentUser.name}</Text>
              </User1>
              <HiddenUser show={showUser}>
              <Anchor href="/videocall" style={{ textDecoration: "none", color: "inherit" }}>

                <Item>
                  <FaVideo />
                  
                  Vedio call
                </Item>
                </Anchor>
                <Item onClick={() => setOpen(true)}>
                <RiVideoUploadFill />
                Vedio upload
                </Item>
                <Item onClick={()=>dispatch(logout())} >
                <FiLogOut />
                Sign out
                </Item>
              </HiddenUser>
            </>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
