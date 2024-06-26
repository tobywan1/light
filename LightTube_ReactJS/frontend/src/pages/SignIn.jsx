import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    dispatch(loginStart());
    e.preventDefault();
    try {
      const user = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { name, password },
        { withCredentials: true }
      );
      dispatch(loginSuccess(user.data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  const handleSignUp = async (e) => {
    dispatch(loginStart());
    e.preventDefault();
    try {
      const user = await axios.post(
        "http://localhost:3000/api/auth/signup",
        { name, email, password },
        { withCredentials: true }
      );
      dispatch(loginSuccess(user.data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
      console.error("Error signing up:", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(
            "http://localhost:3000/api/auth/google",
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
            { withCredentials: true }
          )
          .then((result) => {
            dispatch(loginSuccess(result.data));
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
        console.log(error);
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in or Sign up</Title>
        {/* Sign in form */}
        <form onSubmit={handleSignIn}>
          <Input
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign in</Button>
        </form>
        <Title>or</Title>
        {/* Sign in with Google */}
        <Button onClick={handleSignInWithGoogle}>Sign in With Google</Button>
        <Title>or</Title>
        {/* Sign up form */}
        <form onSubmit={handleSignUp}>
          <Input
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign up</Button>
        </form>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
