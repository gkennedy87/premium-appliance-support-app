import React, {useState} from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'


export default withPageAuthRequired(function Members(){
  const [file, setFile] = useState([]);
  
  const handleFileUpload = (e) => {
    setFile(e.target.files)
    console.log(file)
  }

  return (
    <>
        <h1>Upload Customer Invoice</h1>
        <br/>
        <input 
            id='invoice-input'
            name='invoice'
            type='file' 
            accepts='.pdf' 
            onChange={e => handleFileUpload(e)} 
            />
    </>
  )
})
