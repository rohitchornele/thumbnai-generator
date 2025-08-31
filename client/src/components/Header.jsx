import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    if (user) {
      navigate("/result");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.div
      className="
        flex flex-col items-center text-center my-12 px-4
      "
      initial={{ opacity: 0.2, y: 60 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Small neutral badge */}
      <motion.div
        className="
          inline-flex items-center gap-2
          text-white/70
          border border-white/10
          rounded-full px-4 py-1
        "
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.8 }}
      >
        <p className="text-sm">Best Thumbnail Generator</p>
        <img src={assets.star_icon} alt="" className="h-4 w-4 opacity-80" />
      </motion.div>

      {/* Simple headline (no gradient) */}
      <motion.h1
        className="
          text-4xl sm:text-6xl mx-auto mt-8
          max-w-[300px] sm:max-w-[900px]
          font-semibold leading-tight
          text-white
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2 }}
      >
        Turn your normal image to a customized youtube thumbnail.
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-white/70 max-w-xl mx-auto mt-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        Unleash creativity with AI. Turn imagination into visual art in seconds—just type what you need and watch the magic happen.
      </motion.p>

      {/* CTA: one accent, calm hover */}
      <motion.button
        onClick={onClickHandler}
        className="
          sm:text-lg mt-8 px-10 py-2.5
          rounded-full cursor-pointer font-medium
          text-black
          bg-[var(--accent-orange)]
          hover:opacity-90
          focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--accent-red)]
          transition-colors
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          default: { duration: 0.4 },
          opacity: { delay: 0.6, duration: 0.8 },
        }}
      >
        Let's Get Started
        <img src={assets.star_group} className="h-6 ml-3 inline-block" alt="" />
      </motion.button>

      {/* Sample thumbnails (no glass, just simple borders) */}
      <motion.div
        className="flex flex-wrap justify-center mt-10 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {Array(6)
          .fill("")
          .map((item, index) => (
            <motion.img
              whileHover={{ scale: 1.03, duration: 0.1 }}
              src={index % 2 === 0 ? assets.sample_img_2 : assets.sample_img_1}
              alt=""
              key={index}
              width={70}
              className="
                rounded
                hover:scale-103
                transition-transform duration-200
                cursor-pointer
                max-sm:w-10
                border border-white/10
              "
            />
          ))}
      </motion.div>

      <motion.p
        className="text-center mt-2 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Thumbnails generated from our app
      </motion.p>
    </motion.div>
  );
};

export default Header;
