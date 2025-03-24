// Generate a random terms component using nextJS
"use client";
import { NextPage } from "next";
import { motion } from "framer-motion";

const Terms: NextPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div>
          <h1>Terms and Conditions</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tincidunt, ligula nec ultricies viverra, nisl sapien tincidunt
            libero, nec consectetur odio nunc non nunc. Nulla facilisi. Donec
            nec nunc nec nunc ultricies ultricies. Nulla facilisi. Donec nec
            nunc nec nunc ultricies ultricies.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tincidunt, ligula nec ultricies viverra, nisl sapien tincidunt
            libero, nec consectetur odio nunc non nunc. Nulla facilisi. Donec
            nec nunc nec nunc ultricies ultricies. Nulla facilisi. Donec nec
            nunc nec nunc ultricies ultricies.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tincidunt, ligula nec ultricies viverra, nisl sapien tincidunt
            libero, nec consectetur odio nunc non nunc. Nulla facilisi. Donec
            nec nunc nec nunc ultricies ultricies. Nulla facilisi. Donec nec
            nunc nec nunc ultricies ultricies.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            tincidunt, ligula nec ultricies viverra, nisl sapien tincidunt
            libero, nec consectetur odio nunc non nunc. Nulla facilisi. Donec
            nec nunc nec nunc ultricies ultricies. Nulla facilisi. Donec nec
            nunc nec nunc ultricies ultricies.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Terms;
