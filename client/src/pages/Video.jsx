import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column; // Default to column for small screens

  @media (min-width: 768px) {
    flex-direction: row; // Row direction for larger screens
  }
`;

const Content = styled.div`
  flex: 5;
  width: 100%;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 5px;
  z-index: 0;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};

  @media (max-width: 780px) {
    font-size: 16px;
  }
    @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;

  @media (min-width: 500px) {
    flex-direction: row;
  }
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};  
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;

  @media (max-width: 780px) {
    font-size: 10px;
    padding-bottom:5px;
  }
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 25px;
  cursor: pointer;
 
  @media (max-width: 780px) {
    padding: 8px 16px;
     width:120px;
  }
`;

const VideoFrame = styled.video`
  max-height: 400px;
  width: 100%;
  object-fit: cover;
`;

const Popup = styled.div`
  position: absolute;
  top: 50px;
  right: 0px;
  background-color: rgba(63, 237, 161, 0.53);
  border: 1px solid #ccc;
  padding: 10px 10px;
  border-radius: 3px;
  z-index: 10;
  box-shadow: 0 0 10px rgba(0, 100, 100, 0.1);
  display: ${({ show }) => (show ? "block" : "none")};
  width:225px;
   @media (max-width:780px){
    width:160px;    
  }
  @media (max-width:480px){
     width:110px;
  }
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.text};
  padding: 10px;
  border-radius: 5px;
`;

const SettingsButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SettingsMenu = styled.div`
  color: ${({ theme }) => theme.text};
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: ${({ show }) => (show ? "block" : "none")};
  margin-top: 2px;
  width: 100%;

  @media (min-width: 768px) {
    width: 20%;
  }
`;

const MenuItem = styled.div`
  margin-bottom: 4px;
  padding: 2px 0;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  &:hover {
    color: #007bff;
  }
`;

const QualityOptions = styled.div`
  display: ${({ show }) => (show ? "block" : "none")};
`;

const QualityOption = styled.div`
  padding: 4px 0;
  cursor: pointer;

  &:hover {
    color: blue;
  }
`;

const SpeedOptions = styled.div`
  display: ${({ show }) => (show ? "block" : "none")};
`;

const SpeedOption = styled.div`
  padding: 4px 0;
  cursor: pointer;

  &:hover {
    color: blue;
  }
`;

const BackButton = styled.div`
  padding: 4px 0;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    color: blue;
  }
`;

const AvatarFrame = styled.span`
  width: 16px;
  height: 40px;
  border-radius: 50%;
  padding: 0px 10px;
  font-size: 33px;
  background-color: green;
  color: white;
`;
const PopupPara=styled.p`
  font-size:20px;
  padding:10px;
  @media (max-width:780px){
     font-size:15px;
     padding:7px;
  }
  @media (max-width:480px){
     font-size:10px;
     padding:5px;
  }
