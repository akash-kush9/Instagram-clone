import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { Input, Button } from "@material-ui/core";
import { db } from "../firebase";
import firebase from "firebase";
const Post = ({ userName, imageUrl, postName, caption, postId ,user}) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;

    
    if (postId)
      unsubscribe = db
        // listener of a nested collection
        .collection("posts")
        .doc(postId)
        .collection("comments").orderBy('timestamp','desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        });
    
    return () => unsubscribe();
  }, [postId]);

  const postCommentHandler = (event) => {
    event.preventDefault();
    let unsubscribe;
    if (postId)
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
          text: comment,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          userName: user.displayName,
        });
    setComment('')
    return () => unsubscribe();
  };

  return (
    <div key={postId} className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={userName}
          src="/static/images/avatar/3.jpg"
        />
        <h3 className="post__username">{userName}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt={postName}></img>
      <h4 className="post__text">
        <strong> {userName} </strong> {caption}
      </h4>
      <div className="post__comment"> 
      {comments.map ( comment=> (<div key = {comment.id}>
            <strong>
              {comment.userName} {"  "}
            </strong>
            {comment.text}
            </div>)
        )}

      </div>


      {user && <form onSubmit={postCommentHandler} className="post__commentbox">
        <Input
          className="post__input"
          type="text"
          placeholder="Let me share my wisdom"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <Button className="post__button" type="submit">Post</Button>
      </form>}
    </div>
  );
};

export default Post;
