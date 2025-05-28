// src/components/ShortenerForm.jsx
import React, { useState } from "react";

export default function ShortenerForm() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const shortenUrl = async () => {
    setLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      const response = await fetch("https://api.byteblazeverse.space/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, selfDestruct }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to shorten URL");
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
      <h1 className="text-3xl font-bold mb-4">🔗 URL Shortener</h1>

      <input
        type="text"
        placeholder="Enter long URL..."
        className="w-full p-3 rounded-lg border-none outline-none bg-gray-700 text-white focus:ring-2 focus:ring-blue-400"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />

      <div className="mt-4 text-left">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={selfDestruct}
            onChange={() => setSelfDestruct(!selfDestruct)}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="ml-2">Enable self-destruct after one click</span>
        </label>
      </div>

      <button
        onClick={shortenUrl}
        disabled={loading || !longUrl}
        className="mt-4 w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300 disabled:opacity-50"
      >
        {loading ? "Shortening…" : "Shorten URL"}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {shortUrl && (
        <div className="mt-4">
          <p className="text-lg break-words">
            Shortened URL:{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {shortUrl}
            </a>
          </p>
          <button
            onClick={copyToClipboard}
            className="mt-2 w-full p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition duration-300"
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}
