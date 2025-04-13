import React from 'react';
import { user } from '../../../types/models.ts';
import Dashboard from './Dashboard/DashboardMain'
interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({user}) => {
  return (
    <div>
    <h1>HELLOOOOOOOOOO, {user.username}!!!</h1>
    <Dashboard user={user}/>
    </div>
  )
}

export default Home;