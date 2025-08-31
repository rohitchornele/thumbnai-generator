import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";
import { AppContext } from "../context/AppContext";

const GeneratorPage = () => {
  const [sourceImage, setSourceImage] = useState(assets.sample_img_1);
  const [baseImage, setBaseImage] = useState(null); // data URL for upload
  const [resultImage, setResultImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("image-edit-v1");
  const [size, setSize] = useState("1024x1024");
  const [strength, setStrength] = useState(60);

  const [file, setFile] = useState(null);

  const { generateThumbnail, uploadToCloudinary } = useContext(AppContext);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result;
      setBaseImage(url);
      setSourceImage(url);
      setResultImage("");
    };
    reader.readAsDataURL(f); // preview only
  };

  async function uploadViaPresigned(file) {
    // 1) ask backend for a presigned URL
    const meta = { filename: file.name, type: file.type, size: file.size };
    const r = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meta),
    });
    if (!r.ok) throw new Error("Failed to get upload URL");
    const { url, key, contentType } = await r.json();

    // 2) PUT the raw bytes to storage
    const put = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": contentType || file.type },
      body: file, // Blob/File directly
    });
    if (!put.ok) throw new Error("Upload failed");

    // 3) return the object key to send to backend
    return { key };
  }

  const onReset = () => {
    setPrompt("");
    setStrength(60);
    setModel("image-edit-v1");
    setSize("1024x1024");
    setResultImage("");
    // keep uploaded image so user can try again
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let cloudinaryPublicId = null;
      if (file) {
        const up = await uploadToCloudinary(file, { folder: "temp" }); // or `users/${userId}`
        cloudinaryPublicId = up.public_id;
      }
      // AppContext.generateThumbnail should accept { prompt, imageKey, model, size, strength }
      const img = await generateThumbnail({ prompt, cloudinaryPublicId, model, size, strength });
      if (img) setResultImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const appendQuick = (q) => setPrompt((p) => (p ? `${p}, ${q}` : q));

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className="grid lg:grid-cols-2 gap-6 min-h-[80vh] px-4 py-8"
      initial={{ opacity: 0.2, y: 80 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Left: Controls */}
      <div className="rounded-xl border border-white/10 p-4 sm:p-6 bg-[var(--bg-app)]/40">
        {/* Upload box */}
        <label
          className="
            block rounded-lg border-2 border-dashed
            border-[var(--accent-orange)]/70
            hover:border-[var(--accent-orange)]
            transition-colors cursor-pointer
            px-4 py-10 text-center
          "
        >
          <div className="text-white/70">
            Drag & drop an image here
          </div>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-orange)] text-black">
            BROWSE
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-white/80 hover:bg-white/5"
            onClick={() => baseImage && setSourceImage(baseImage)}
            disabled={!baseImage}
          >
            USE THIS IMAGE
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-white/60 hover:bg-white/5 disabled:opacity-50"
            onClick={() => {
              setBaseImage(null);
              setSourceImage(assets.sample_img_1);
            }}
            disabled={!baseImage}
          >
            REMOVE
          </button>
        </div>

        {/* Prompt */}
        <div className="mt-5">
          <div className="text-xs text-[var(--accent-orange)]/90 mb-1">
            Prompt (optional)
          </div>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-[var(--bg-app)]/60 text-sm text-white placeholder-white/40 px-3 py-2 outline-none focus:border-white/20 focus:ring-2 focus:ring-[var(--accent-red)]"
            placeholder="Add a brief instruction..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mt-2 text-xs text-white/60">
          Add a brief instruction, or pick quick actions below.
        </div>

        {/* Quick actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Enhance", "Background Blur", "Color Pop", "Cartoonize", "Upscale 2x"].map((q) => (
            <button
              key={q}
              type="button"
              className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/80 hover:bg-white/5"
              onClick={() => appendQuick(q.toLowerCase())}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs text-white/60">Model</label>
            <div className="mt-1 relative">
              <select
                className="w-full rounded-md border border-white/10 bg-[var(--bg-app)]/60 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="image-edit-v1">image-edit-v1</option>
                <option value="image-enhance-v1">image-enhance-v1</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">▾</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60">Size</label>
            <div className="mt-1 relative">
              <select
                className="w-full rounded-md border border-white/10 bg-[var(--bg-app)]/60 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option>1024x1024</option>
                <option>768x768</option>
                <option>512x512</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">▾</span>
            </div>
          </div>
        </div>

        {/* Strength slider */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-white">Strength</label>
            <span className="text-xs text-white/60">{strength}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={strength}
            onChange={(e) => setStrength(parseInt(e.target.value))}
            className="w-full mt-2 accent-[var(--accent-orange)]"
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={loading || (!prompt && !baseImage)}
            className="
              px-5 py-2 rounded-full text-sm
              text-black bg-[var(--accent-orange)]
              hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]
            "
          >
            {loading ? "GENERATING..." : "GENERATE"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2 rounded-full text-sm border border-white/10 text-white hover:bg-white/5"
          >
            RESET
          </button>
        </div>
      </div>

      {/* Right: Previews */}
      <div className="grid gap-4">
        <div className="rounded-xl border border-white/10 h-[310px] flex items-center justify-center p-2">
          {sourceImage ? (
            <img src={sourceImage} alt="" className="h-full rounded-md" />
          ) : (
            <div className="text-white/50 text-sm">No image selected</div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 h-[310px] flex items-center justify-center p-2 relative">
          {resultImage ? (
            <>
              <img src={resultImage} alt="" className="h-full rounded-md" />
              <div className="absolute top-2 right-2 flex gap-2">
                <a
                  href={resultImage}
                  target="_blank"
                  className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-white/90 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]"
                  title="Preview"
                  aria-label="Preview generated image"
                >
                  Preview
                </a>
                <a
                  href={resultImage}
                  download="generated-image.png"
                  className="px-3 py-1.5 rounded-full text-xs text-black bg-[var(--accent-orange)] hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]"
                  title="Download"
                  aria-label="Download generated image"
                >
                  Download
                </a>
              </div>
            </>
          ) : (
            <div className="text-white/50 text-sm">Generate to see result</div>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default GeneratorPage;
