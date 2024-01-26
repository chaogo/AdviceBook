import { useState } from "react";
import OpenAI from "openai";

export default function App() {
  const [advice, setAdvice] = useState("");
  const [count, setCount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  async function getAdvice() {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    const advice = data.slip.advice;
    setAdvice(advice);
    setCount((c) => c + 1);
    getDalleImage(advice);
  }

  async function getDalleImage(advice) {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // temporary compromise as it's not safe to expose API keys on the client side
    });

    try {
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: advice,
        n: 1,
        size: "1024x1024", // ['1024x1024', '1024x1792', '1792x1024']
      });
      setImageUrl(image.data[0].url);
      console.log(image.data);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }

  return (
    <div>
      <button
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={getAdvice}
      >
        Get Advice
      </button>
      <h1>{advice}</h1>
      {imageUrl && <img src={imageUrl} alt="Generated from DALL-E" />}
      <Message count={count} />
      <p
        style={{
          fontSize: "12px",
          position: "absolute",
          bottom: "10px",
          right: "10px",
        }}
      >
        @by Chao Tang
      </p>
    </div>
  );
}

function Message(props) {
  return (
    <p>
      You have read <strong>{props.count}</strong> pieces of advice
    </p>
  );
}
