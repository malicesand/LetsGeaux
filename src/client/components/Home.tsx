import { profile } from 'console';
import React from 'react';

// Define the type for the 'user' prop
interface User {
  profileImage: any;
  username: string;
}

interface HomeProps {
  user: User;
}

const Home = ({ user }: HomeProps): JSX.Element => {
  return (
    <div>
     
      <h1>HELLOOOOOOOOOO, {user.username}!!!</h1>
      {console.log(user)}
      < img src={user.profileImage}></img>
      <p>Let's Geaux wants to get to know you a little better!
        Please enter your phone number and prefrences below. 
      </p>
    </div>
  );
};

export default Home;