import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Description = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center my-24 px-6 lg:px-24"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
        Create AI Images
      </h1>
      <div className="h-0.5 w-12 bg-[var(--accent-orange)]/80 mb-4"></div>
      <p className="text-base text-white/65 mb-10">
        Turn your Imagination into Visuals
      </p>

      <div className="flex flex-col gap-6 md:gap-10 md:flex-row items-center justify-center">
        <img
          src={assets.sample_img_1}
          alt=""
          className="w-80 lg:w-96 rounded-lg border border-white/10"
        />
        <div className="md:px-6">
          <h2 className="text-2xl sm:text-3xl font-medium max-w-lg mb-3 text-white">
            Introducing the AI Powered Text-to-Image Generator
          </h2>
          <p className="text-white/70 leading-relaxed">
            Easily bring your ideas to life with our free Al image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.
          </p>
          <br />
          <p className="text-white/70 leading-relaxed">
            Simply type in a text prompt, and our cutting-edge Al will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don't yet exist can be visualized effortlessly. Powered by advanced Al technology, the creative possibilities are limitless!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Description;
