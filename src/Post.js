// import { useState } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
// import { db } from './firebase'
// import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

const Post = ({ username, postId, caption, imageUrl }) => {
    // const [comments, setComments] = useState([])

    // TODO: add useeffect to fetch comments


    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Sushant" src="/static/image" />
                <h3>{username}</h3>
            </div>
            {/* header -> avatar + username */}

            <img className="post__image" src={imageUrl} alt='' />
            {/* image */}

            <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>
            {/* username + caption */}

            {/* TODO: Add a form to comment on a post and also show the comments below */}
            {/* Comments */}
        </div>
    )
}

export default Post