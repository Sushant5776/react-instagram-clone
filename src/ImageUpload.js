import { Button } from '@material-ui/core'
import { useState } from 'react'
import { db, storage } from './firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import './ImageUpload.css'

const ImageUpload = ({ username }) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    const handleChange = event => {
        if (event.target.files[0]) {
            setImage(event.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = uploadBytesResumable(ref(storage, `images/${image.name}`), image)
        uploadTask.on('state_changed', snapshot => {
            // progress function
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
            setProgress(progress)
        }, error => {
            // error function
            console.log(error)
            alert(error.message)
        }, () => {
            // complete function
            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                addDoc(collection(db, 'posts'), { timestamp: serverTimestamp(), caption: caption, imageUrl: downloadUrl, username: username })
                setProgress(0)
                setCaption('')
                setImage(null)
            })
        })
    }

    return (
        <div className='post__add'>
            <div className='post__container'>
                <progress className='post__progressBar' value={progress} max='100' />
                <input className='post__captionInput' type="text" value={caption} onChange={event => setCaption(event.target.value)} placeholder="Enter a Caption..." />
                <input className="post__fileInput" type='file' onChange={handleChange} />
                <Button variant='outlined' color='secondary' onClick={handleUpload}>
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload
