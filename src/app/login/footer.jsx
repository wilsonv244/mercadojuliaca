import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.socialIcons}>
        <FaFacebookF style={styles.icon} />
        <FaTwitter style={styles.icon} />
        <FaLinkedinIn style={styles.icon} />
      </div>
      <div style={styles.links}>
        <a href="/" style={styles.link}>
          Esta página fue creado con 💓 por: wilson.vargascalla@icloud.com |
          912805678-PERU
        </a>
      </div>
      <p style={styles.copyRight}>
        Copyright © WVARGAS Inc. All Rights Reserved.
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    padding: "20px 0",
    fontSize: "0.875rem",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  icon: {
    fontSize: "1.5em",
    margin: "0 10px",
    cursor: "pointer",
  },
  links: {
    marginBottom: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    margin: "0 10px",
    cursor: "pointer",
    display: "inline-block",
  },
  copyRight: {
    marginTop: "10px",
  },
};

export default Footer;
