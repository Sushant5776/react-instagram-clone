import React, { useState, useEffect } from 'react'
import './App.css'
import { db, auth } from './firebase'
import Post from './Post'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { Button, Input, Modal } from '@material-ui/core'
import ImageUpload from './ImageUpload'


const App = () => {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)
  // const [postModal, setPostModal] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async authUser => {
      if (authUser) {
        console.log(authUser)
        if (authUser.displayName) {
          // don't update the userame
          setUser(authUser)
        } else {
          return await updateProfile(authUser, { displayName: username }).then(authUser => setUser(authUser))
        }
      } else {
        // user has logged out
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
    })

    return () => {

    }
  }, [])

  const signUp = (event) => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email, password).catch(error => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth, email, password).catch(error => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="app">

      {/* Caption input */}
      {/* File picker */}
      {/* Post button */}
      <Modal
        className="modal"
        open={open}
        onClose={() => setOpen(false)}
        aria-describedby="description"
      >
        <div className="modal__form">
          <div id='description'>
            <form className="form">
              <center><img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram Logo" /></center>
              <Input className='form__input' fullWidth value={username} onChange={event => setUsername(event.target.value)} type='email' placeholder="Username" />
              <Input className='form__input' fullWidth value={email} onChange={event => setEmail(event.target.value)} type='text' placeholder="Email" />
              <Input className='form__input' fullWidth value={password} onChange={event => setPassword(event.target.value)} type='password' placeholder="Password" />
              <Button type='submit' variant='outlined' color="primary" fullWidth onClick={event => signUp(event)}>Sign Up</Button>
            </form>
          </div>
        </div>
      </Modal>

      <Modal
        className="modal"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-describedby="description"
      >
        <div className="modal__form">
          <div id='description'>
            <form className="form">
              <center>
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram Logo" />
              </center>

              <Input className='form__input' fullWidth value={email} onChange={event => setEmail(event.target.value)} type='text' placeholder="Email" />
              <Input className='form__input' fullWidth value={password} onChange={event => setPassword(event.target.value)} type='password' placeholder="Password" />
              <Button type='submit' variant='outlined' color="primary" fullWidth onClick={event => signIn(event)}>Sign In</Button>
            </form>
          </div>
        </div>
      </Modal>


      <header className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram Logo" />
        {user ? (
          <Button onClick={() => signOut(auth)}>Log Out</Button>
          // <IconButton className='app__avatarButton' onClick={event => alert('')}>
          //   <Avatar className="post__avatar app__avatar" alt="Sushant" src="/static/image" />
          // </IconButton>
        ) : (
          <div>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          </div>
        )}
      </header>

      <center>
        {
          posts.length > 0 ? (
            // posts available
            posts.map(({ id, post }) => (<Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />))
          ) : (
            // no posts are available
            <h3>No post is available</h3>
          )
        }
      </center>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : ''}
    </div>
  )
}

export default App
