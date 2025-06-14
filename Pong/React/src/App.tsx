// src/App.tsx
import React, { useEffect } from "react";
import PongGame from "./components/PongGame";

const App: React.FC = () => {
  useEffect(() => {
    console.log("App is rendering!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <div className="bg-red-500 text-white p-4">Test Tailwind</div>
      <PongGame />
    </div>
  );
};

export default App;
