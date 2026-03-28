import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleGenerate = async () => {
    if (!url) return toast.error("Enter a URL");
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8001/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setShortUrl(`http://localhost:8001/${data.id}`);
      toast.success("Short URL created!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const getAnalytics = async () => {
    try {
      const id = shortUrl.split("/").pop();
      const res = await fetch(`http://localhost:8001/url/analytics/${id}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      toast.error("Failed to load analytics");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
      <Toaster />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-5 right-5 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black transition"
      >
        {dark ? "Light" : "Dark"}
      </button>

      {/* Header */}
      <div className="w-full py-6 text-center text-6xl font-extrabold bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text animate-pulse  ">
        ZIPPO
      </div>

      {/* Card*/}
      <div className="w-full max-w-4xl mt-10 p-10 rounded-2xl bg-white/20 backdrop-blur-lg shadow-2xl border border-white/30 transitoin duration-500 hover:scale-[1.01]">
        {/* Input */}
        <div className="flex items-center bg-white/70 p-4 rounded-xl shadow-inner transition duration-300 focus-within:ring-2 focus-within:ring-purple-400">
          <span className="mr-4 font-bold tracking-widest text-gray-700">
            URL
          </span>
          <input
            type="text"
            placeholder="Paste your long URL here...."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-800"
          />
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleGenerate}
            className="relative px-12 py-3 font-semibold tracking-[6px] text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 before:absolute before:inset-0 before:rounded-xl before:bg-white/20 before:opacity-0 hover:before:opacity-100 before-transition"
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-dull animate-spin"></div>
            )}
            {loading ? "Generating..." : "GENERATE"}
          </button>
        </div>

        {/* Output */}
        {shortUrl && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center bg-white/70 p-4 mt-10 rounded-xl shadow-inner transition duration-300">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="w-full bg-transparent outline-none text-gray-800"
              />
              <button
                onClick={handleCopy}
                className="ml-4 px-5 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 hover:scale-100 hover:shadow-lg active:scale-95"
              >
                COPY
              </button>
            </div>
            {/* Analytics Button */}
            <button
              onClick={getAnalytics}
              className="w-full py-2 rounded-lg text-shite bg-gradient-ot-r from-yellow-400 to-orange-500 hover:scale-105 transition"
            >
              View Analytics
            </button>
          </div>
        )}
      </div>
      {/* Analytics Panel */}
      {analytics && (
        <div className="mt-10 p-6 rounded-xl bg-white/30 dark:bg-gray-800  shadow-lg w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Analytics</h2>
          <p>Total Clicks:{analytics.totalClicks}</p>
          <div className="mt-4 max-h-40 overflow-auto">
            {analytics.analytics.map((item, index) => (
              <div key={index} className="text-sm border-b py-1">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
