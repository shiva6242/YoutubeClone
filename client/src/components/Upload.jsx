import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import app from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchSuccess } from "../redux/videoSlice";
// import { fetchSuccess } from "../redux/videoSlice";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 500px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;

  @media (max-width: 768px) {
    width: 80%;
    height: auto;
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 90%;
    height: auto;
    padding: 10px;
  }
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
  }
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  z-index: 999;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  z-index: 999;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Uploading = styled.label`
  font-size: 14px;
  z-index: 999;
  color: red;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
const Upload = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);
  const [uploadStart,setUploadStart]=useState('');

  const navigate = useNavigate();

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadStart("uploading started wait for few minutes... ");
    if (!video || !img || !title || !desc) {
      console.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('img', img);
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('Id', currentUser._id);
    formData.append('tags',tags);

    // Log formData entries
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post('http://localhost:8800/api/videos',formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response){
        setUploadStart("uploading finished")
        setOpen(false);
        navigate(`video/${response.data._id}`);
        dispatch(fetchSuccess(response.data))
      }
      
      // Handle success, for example, update state or navigate
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Desc placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
        <Input type="text" placeholder="Separate the tags with commas." onChange={handleTags} />
        <Label>Image:</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} required />
        <Uploading> {uploadStart} </Uploading>
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