`


const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const path = useLocation().pathname.split("/")[2];
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const doubleTapRef = useRef({ lastTap: 0, timeout: null });
  const speedRef = useRef(1); // Initialize speedRef with 1 (normal speed)
  const tapTimeoutRef = useRef(null);

  const [channel, setChannel] = useState({});
  const [currentQuality, setCurrentQuality] = useState('');
  const [mouseHold, setMouseHold] = useState(false); // Define mouseHold state
  const [mousePosition, setMousePosition] = useState(null);
  const [tapCount, setTapCount] = useState(0);
  const [currentOption,setcurrentOption]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityOptions, setShowQualityOptions] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.put(`http://localhost:8800/api/videos/view/${path}`)
        const videoRes = await axios.get(`http://localhost:8800/api/videos/find/${path}`);
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
        setCurrentQuality(videoRes.data.videoUrl[0].url);
      } catch (err) {
        console.error("Error fetching video or channel data", err);
      }
    };
    fetchData();
  }, [path, dispatch]);

  const handleLike = async () => {
    try {
      await axios.put(`/users/like/${currentVideo._id}`);
      dispatch(like(currentUser._id));
    } catch (err) {
      console.error("Error liking the video", err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.put(`/users/dislike/${currentVideo._id}`);
      dispatch(dislike(currentUser._id));
    } catch (err) {
      console.error("Error disliking the video", err);
    }
  };

  const handleSub = async () => {
    try {
      if (currentUser.subscribedUsers.includes(channel._id)) {
        await axios.put(`/users/unsub/${channel._id}`);
      } else {
        await axios.put(`/users/sub/${channel._id}`);
      }
      dispatch(subscription(channel._id));
    } catch (err) {
      console.error("Error subscribing/unsubscribing to the channel", err);
    }
  };
  const handleCurrentOption=(url)=>{
    setcurrentOption(url)
    setTimeout(()=>{
      setcurrentOption("");
    },1500);
  }
  const handleMouseDown = (event) => {
    setMouseHold(true);
    setMousePosition(event.clientX);
    speedRef.current = 1;
  };

  const handleMouseUp = () => {
    setMouseHold(false);
    videoRef.current.playbackRate = 1;
    speedRef.current = 1;
  };

  const handleDoubleClick = (event) => {
    event.preventDefault();

    const currentTime = new Date().getTime();
    const tapLength = currentTime - doubleTapRef.current.lastTap;

    if (tapLength < 300 && tapLength > 0) {
      if (!videoRef.current) return;

      const rect = videoRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const middle = rect.width / 2;

      if (x < middle) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        handleCurrentOption("10 secs backward");
      } else {
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
       handleCurrentOption("10 seconds forward");
      }
    }

    doubleTapRef.current.lastTap = currentTime;
  };

  useEffect(() => {
    let timeoutId;
    if (mouseHold) {
      timeoutId = setTimeout(() => {
        const rect = videoRef.current.getBoundingClientRect();
        const x = mousePosition - rect.left;
        const middle = rect.width / 2;
        if(x<middle)
          handleCurrentOption("speed 0.25x");
        else
          handleCurrentOption("speed 2x");
        videoRef.current.playbackRate = x < middle ? 0.25 : 2;
      }, 1000); // 2 second delay
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mouseHold, mousePosition]);


  const handleQualityChange = (url,quality) => {
    setShowQualityOptions(false);
    setCurrentQuality(url);
    handleCurrentOption(` quality ${quality}`);
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      videoRef.current.src = `http://localhost:8800${url}`;
      videoRef.current.onloadeddata = () => {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
      };
    }
  };
  
  const handleVideoClick = async (event) => {
    const rect = videoRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const middle = rect.width / 3;
    const twoThirds = (rect.width / 3) * 2;
    if (x > rect.width - 30 && y < 100) {
      // Fetch location and weather data
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = '9500076e32460171cf528aef12343d5f';
        console.log(latitude,longitude);
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);


        setLocationData({
          city: weatherRes.data.name,
          temperature: weatherRes.data.main.temp,
        });
        console.log(weatherRes.data.name,)
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);

        }, 3000); // Hide the popup after 5 seconds
      });
    }

    setTapCount((prevCount) => prevCount + 1);
  
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 500);

    if (tapCount === 2 && x < middle) {
      document.querySelector("#comments-section").scrollIntoView({ behavior: "smooth" });
      setTapCount(0);
      return;
    }

    if (tapCount === 2 && x > twoThirds) {
      navigate('/');
      setTapCount(0);
      return;
    }

    if (tapCount === 1 && x >= middle && x <= twoThirds) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - doubleTapRef.current.lastTap;
  
      if (tapLength < 300 && tapLength > 0) {
        const res = await axios.get(`/videos/random`);
        const randomInt = Math.floor(Math.random() * res.data.length);
        navigate(`/video/${res.data[randomInt]._id}`);
        setTapCount(0);
      }
  
      doubleTapRef.current.lastTap = currentTime;
    }
    
    
    if (x >= middle && x <= twoThirds) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        handleCurrentOption("video playing")
      } else {
        videoRef.current.pause();
        handleCurrentOption("video paused")

      }
    }
  };

  useEffect(() => {
    if (videoRef.current && !isNaN(playbackSpeed)) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);



  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedOptions(false);
    handleCurrentOption(`Speed: ${speed}x`);
  };

  const handleBackButtonClick = () => {
    setShowQualityOptions(false);
    setShowSpeedOptions(false);
  };
  
  if (!currentVideo) {
    return <div>Loading...</div>;
  }

  return (
    < Container>
      <Content>
        <VideoWrapper onClick={handleDoubleClick}>
          <TextOverlay>{currentOption}</TextOverlay>
          <VideoFrame
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleVideoClick}
            ref={videoRef}
            src={`http://localhost:8800${currentQuality}`}
            controls
          />
        </VideoWrapper>
        <Popup show={showPopup}>
          <PopupPara>Location: {locationData.city}</PopupPara>
          <PopupPara>Temperature: {locationData.temperature}°C</PopupPara>
        </Popup>
        <SettingsButton onClick={() => setShowSettings(!showSettings)}>Settings</SettingsButton>
          <SettingsMenu show={showSettings}>
            {showQualityOptions || showSpeedOptions ? (
              <BackButton onClick={handleBackButtonClick}>Back</BackButton>
            ) : (
              <>
                <MenuItem onClick={() => setShowQualityOptions(!showQualityOptions)}>Quality</MenuItem>
                <MenuItem onClick={() => setShowSpeedOptions(!showSpeedOptions)}>Playback Speed</MenuItem>
              </>
            )}
            <QualityOptions show={showQualityOptions}>
              {currentVideo.videoUrl.map((video) => (
                <QualityOption key={video.quality} onClick={() => handleQualityChange(video.url,video.quality )}>
                  {video.quality}
                </QualityOption>
              ))}
            </QualityOptions>
            <SpeedOptions show={showSpeedOptions}>
              {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                <SpeedOption key={speed} onClick={() => handlePlaybackSpeedChange(speed)}>
                  {speed}x
                </SpeedOption>
              ))}
            </SpeedOptions>
          </SettingsMenu>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views • {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}{" "}
              Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            {
              channel.img ? (<Image src={channel.img} />):(channel.name&&<AvatarFrame>{channel.name.charAt(0).toUpperCase()}</AvatarFrame>)
            }
            
            <ChannelDetail>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <Description>{currentVideo?.desc}</Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? "SUBSCRIBED"
              : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation tags={currentVideo?.tags} />
    </Container>
  );
};

export default Video;
