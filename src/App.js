import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Posts/Post";
import { db, auth } from "./firebase.js";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Button, Input } from "@material-ui/core";
import ImageUpload from "./shared/ImageUpload";
import InstagramEmbed from "react-instagram-embed";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  // eslint-disable-next-line
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged((authUser) => {
      // console.log("onAuthStateChanged called once again  " + authUser);
      // console.log();

      if (!authUser) setUser(null);
      else {
        setUser(authUser);
        setEmail(authUser.email);
        setUsername(authUser.displayName);
      }
    });
    return () => unsubsribe();
  }, [username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);

  const signupHandler = (event) => {
    event.preventDefault();
    setOpenSignIn(false);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        setOpen(false);
      })
      .catch((error) => alert(error.message));
  };

  const signinHandler = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        setOpenSignIn(false);
        // console.log(` res.user.displayName ${res.user.displayName}`);
        setUsername(res.user.displayName);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img
              className="app__headerImage"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              alt="Insta_clone"
            ></img>
          </center>
          <form className="app__signup">
            <Input
              placeholder="userName"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signupHandler}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img 
              className="app__headerImage"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              alt="Insta_clone"
            ></img>
          </center>
          <form className="app__signup">
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signinHandler}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          // src="https://images.app.goo.gl/ST8Qra5hEihjKduT6"
          alt="Insta_clone"
        ></img>
        {user ? (
          <Button onClick={() => auth.signOut()}>
            {`Logout ${user.displayName}`}
          </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpen(true)}>SignUp</Button>
            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              postId={id}
              key={id}
              imageUrl={post.imageUrl}
              postName={post.postName}
              caption={post.caption}
              userName={post.userName}
              user={user}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://instagr.am/p/Zw9o4/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user ? (
        <ImageUpload username={user.displayName} email={email} />
      ) : (
        <h3>Login to upload</h3>
      )}
    </div>
  );
};

export default App;
