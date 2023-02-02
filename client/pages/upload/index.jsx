import {useState} from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import {Button, Input} from '@mui/material'
import axios from 'axios'


export default withPageAuthRequired(function Members(){
  const [file, setFile] = useState([]);
  
  function handleFileUpload(e) {
    setFile(e.target.files[0])
    console.log(file)
  }

  async function handleSubmit(){
    console.log(file)
    const data = new FormData();
    data.append('file',file)
    console.log(data)
    const response = await axios.post('/api/upload-pdf',data)
    const json = await response.json();
    console.log(json)
  }



  return (
    <>
        <h1>Upload Customer Invoice</h1>
        <br/>
        <Input 
            id='invoice'
            name='invoice'
            type='file' 
            accept='application/pdf' 
            onChange={e => handleFileUpload(e)} 
            />
        <Button onClick={handleSubmit}>Submit</Button>
    </>
  )
})
