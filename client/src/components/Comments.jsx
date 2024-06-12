import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import { IoMdSend } from "react-icons/io";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button=styled.div`
  display: flex;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const AvatarFrame=styled.span`
    width: 18px;
    height: 36px;
    border-radius: 50%;
    padding: 7px 16px;
    font-size: 30px;
    background-color: green;
    color: white;
`
const Comments = ({videoId}) => {

  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [newComment,setNewComment]=useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  //TODO: ADD NEW COMMENT FUNCTIONALITY
  const handleComment=async()=>{
    console.log(newComment,videoId,currentUser)
    try {
      await axios.post('/comments',{videoId,newComment,currentUser})
    } catch (error) {
      console.log(error)
    }
    console.log('buttn clicked')
  }

  return (
    <Container id="comments-section">
      <NewComment>
       {currentUser&& currentUser.img ? (<Avatar src={currentUser.img} />):(currentUser&&<AvatarFrame>{currentUser.name.charAt(0).toUpperCase()}</AvatarFrame>)}
        <Input placeholder="Add a comment..." onChange={(e)=>setNewComment(e.target.value)}/>
        <Button><IoMdSend style={{width:'40px',height:'30px',}} onClick={handleComment} /></Button>
      </NewComment>
      {comments.map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;
