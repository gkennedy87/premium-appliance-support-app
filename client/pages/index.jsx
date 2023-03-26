import React from 'react';

import Hero from '../components/Hero';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Stack, Button } from '@mui/material';

export default function Index() {
  const {user, isLoading} = useUser();
  function capitalizeFirstLetter(name) {
    const nameArr = name.split('')
    const firstLetter = nameArr[0].toUpperCase();
    let formattedName = [...nameArr]
    formattedName.splice(0,1,firstLetter);
    const joined = formattedName.join('');
    return joined;
  }
  return (
    <>
      {user ? 
        <>
          <Hero name={capitalizeFirstLetter(user.nickname)}/>
          <Stack direction='row' mb={3} gap={2} sx={{justifyContent:'center'}}>
            <Button variant="contained" href='/addcustomer'>Add New Customer</Button>
          </Stack>
        </>
        :
        <Hero/>
      }
    </>
  );
}
