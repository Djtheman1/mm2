// components/lead/lead.tsx
import { FC } from 'react';
import { Sidebar } from '../sidebar/sidebar';
interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  avatarUrl: string;
  rankChange: number;
}

// Sample leaderboard data (replace with dynamic data if needed)
const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: 'Alice', score: 1200, avatarUrl: '/avatar1.jpg', rankChange: 0 },
  { rank: 2, username: 'Bob', score: 1150, avatarUrl: '/avatar2.jpg', rankChange: -1 },
  { rank: 3, username: 'Charlie', score: 1100, avatarUrl: '/avatar3.jpg', rankChange: 1 },
  { rank: 4, username: 'David', score: 1000, avatarUrl: '/avatar4.jpg', rankChange: 0 },
  { rank: 5, username: 'Eve', score: 950, avatarUrl: '/avatar5.jpg', rankChange: -2 },
];

const Leaderboard: FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar component */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="text-lg font-semibold">Leaderboard</div>
            <div className="flex items-center space-x-4">
              <div>Logo</div> {/* Replace with your logo */}
              <button className="bg-blue-500 px-4 py-2 rounded-md">Profile</button>
            </div>
          </div>
        </header>

        <main className="py-8 max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl font-semibold">Top Players</h2>
              <div className="flex items-center space-x-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Weekly
                </button>
                <button className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-md">
                  All Time
                </button>
              </div>
            </div>

            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <th className="py-2 px-4 text-left">Rank</th>
                  <th className="py-2 px-4 text-left">Username</th>
                  <th className="py-2 px-4 text-left">Score</th>
                  <th className="py-2 px-4 text-left">Change</th>
                  <th className="py-2 px-4">Avatar</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{entry.rank}</td>
                    <td className="py-3 px-4">{entry.username}</td>
                    <td className="py-3 px-4">{entry.score}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`${
                          entry.rankChange > 0
                            ? 'text-green-500'
                            : entry.rankChange < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {entry.rankChange > 0 ? `+${entry.rankChange}` : entry.rankChange}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <img src={entry.avatarUrl} alt={`${entry.username} Avatar`} className="w-10 h-10 rounded-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl font-semibold">Want to be on the leaderboard?</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md mt-4">Start Now</button>
          </div>
        </main>

        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto flex justify-center">
            <div>Privacy Policy | Terms of Service | Contact Us</div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Leaderboard;
