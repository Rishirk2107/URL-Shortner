"use client"
import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shortenUrl = async () => {
    const response = await fetch("https://d3vmn5fc1a7tvq.cloudfront.net/prod/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl: longUrl }),
    });

    const data = await response.json();
    console.log(data);
    setShortUrl(data["shortUrl"]);
    console.log(shortUrl)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">🔗 URL Shortener</h1>
        <input
          type="text"
          placeholder="Enter long URL..."
          className="w-full p-3 rounded-lg border-none outline-none bg-gray-700 text-white focus:ring-2 focus:ring-blue-400"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <button
          onClick={shortenUrl}
          className="mt-4 w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300"
        >
          Shorten URL
        </button>
        {shortUrl && (
          <p className="mt-4 text-lg">
            Shortened URL:{" "}
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {shortUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
