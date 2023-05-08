import React, {useState, useEffect} from 'react'
//import axios from 'axios'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
//import {Stack, Box, TextField, Divider, Button, Input} from '@mui/material'
import {Container} from 'reactstrap'
import { useUser } from '@auth0/nextjs-auth0/client'

export default withPageAuthRequired(function ReportABug(){
    const user = useUser();
    useEffect(() => {
      console.log(user.user.name)
    }, [])
    
    return(
        <Container>
            <p>
                {user.user.name}
            </p>
        </Container>
    )
})