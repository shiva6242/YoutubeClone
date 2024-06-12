import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import RecordRTC from 'recordrtc';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:8800');

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  position: relative;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: ${props => (props.large ? '60%' : '22%')};
  max-width: ${props => (props.large ? '500px' : '300px')};
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  transition: width 0.3s ease, max-width 0.3s ease;

  @media (max-width: 768px) {
    width: ${props => (props.large ? '100%' : '40%')};
    max-width: 100%;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
  }
`;

const Video = styled.video`
  width: 100%;
  height: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

const UserList = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px;
`;

const UserListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 5px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border: 1px solid #ddd;
  border-radius: 5px;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const Notification = styled.div`
  display: ${props => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const NotificationText = styled.p`
  margin-bottom: 10px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const NotificationButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  font-size: 1rem;
  color: white;
  background-color: ${props => (props.isAccept ? '#28a745' : '#dc3545')};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.isAccept ? '#218838' : '#c82333')};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.75rem;
  }
`;

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [yourID, setYourID] = useState('');
  const [users, setUsers] = useState({});
  const [screenSharing, setScreenSharing] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [presentCaller,setPresentCaller]=useState("")
  const userVideoRef = useRef();
  const partnerVideoRef = useRef();
  const connectionRef = useRef();

  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (!currentUser) {
        return;
    }
      

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    });

    socket.on('yourID', (id) => {
      setYourID(id);
      // Send user details to the server
      socket.emit('userDetails', { id, name: currentUser.name });
    });

    socket.on('allUsers', (users) => {
      setUsers(users);
    });

    socket.on('hey', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setPresentCaller(data.name);
      setCallerSignal(data.signal);
    });
  }, [currentUser]);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: yourID,
        name: currentUser.name,
      });
    });

    peer.on('stream', (stream) => {
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = stream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('acceptCall', { signal: data, to: caller });
    });

    peer.on('stream', (stream) => {
      if (partnerVideoRef.current) {
        partnerVideoRef.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const rejectCall = () => {
    setReceivingCall(false);
    setCaller('');
    setPresentCaller('')
    setCallerSignal(null);
    socket.emit('rejectCall', { to: caller });
  };

  const endCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit('endCall', { to: caller });
    window.location.reload();
  };

  const startScreenShare = () => {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((screenStream) => {
      const screenTrack = screenStream.getTracks()[0];
      connectionRef.current.replaceTrack(
        connectionRef.current.streams[0].getVideoTracks()[0],
        screenTrack,
        connectionRef.current.streams[0]
      );
      setScreenSharing(true);
      screenTrack.onended = () => stopScreenShare();
    });
  };

  const stopScreenShare = () => {
    const videoTrack = stream.getTracks().find((track) => track.kind === 'video');
    connectionRef.current.replaceTrack(
      connectionRef.current.streams[0].getVideoTracks()[0],
      videoTrack,
      connectionRef.current.streams[0]
    );
    setScreenSharing(false);
  };

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
      });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const recorder = new RecordRTC(combinedStream, {
        type: 'video',
        mimeType: 'video/webm',
      });

      recorder.startRecording();
      setRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Error in startRecording:", err);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recording.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
      setRecording(false);
    }
  };

  return (
    <Container>
      <Title>Video Call App</Title>
      <VideoContainer>
       {
        currentUser? <VideoWrapper large={!callAccepted || callEnded}>
        <Video playsInline muted ref={userVideoRef} autoPlay />
      </VideoWrapper>:<p style={{color:'red', fontSize:'2rem'}}>please login to enjoy video call feature </p>
       }
        {callAccepted && !callEnded && (
          <VideoWrapper large={true}>
            <Video playsInline ref={partnerVideoRef} autoPlay />
          </VideoWrapper>
        )}
      </VideoContainer>
      <ButtonContainer>
        {receivingCall && !callAccepted && (
          <Notification show={receivingCall}>
            <NotificationText>Your friend {presentCaller} is calling</NotificationText>
            <NotificationButton isAccept onClick={acceptCall}>
              Accept
            </NotificationButton>
            <NotificationButton onClick={rejectCall}>Reject</NotificationButton>
          </Notification>
        )}
        {callAccepted && !callEnded && (
          <>
            {!screenSharing ? (
              <Button onClick={startScreenShare}>Share Screen</Button>
            ) : (
              <Button onClick={stopScreenShare}>Stop Screen Share</Button>
            )}
            {!recording ? (
              <Button onClick={startRecording}>Start Recording</Button>
            ) : (
              <Button onClick={stopRecording}>Stop Recording</Button>
            )}
            <Button onClick={endCall}>End Call</Button>
          </>
        )}
        <UserList>
          {currentUser&&!callAccepted&&Object.keys(users).map((key) => {
            if (key === yourID) {
              return null;
            }
            return (
              <UserListItem key={key}>
                <p style={{padding:"10px 10px"}}>{users[key].name}</p>
                <Button onClick={() => callUser(key)}>Call</Button>
              </UserListItem>
            );
          })}
        </UserList>
      </ButtonContainer>
    </Container>
  );
};

export default VideoCall;
