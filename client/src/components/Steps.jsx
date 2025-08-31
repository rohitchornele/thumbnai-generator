import React from "react";
import { stepsData } from "../assets/assets";
import { motion } from "motion/react";

const Steps = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center my-28 px-4"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
        How it works
      </h1>
      <p className="text-base text-white/60 mb-8">
        Transform Words into Stunning Images
      </p>

      <div className="space-y-3 w-full max-w-3xl text-sm">
        {stepsData.map((item, index) => (
          <div
            key={index}
            className="
              group
              flex items-center gap-4 p-5 px-6
              rounded-lg
              border border-white/10
              bg-[var(--bg-app)]/40
              hover:bg-[var(--bg-app)]/55
              transition-colors
              motion-safe:transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01]
              duration-300 ease-in-out
              cursor-default
            "
          >
            <img src={item.icon} alt="" width={40} className="shrink-0" />
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-medium text-white">
                {item.title}
              </h2>
              <div className="h-px w-10 bg-[var(--accent-orange)]/70 my-1"></div>
              <p className="text-white/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Steps;
