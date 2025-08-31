import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (input) {
      const imageUrl = await generateImage(input);
      if (imageUrl) {
        setIsImageLoaded(true);
        setImage(imageUrl);
      }
    }
    setLoading(false);
  };

  const handleGenerateAnother = () => {
    setIsImageLoaded(false);
    setInput("");
    setImage(assets.sample_img_1);
  };

  return (
    <motion.form
      action=""
      className="flex flex-col min-h-[90vh] justify-center items-center px-4"
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <div className="relative rounded-lg border border-white/10 overflow-hidden">
          <img
            src={image}
            alt=""
            className="max-w-sm rounded-md"
            onError={(e) => {
              if (image !== assets.sample_img_1) {
                setImage(assets.sample_img_1);
                setIsImageLoaded(false);
              }
            }}
          />
          <span
            className={`absolute bottom-0 left-0 h-1 bg-[var(--accent-orange)] ${
              loading ? "w-full transition-all duration-[10s]" : "w-0"
            }`}
          />
        </div>

        <p className={!loading ? "hidden" : "mt-2 text-white/70 text-center"}>
          Loading...
        </p>
      </div>

      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-[var(--bg-app)]/70 border border-white/10 text-sm p-1 mt-10 rounded-full items-center">
          <img src={assets.email_icon} alt="" className="hidden sm:block h-4 w-4 ml-3 opacity-70" />
          <input
            type="text"
            placeholder="Describe what to generate"
            className="flex-1 bg-transparent outline-none px-4 py-2 placeholder-white/40 text-white"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            type="submit"
            className="
              bg-[var(--accent-orange)] text-black
              px-6 sm:px-8 py-2.5 rounded-full
              hover:opacity-90
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
              disabled:opacity-50 disabled:cursor-not-allowed
              motion-safe:transform-gpu motion-safe:transition-transform motion-safe:hover:scale-[1.02]
              duration-[220ms]
            "
            disabled={loading || !input.trim()}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex gap-3 flex-wrap justify-center text-sm mt-10">
          <button
            type="button"
            className="
              px-8 py-2.5 rounded-full
              border border-white/10 text-white
              hover:bg-white/5
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
              motion-safe:transform-gpu motion-safe:transition-transform motion-safe:hover:scale-[1.02]
              duration-[200ms]
            "
            onClick={handleGenerateAnother}
          >
            Generate Another
          </button>
          <a
            href={image}
            download="generated-image.png"
            className="
              px-8 py-2.5 rounded-full
              text-black bg-[var(--accent-orange)]
              hover:opacity-90
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
              motion-safe:transform-gpu motion-safe:transition-transform motion-safe:hover:scale-[1.02]
              duration-[200ms]
            "
          >
            Download
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
