import React, { useEffect, useState } from 'react';
import './form.css';
import { shortenUrl } from '../../services/api';

interface ShortenedUrl {
  shortCode: string;
  originalUrl: string;
}

interface FormProps {
  setShortenedUrl: (url: ShortenedUrl | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  shortenedUrl: ShortenedUrl | null;  // Correct type: ShortenedUrl | null
}

function Form({ setShortenedUrl, setIsLoading, setError, shortenedUrl }: FormProps) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (!shortenedUrl) {
      setUrl('');
    }
  }, [shortenedUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    let urlToShorten = url;
    if (!/^https?:\/\//i.test(url)) {
      urlToShorten = 'https://' + url;
    }

    try {
      setIsLoading(true);
      setError('');

      const data = await shortenUrl(urlToShorten);
      // Assuming the data returned from shortenUrl matches the ShortenedUrl format
      setShortenedUrl({
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to shorten URL');
      setShortenedUrl(null); // Ensure null is passed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form" aria-label="URL Shortener Form">
      <div className="input-group">
        <input
          type="text"
          placeholder="Paste your long URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="url-input"
        />
        <button type="submit" className="submit-button">
          Shorten
        </button>
      </div>
    </form>
  );
}

export default Form;
