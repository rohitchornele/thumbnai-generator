import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const GenerateButton = () => {
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
      className="flex flex-col justify-center items-center"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-white py-6 md:py-16">
        See the Magic. Try Now
      </h1>
      <button
        className="
          inline-flex items-center gap-2
          px-12 py-3 rounded-full
          text-black bg-[var(--accent-orange)]
          hover:opacity-90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
          motion-safe:transform-gpu motion-safe:transition-transform
          motion-safe:hover:scale-[1.03]
          duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          cursor-pointer
        "
        onClick={onClickHandler}
      >
        Generate Image
        <img src={assets.star_group} alt="" className="h-6" />
      </button>
    </motion.div>
  );
};

export default GenerateButton;
