import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2.5;
`;

const Recommendation = ({ tags }) => {
  const [videos, setVideos] = useState([]);
  console.log(tags)

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`http://localhost:8800/api/videos/tags?tags=${tags}`);
      setVideos(res.data);
      console.log(res)
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;
