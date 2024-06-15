import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import { useSelector } from "react-redux";
import VideoCall from "./components/VideoCall";

const Container = styled.div`
  display: flex;
  flex-direction: column; // Default to column direction for better stacking on small screens
  
  @media (min-width: 768px) {
    flex-direction: row; // Switch to row direction for larger screens
  }
`;

const Main = styled.div`
  flex: 1; // Let Main take up full width on small screens
  background-color: ${({ theme }) => theme.bg};
  
  @media (min-width: 768px) {
    flex: 7; // Revert to flex 7 on larger screens
  }
`;

const Wrapper = styled.div`
  padding: 22px 15px; // Adjust padding for smaller screens
  
  @media (min-width: 768px) {
    padding: 22px 30px; // Apply larger padding on larger screens
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignIn />}
                  />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
                <Route path="videocall" element={<VideoCall/>}/>

              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
