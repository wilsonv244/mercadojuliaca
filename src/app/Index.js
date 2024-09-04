import Link from "next/link";
import React from "react";
import { Redirect } from "react-router-dom";

const Index = () => {
  // Check if the user is authenticated
  if (typeof window.localStorage.getItem("user") === "wvargas") {
    // Redirect the user to the home page
    return <Link href="/" />;
  } else {
    // Render the login page
    return <Login />;
  }
};

export default Index;
