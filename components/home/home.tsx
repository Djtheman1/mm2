// generate a random homepage component using nextJS
"use client";
import { NextPage } from "next";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div>
          <h1>Sign Up</h1>
          <form>
            <div>
              <label htmlFor="username">Username</label>
              <input id="username" type="text" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" />
            </div>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" />
            </div>
            <div>
              <label htmlFor="avatar">Avatar</label>
              <input id="avatar" type="file" />
            </div>
            <div>
              <label htmlFor="terms">Terms</label>
              <input id="terms" type="checkbox" />
            </div>
          </form>
          <button>Sign Up</button>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
