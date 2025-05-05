import axios  from "axios";
import { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const apiObj = {
      email: email,
      password: password
    }
    axios({
      method: "POST",
      url: "https://simple-book-library-new.vercel.app/user/signin", //
      data: apiObj
    }).then((res)=> {
      localStorage.setItem('token', res.data.token)
    })

  };
  return (
    <div>
      <input
        value={email}
        placeholder="Email"
        type="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        value={password}
        placeholder="password"
        type="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleSubmit();
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Signin;
