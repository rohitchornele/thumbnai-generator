import React from "react";
import { assets, testimonialsData } from "../assets/assets";
import { motion } from "motion/react";

const Testimonials = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center my-24 px-6 md:px-12"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-white">
        Customer Testimonials
      </h1>
      <p className="text-base text-white/65 mb-8">What Our Users Are Saying</p>

      <div className="flex flex-wrap justify-center gap-6">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className="
              group w-80
              rounded-lg border border-white/10
              bg-[var(--bg-app)]/50
              hover:bg-[var(--bg-app)]/60
              p-8
              transition-colors
              motion-safe:transform-gpu motion-safe:will-change-transform motion-safe:transition-transform
              motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01]
              duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]
              cursor-default
            "
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={testimonial.image}
                alt=""
                className="rounded-full w-14 h-14 object-cover border border-white/10"
              />
              <h2 className="text-lg font-semibold mt-3 text-white">
                {testimonial.name}
              </h2>
              <p className="text-white/60 mb-3">{testimonial.role}</p>

              <div className="flex mb-4">
                {Array(testimonial.stars)
                  .fill()
                  .map((_, i) => (
                    <img
                      key={i}
                      src={assets.rating_star}
                      alt=""
                      className="h-4 w-4 opacity-90"
                    />
                  ))}
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
