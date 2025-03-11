import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function RedirectHandler() {
  const { code } = useParams();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (code) {
        // @ts-ignore
        window.location.href = `${import.meta.env.VITE_API_URL}/${code}`;
      }
    }, 1500);

    return () => {
      clearTimeout(redirectTimeout);
    };
  }, [code]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontFamily: "sans-serif",
          color: "#333",
          marginBottom: "10px",
        }}
      >
        Redirecting
      </h2>
    </div>
  );
}

export default RedirectHandler;
