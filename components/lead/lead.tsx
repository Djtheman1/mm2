"use client"
import { FC } from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wagered: number;
  avatarUrl: string;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'Alice', wagered: 1200, avatarUrl: '/avatar1.jpg' },
  { rank: 2, username: 'Bob', wagered: 1150, avatarUrl: '/avatar2.jpg' },
  { rank: 3, username: 'Charlie', wagered: 1100, avatarUrl: '/avatar3.jpg' },
  { rank: 4, username: 'David', wagered: 1000, avatarUrl: '/avatar4.jpg' },
  { rank: 5, username: 'Eve', wagered: 950, avatarUrl: '/avatar5.jpg' },
  { rank: 6, username: 'Frank', wagered: 900, avatarUrl: '/avatar6.jpg' },
  { rank: 7, username: 'Grace', wagered: 850, avatarUrl: '/avatar7.jpg' },
  { rank: 8, username: 'Hank', wagered: 800, avatarUrl: '/avatar8.jpg' },
  { rank: 9, username: 'Ivy', wagered: 750, avatarUrl: '/avatar9.jpg' },
  { rank: 10, username: 'Jack', wagered: 700, avatarUrl: '/avatar10.jpg' }
];

const Leaderboard: FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col items-center p-6">
        <motion.header 
          className="bg-purple-800 p-6 shadow-lg w-full rounded-xl text-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white">Top Players</h1>
        </motion.header>

        <motion.div 
          className="bg-purple-950 shadow-lg rounded-xl overflow-hidden p-6 w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr className="bg-purple-700 text-white text-lg">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Wagered</th>
                <th className="py-3 px-4">Avatar</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <motion.tr 
                  key={entry.rank} 
                  className="hover:bg-purple-800 transition" 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <td className="py-3 px-4 font-semibold">{entry.rank}</td>
                  <td className="py-3 px-4">{entry.username}</td>
                  <td className="py-3 px-4 font-semibold text-pink-400">{entry.wagered}</td>
                  <td className="py-3 px-4">
                    <img src={entry.avatarUrl} alt={`${entry.username} Avatar`} className="w-10 h-10 rounded-full border-2 border-pink-500 mx-auto" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
