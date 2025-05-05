import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(null);

  const handleSubmit = () => {

    const apiObj = {
      name: name,
      email: email,
      password: password,
      phone: phone,
    };
    axios({
      method: "POST",
      url: "https://simple-book-library-new.vercel.app/user/signup", //
      data: apiObj,
    }).then((res) => {
      navigate("/signin");
      
    });
  };
  return (
    <div>
      <input
        value={name}
        type="text"
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        value={email}
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        value={password}
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        value={phone}
        type="number"
        placeholder="phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}
