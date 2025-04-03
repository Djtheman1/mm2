"use client"
import { FC } from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  avatarUrl: string;
  rankChange: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'Alice', score: 1200, avatarUrl: '/avatar1.jpg', rankChange: 0 },
  { rank: 2, username: 'Bob', score: 1150, avatarUrl: '/avatar2.jpg', rankChange: -1 },
  { rank: 3, username: 'Charlie', score: 1100, avatarUrl: '/avatar3.jpg', rankChange: 1 },
  { rank: 4, username: 'David', score: 1000, avatarUrl: '/avatar4.jpg', rankChange: 0 },
  { rank: 5, username: 'Eve', score: 950, avatarUrl: '/avatar5.jpg', rankChange: -2 },
  { rank: 6, username: 'Frank', score: 900, avatarUrl: '/avatar6.jpg', rankChange: 1 },
  { rank: 7, username: 'Grace', score: 850, avatarUrl: '/avatar7.jpg', rankChange: -1 },
  { rank: 8, username: 'Hank', score: 800, avatarUrl: '/avatar8.jpg', rankChange: 0 },
  { rank: 9, username: 'Ivy', score: 750, avatarUrl: '/avatar9.jpg', rankChange: 2 },
  { rank: 10, username: 'Jack', score: 700, avatarUrl: '/avatar10.jpg', rankChange: -3 }
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
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
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
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Change</th>
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
                  <td className="py-3 px-4 font-semibold text-pink-400">{entry.score}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`${
                        entry.rankChange > 0
                          ? 'text-green-400'
                          : entry.rankChange < 0
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {entry.rankChange > 0 ? `+${entry.rankChange}` : entry.rankChange}
                    </span>
                  </td>
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
