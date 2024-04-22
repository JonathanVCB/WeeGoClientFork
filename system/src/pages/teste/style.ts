import styled from "styled-components";

export const Capa = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LoginContainer = styled.div`
  width: 20%;
  height: 40%;
  background-color: white;
  border: 2px solid #00000040;
  border-radius: 15px;
  position: absolute;
  top: 30%;
  right: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  gap: 1rem;

  > h1 {
    font-size: 2rem;
  }
  > span {
    color: #3d3d3d;
    font-size: 0.75rem;
    cursor: pointer;
    transition: 1s;
  }
  > span:hover {
    color: #264838;
    transform: scale(1.1);
    padding-left: 10px;
  }
`;

export const FormContainer = styled.form`
  width: 100%;
  height: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  > input {
    width: 96%;
    height: 20%;
    border-radius: 20px;
    border: 2px solid #00000040;
    padding-left: 10px;
  }
  > input::placeholder {
    font-size: 0.75rem;
    font-weight: 500;
  }

  > button {
    width: 100%;
    height: 20%;
    border-radius: 20px;
    border: none;
    color: #f2f2f2;
    background-color: #7d2cf8;
    transition: 1s;
  }
  > button:hover {
    background-color: #3e1077;
  }

  > span {
    color: red;
    font-size: 0.7rem;
    font-weight: 600;
  }
`;
