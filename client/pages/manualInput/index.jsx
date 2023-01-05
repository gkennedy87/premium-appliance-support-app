import React, {useState} from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import {Stack, Box, TextField, Divider, Button} from '@mui/material'


export default withPageAuthRequired(function Members(){
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [designer, setDesigner] = useState('')
  const [builder, setBuilder] = useState('')
  const [dealer, setDealer] = useState('')
  const [salesman, setSalesman] = useState('')
  const [model, setModel] = useState('')
  const [quantity, setQuantity] = useState('')
  const [brand, setBrand] = useState('')
  const [serials, setSerials] = useState('')
  const [serialArr, setSerialArr] = useState([])
  const [datePurchased, setDatePurchased] = useState(Date.now());
  const [deliveryDate, setDeliveryDate] = useState(Date.now())


  function handleFirstNameChange(e){
    setFirstName(e.target.value)
  }
  function handleLastNameChange(e){
    setLastName(e.target.value)
  }
  function handleAddressLine1Change(e){
    setAddressLine1(e.target.value)
  }
  function handleAddressLine2Change(e){
    setAddressLine2(e.target.value)
  }
  function handleCityChange(e){
    setCity(e.target.value)
  }
  function handleStateChange(e){
    setState(e.target.value)
  }
  function handleZipCodeChange(e) {
    setZipCode(e.target.value)
  }
  function handlePhoneChange(e){
    setPhone(e.target.value)
  }
  function handleEmailChange(e){
    setEmail(e.target.value)
  }
  function handleDesignerChange(e){
    setDesigner(e.target.value)
  }
  function handleBuilderChange(e) {
    setBuilder(e.target.value)
  }
  function convertSerialsToArray(e) {
    const entryArray = e.split(',')
    console.log(entryArray)
    return entryArray
  }
  function buildOrder(){
    const serialNums = convertSerialsToArray(serials)
    const order = {
        customer: {
            firstName: firstName,
            lastName:lastName,
            addressLine1:addressLine1,
            addressLine2:addressLine2,
            city: city,
            state: state,
            zip: zipCode,
            phone: phone,
            email: email
        },
        deal: {
            designer: designer,
            builder: builder,
            dealer: dealer,
            salesman: salesman,
            brand: brand,
            model: model,
            quantity: quantity,
            serialNumbers: serialNums,
            datePurchased: datePurchased,
            deliveryDate: deliveryDate
        }
    }
    return order;
  }
  async function handleSubmit(){
    const newOrder = buildOrder();
    const response = await fetch('/api/hubspot', {
      method:'POST',
      body: JSON.stringify(newOrder),
      headers: {
        'Content-Type':'application/json'
      }
    })
    const data = await response.json();
    console.log(data)
  }

  return (
    <Stack alignItems='center'>
        <h1>Input Customer Invoice</h1>
        <br/>
        <Stack direction='column' px={5} py={3} spacing={2} maxWidth={550} sx={{borderTop:'1px solid #00000020'}}>
            <h2>Customer Info</h2>
            <Stack direction='row' spacing={2}>
                <TextField 
                    id='firstName'
                    name='firstName'
                    type='text'
                    label='First Name' 
                    value={firstName}
                    onChange={e => handleFirstNameChange(e)}
                />
                <TextField 
                    id='lastName'
                    name='lastName'
                    type='text'
                    label='Last Name'
                    value={lastName}
                    onChange={e => handleLastNameChange(e)} 
                />
            </Stack>
            <TextField 
                id='addressLine1'
                name='addressLine1'
                type='text'
                label='Street Address'
                value={addressLine1}
                onChange={e => handleAddressLine1Change(e)} 
            />
            <TextField 
                id='addressLine2'
                name='addressLine2'
                type='text'
                label='Apartment/Suite/Room #'
                value={addressLine2}
                onChange={e => handleAddressLine2Change(e)} 
            />
            <TextField 
                id='city'
                name='city'
                type='text'
                label="City"
                value={city}
                onChange={e => handleCityChange(e)} 
            />
        <Stack direction='row'>
            <TextField 
                id='state'
                name='state'
                type='text'
                label='State'
                value={state}
                onChange={e => handleStateChange(e)}
                helperText="Example: NY"
                maxLength={2}
                pattern="[A-Za-z]{2}" 
            />
            <TextField 
                id='zipCode'
                name='zipCode'
                type='text'
                label='ZIP Code'
                value={zipCode}
                onChange={e => handleZipCodeChange(e)} 
            />
        </Stack>
            <TextField 
                id='phone'
                name='phone'
                type='tel'
                label='Phone'
                value={phone}
                onChange={e => handlePhoneChange(e)} 
                helperText='Format: 555-555-5555'
            />
            <TextField 
                id='email'
                name='email'
                type='email'
                label='Email'
                value={email}
                onChange={e => handleEmailChange(e)} 
            />
        </Stack>
        <Stack direction='column' px={5} py={3} spacing={2} maxWidth={550} sx={{borderTop:'1px solid #00000020'}}>
            <h2>Deal Info</h2>
            <TextField 
                id='designer'
                name='designer'
                type='text'
                label='Designer'
                value={designer}
                onChange={e => handleDesignerChange(e)} 
            />
            <TextField 
                id='builder'
                name='builder'
                type='text'
                label='Builder'
                value={builder}
                onChange={e => handleBuilderChange(e)} 
            />
            <TextField 
                id='dealer'
                name='dealer'
                type='text'
                label='Dealer Purchased from'
                value={dealer}
                onChange={e => setDealer(e.target.value)} 
            />
            <TextField 
                id='salesman'
                name='salesman'
                type='text'
                label='Sales person purchased from'
                value={salesman}
                onChange={e => setSalesman(e.target.value)} 
            />
            <TextField 
                id='brand'
                name='brand'
                type='text'
                label='Brand Purchased'
                value={brand}
                onChange={e => setBrand(e.target.value)} 
            />
            <Stack direction='row' spacing={2}>
                <TextField 
                    id='Model'
                    name='model'
                    type='text'
                    label='Model'
                    value={model}
                    onChange={e => setModel(e.target.value)} 
                />
                <TextField 
                    id='quantity'
                    name='quanity'
                    type='text'
                    label='Quantity'
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    pattern="[0-9]{2}" 
                />
            </Stack>
            <TextField 
                id='serials'
                name='serials'
                type='text'
                label='Serial Numbers'
                value={serials}
                onChange={e => setSerials(e.target.value)} 
                helperText='Use commas to separate multiple entries'
                height={60}
            />
            <Stack direction='row' spacing={2}>
                <TextField 
                    id='datePurchased'
                    name='datePurchased'
                    type='date'
                    label='Date Purchased'
                    value={datePurchased}
                    onChange={e => setDatePurchased(e.target.value)}
                    helperText='Format: MM/DD/YYYY'
                />
                <TextField 
                    id='deliveryDate'
                    name='deliveryDate'
                    type='date'
                    label='Delivery Date'
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    helperText='Format: MM/DD/YYYY'
                 
                />
            </Stack>
            <Button 
                onClick={handleSubmit} 
                fullWidth size='large'
                variant='contained'
                sx={{color:'#fff', backgroundColor:'#0e0e0e'}}>Submit</Button>
        </Stack>
    </Stack>
  )
})
