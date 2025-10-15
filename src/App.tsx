// src/App.tsx
import { useEffect, useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [samples, setSamples] = useState<string[]>([]);
  const [numSteps, setNumSteps] = useState(8);
  const [guidance, setGuidance] = useState(2.5);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://127.0.0.1:8000"; // api plug-in

  useEffect(() => {
    fetch(`${API_BASE}/samples`)
      .then((res) => res.json())
      .then((data) => setSamples(data.samples))
      .catch((err) => console.error(err));
  }, []);

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a prompt");
    setLoading(true);
    setOutputImage(null);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("num_steps", numSteps.toString());
    formData.append("guidance", guidance.toString());

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setOutputImage(`data:image/png;base64,${data.image}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Image Generator</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <label className="block">
            <span className="text-gray-300">Prompt</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-800 rounded-md border border-gray-700"
              placeholder="Enter your prompt..."
              rows={3}
            />
          </label>

          <div>
            <span className="text-gray-300">Quick Prompts:</span>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {samples.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(s)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block">
              Step: {numSteps}
              <input
                type="range"
                min={4}
                max={100}
                step={1}
                value={numSteps}
                onChange={(e) => setNumSteps(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <div>
            <label className="block">
              Scale: {guidance.toFixed(1)}
              <input
                type="range"
                min={1}
                max={10}
                step={0.1}
                value={guidance}
                onChange={(e) => setGuidance(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md font-semibold"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="md:w-2/3 flex justify-center items-center">
          {outputImage ? (
            <img
              src={outputImage}
              alt="Generated"
              className="rounded-xl shadow-lg max-h-[600px] object-contain"
            />
          ) : (
            <div className="text-gray-400 italic">
              {loading ? "Loading..." : "Output image will appear here."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
