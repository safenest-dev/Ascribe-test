import React , { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        border: "1px solid red",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>404 - Not Found</h1>
      <button 
        onClick={goToHomePage}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px"
        }}
      >
        Home page
      </button>
    </div>
  );
};

export default NotFound;