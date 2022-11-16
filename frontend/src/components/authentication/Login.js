import React from 'react'
import { Button, FormControl, Input, InputGroup, InputRightElement, VStack, useToast, RadioGroup, Radio, Stack, Checkbox } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [value, setValue] = React.useState('1')

  const [show, setShow] = React.useState(false)
  const [username, setUsername] = React.useState()
  const [password, setPassword] = React.useState()
  const [name, setName] = React.useState()
  const [keepAccess, setKeepAccess] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const toast = useToast()
  const navigate = useNavigate()
  const CryptoJS = require('crypto-js')

  const encrypt = (data) => {
    let encrypted = CryptoJS.AES.encrypt(data, process.env.REACT_APP_SECRET_KEY)
    encrypted = encrypted.toString()
    return encrypted
  }

  const handleClick = () => setShow(!show)

  const handleAccess = () => setKeepAccess(!keepAccess)

  const submitUser = async () => {
    if(!username || !password){
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "Content-type":"application/json",
        },
      }
      let { data } = ''
      if(!username.includes('@')){
        data = await axios.post(
        "/user/login",
        {username, password},
        config
        )
      }else{
        const email = username
        data = await axios.post(
          "/user/login",
          {email, password},
          config
          )
        }
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      const value = encrypt(JSON.stringify(data))
      if (keepAccess) {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
        sessionStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
      } else {
        sessionStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
      }
      setLoading(false)
      navigate('/')
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  const submitCorporate = async () => {
    if(!name || !password){
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "Content-type":"application/json",
        },
      }
      let { data } = ''
      if(!name.includes('@')){
        data = await axios.post(
        "/corporate/login",
        {name, password},
        config
        )
      }else{
        const email = name
        data = await axios.post(
          "/corporate/login",
          {email, password},
          config
          )
        }
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      const value = encrypt(JSON.stringify(data))
      if (keepAccess) {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
        sessionStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
      } else {
        sessionStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,value)
      }
      setLoading(false)
      navigate('/')
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  const submitHandler = () => {
    setLoading(true)
    if(value === '1'){
      submitUser()
      return
    }
    submitCorporate()
  }

  return (
    <VStack spacing="5px" color="black">

      <FormControl>
        <RadioGroup onChange={setValue} value={value}>
          <Stack direction='row'>
            <Radio value='1'>User</Radio>
            <Radio value='2'>Corporate</Radio>
            <Checkbox
            onChange={handleAccess}
            >Keep access</Checkbox>
          </Stack>
        </RadioGroup>
      </FormControl>
    
      {value === '1' ? (
        <FormControl id='emailUserLogin' isRequired>
          <Input 
            placeholder='Enter your email or user'
            onChange={(e) => setUsername(e.target.value) }
          />
        </FormControl>
      ) : (
        <FormControl id='emailCorporateLogin' isRequired>
          <Input 
            placeholder='Enter your email or corporate name'
            onChange={(e) => setName(e.target.value) }
          />
        </FormControl>
      )}

      <FormControl id='passwordLogin' isRequired>
        <InputGroup>
          <Input 
            type={show ? "text" : "password"}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value) }
          />
          <InputRightElement width={"4.5rem"}>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={"blue"}
        width={"100%"}
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

    </VStack>
  )
}

export default Login