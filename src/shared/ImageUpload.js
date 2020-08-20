import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import { storage, db } from "./../firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({ username, email }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState("");

  const handleChange = (event) => {
    // Get the first file and select the first only only
    if (event.target.files[0]) setImage(event.target.files[0]);
  };
  const handleUpload = (event) => {
    // For storage refer 'store' from the firebase file
    const uploadTask = storage.ref(`images`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          console.log(email, username);
          db.collection("posts").add({
            // timestamp: firebase.firestore.FieldValue.serverTimestamp,
            caption: caption,
            imageUrl: downloadURL,
            userName: username,
            email: email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          setProgress(0);
          setCaption("");
          setImage("");
        });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" max="100" value={progress} />

      <Input
        type="text"
        placeholder="enter your caption"
        value={caption}
        required
        onChange={(event) => setCaption(event.target.value)}
      />
      <Input
        type="file"
        placeholder="Navigate to your file"
        onChange={handleChange}
        required
      />
      <Button onClick={handleUpload}> Upload file</Button>
    </div>
  );
};

export default ImageUpload;
