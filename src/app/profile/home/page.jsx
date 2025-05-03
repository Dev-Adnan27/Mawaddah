"use client";

import { useState } from "react";

export default function HomePage() {
  const [name, setName] = useState({ first: "Hasnain", last: "Shah" });
  const [skill, setSkill] = useState("Next.js Expert");
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet...");
  const [image, setImage] = useState("https://via.placeholder.com/150");

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      {/* Profile Section */}
      <div style={styles.profileSection}>
        <img src={image} alt="Profile" style={styles.profileImg} />
        <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.fileInput} />
        <button style={styles.uploadBtn}>Upload</button>
      </div>

      {/* Update Name */}
      <div style={styles.updateSection}>
        <h3 style={styles.heading}>Update Your Name</h3>
        <input
          type="text"
          value={name.first}
          onChange={(e) => setName({ ...name, first: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          value={name.last}
          onChange={(e) => setName({ ...name, last: e.target.value })}
          style={styles.input}
        />
        <button style={styles.updateBtn}>Update</button>
      </div>

      {/* Update Skill */}
      <div style={styles.updateSection}>
        <h3 style={styles.heading}>Update Your Skill</h3>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={styles.input}
        />
        <button style={styles.updateBtn}>Update</button>
      </div>

      {/* Update Bio */}
      <div style={styles.updateSection}>
        <h3 style={styles.heading}>Update Your Bio</h3>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={styles.textarea}
        />
        <button style={styles.updateBtn}>Update</button>
      </div>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    backgroundColor: "#fff",
    color: "#333",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
  },
  profileSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  profileImg: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid orange",
  },
  fileInput: {
    marginTop: "10px",
    display: "block",
  },
  uploadBtn: {
    backgroundColor: "orange",
    color: "yellow",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  updateSection: {
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    minHeight: "60px",
    border: "1px solid gray",
    borderRadius: "5px",
  },
  updateBtn: {
    backgroundColor: "orange",
    color: "black",
    padding: "10px 15px",
    border: "none",
    cursor: "pointer",
  },
};

