import React , { useState } from "react";
import Form from "../../components/Form/Form";
import Result from "../../components/Result/Result";
import "./home.css";

interface ShortenedUrl {
  shortCode: string;
  originalUrl: string;
}

const Home = () => {
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="container" style={{ height: shortenedUrl ? "600px" : "" }}>
      <h1>URL Shortener</h1>
      <p className="subtitle">Enter a long URL to make it shorter</p>

      <Form
        setShortenedUrl={setShortenedUrl}
        setIsLoading={setIsLoading}
        setError={setError}
        shortenedUrl={shortenedUrl}
      />

      {error && <div className="error">{error}</div>}

      {isLoading && <div className="loading">Shortening URL...</div>}

      {shortenedUrl && (
        <Result
          shortenedUrl={shortenedUrl}
          setShortenedUrl={setShortenedUrl}
        />
      )}
    </div>
  );
};

export default Home;
