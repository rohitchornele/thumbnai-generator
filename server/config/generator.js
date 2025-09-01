import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL,
});


const response = await client.chat.completions.create({
  model: "google/gemini-2.5-flash-image-preview:free",
  messages: [
    {
      role: "system",
      content:
        "You are a helpful assistant who generates images and download in user's device.",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "What is in this image?",
        },
        {
          type: "image_url",
          image_url: {
            url: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg",
          },
        },
      ],
    },
  ],
});

console.log("Response = ", response.choices[0].message )
const base64DataUrl = JSON.stringify(
  response.choices[0].message.images[0].image_url.url
);

console.log(
  JSON.stringify(response.choices[0].message?.images[0]?.image_url?.url).slice(
    0,
    1000
  )
);

const outputFileName = "downloaded_image999.png";


const base64Image = base64DataUrl.split(";base64,").pop();

fs.writeFile("myImage222.png", base64Image, { encoding: "base64" }, (err) => {
  if (err) {
    console.error("Error saving image:", err);
  } else {
    console.log("Image saved as myImage222.png");
  }
});
