import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast, Stack, RadioGroup, Radio } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

    const [value, setValue] = React.useState('1')

    const [lastName, setLastName] = React.useState();
    const [birthDate, setBirthDate] = React.useState()
    const [username, setUsername] = React.useState()
    const [plan, setPlan] = React.useState()

    const [name, setName] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [picture, setPicture] = React.useState();

    const [iva, setIva] = React.useState();
    const [residence, setResidence] = React.useState();
    const [address, setAddress] = React.useState();

    const [showPass, setShowPass] = React.useState(false);
    const [confirmpassword, setConfirmpassword] = React.useState(false);
    const [showConfirmPass, setShowConfirmPass] = React.useState(false);
    const [loading, setLoading] = React.useState(false)

    const toast = useToast()
    const navigate = useNavigate()

    const handleClickPass = () => setShowPass(!showPass)
    const handleClickConfirmPass = () => setShowConfirmPass(!showConfirmPass)

    const postDetails = async (pics) => {
      setLoading(true)
      if (!pics) {
        toast({
          title: 'Please Select an Image!',
          status: 'warning',
          duration: 5000,
          position: 'bottom'
        })
        setLoading(false)
        return
      }
      
      if(pics.type === "image/jpg" || pics.type === "image/png" || pics.type === "image/jpeg") {
        const data = new FormData()
        data.append("file", pics)
        data.append("upload_preset", "bazar_")
        data.append("cloud_name", "paw2022")
        fetch("https://api.cloudinary.com/v1_1/paw2022/image/upload", {
          method: 'post',
          body: data,
        }).then((res) => res.json())
          .then(data => {
            setPicture(data.url.toString())
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          })
      }
    }
    
    const validEmail = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
    const validPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\\[-`{-~]).{6,64}$')
    const validIva = new RegExp('^[A-Z]{2}[0-9]{11}$')
    const validName = new RegExp('^[a-zA-Z\\d]+$')

    const submitUser = async () => {
      setLoading(true)
      const data = await axios.get('/all-users')
      const users = data.data
      const usernames = users.map(item => item.username)
      const emails = users.map(item => item.email)
      if (usernames.includes(username)) {
        toast({
          title: "Username is already in use",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false)
        return
      }
      else if (emails.includes(email)) {
        toast({
          title: "Email is already in use",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false)
        return
      }
      const date = new Date().getTime()
      const birth = new Date(birthDate).getTime()
      if (birth > date) {
        toast({
            title: "Birthdate is not valid",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        })
        setLoading(false)
        return
      }
      if(!name || !lastName || !birthDate || !username || !email || !password || !confirmpassword || !plan){
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
      if (!validEmail.test(email)) {
        toast({
          title: "Email format not correct",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if (!validPassword.test(password)) {
        toast({
          title: "Password format not correct, is required - minimum length 6 characters:\n - at least 1 capital character\n - at least 1 lower character\n - at least 1 number\n - at least 1 special character ",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if (!validName.test(username)) {
        toast({
          title: "Username format not correct",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if(password !== confirmpassword){
        toast({
          title: "Password do not match",
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
        await axios.post(
          "/user/signup",
          {name, lastName, birthDate, username, email, password, plan, picture},
          config
        )
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
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
      setLoading(true)
      const data = await axios.get('/all-users')
      const corporates = data.data
      const names = corporates.map(item => item.name)
      const emails = corporates.map(item => item.email)
      const ivas = corporates.map(item => item.iva)
      if (names.includes(name)) {
        toast({
          title: "Name is already in use",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false)
        return
      }
      else if (ivas.includes(iva)) {
        toast({
          title: "IVA is already in use",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false)
        return
      }
      else if (emails.includes(email)) {
        toast({
          title: "Email is already in use",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setLoading(false)
        return
      }
      if(!name || !residence || !address || !iva || !email || !password || !confirmpassword){
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
      if (!validIva.test(iva)) {
        toast ({
          title: "IVA format not correct",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if (!validEmail.test(email)) {
        toast({
          title: "Email format not correct",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if (!validPassword.test(password)) {
        toast({
          title: "Password format not correct, is required - minimum length 6 characters:\n - at least 1 capital character\n - at least 1 lower character\n - at least 11 number\n - at least 1 special character ",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setLoading(false)
        return
      }
      if(password !== confirmpassword){
        toast({
          title: "Password do not match",
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
        await axios.post(
          "/corporate/signup",
          {name, residence, address, iva, email, password, picture},
          config
        )
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
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
      if(value === '1'){
        submitUser()
        return
      }
      submitCorporate()
    }

    const userForm = (
    <div>
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
          <Input 
            placeholder='Enter your name'
            onChange={(e) => setName(e.target.value) }
          />
      </FormControl>

      <FormControl id='last-name' isRequired>
        <FormLabel>Last Name</FormLabel>
          <Input 
            placeholder='Enter your lastname'
            onChange={(e) => setLastName(e.target.value) }
          />
      </FormControl>

      <FormControl id='username' isRequired>
        <FormLabel>Username</FormLabel>
          <Input 
            placeholder='Enter your username'
            onChange={(e) => setUsername(e.target.value) }
          />
      </FormControl>

      <FormControl id='birthday' isRequired>
        <FormLabel>Birthday</FormLabel>
        <Input 
        placeholder='Enter your bithdate'
        type='date'
        onChange={(e) => setBirthDate(e.target.value)}
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
          <Input 
            placeholder='Enter your email'
            onChange={(e) => setEmail(e.target.value) }
          />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input 
              type={showPass ? "text" : "password"}
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value) }
            />
            <InputRightElement width={"4.5rem"}>
              <Button h="1.75rem" size="sm" onClick={handleClickPass}>
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
      </FormControl>

      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input 
              type={showConfirmPass ? "text" : "password"}
              placeholder='Confirm password'
              onChange={(e) => setConfirmpassword(e.target.value) }
            />
            <InputRightElement width={"4.5rem"}>
              <Button h="1.75rem" size="sm" onClick={handleClickConfirmPass}>
                {showConfirmPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Choose your plan</FormLabel>
        <RadioGroup onChange={setPlan} value={plan}>
          <Stack direction='row'>
            <Radio value='free'>Free</Radio>
            <Radio value='cheap'>Cheap</Radio>
            <Radio value='premium'>Premium</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
          <Input 
            type={"file"}
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0]) }
          />
      </FormControl>
    </div>)

    const corporateForm = (
    <div>
      <FormControl id='corporateName' isRequired>
        <FormLabel>Corporate Name</FormLabel>
        <Input 
          placeholder='Enter your corporate name'
          onChange={(e) => setName(e.target.value) }
        />
      </FormControl>

      <FormControl id='countryOfResidence' isRequired>
        <FormLabel>Country of residence</FormLabel>
        <Input 
          placeholder='Enter the country of residence'
          onChange={(e) => setResidence(e.target.value) }
        />
      </FormControl>

      <FormControl id='address' isRequired>
        <FormLabel>Address</FormLabel>
        <Input 
          placeholder='Enter the address'
          onChange={(e) => setAddress(e.target.value) }
        />
      </FormControl>

      <FormControl id='iva' isRequired>
        <FormLabel>IVA</FormLabel>
        <Input 
          placeholder='Enter the iva'
          onChange={(e) => setIva(e.target.value) }
        />
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder='Enter your email'
          onChange={(e) => setEmail(e.target.value) }
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
          type={showPass ? "text" : "password"}
          placeholder='Enter your password'
          onChange={(e) => setPassword(e.target.value) }
        />
        <InputRightElement width={"4.5rem"}>
        <Button h="1.75rem" size="sm" onClick={handleClickPass}>
          {showPass ? "Hide" : "Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confirmPassword' isRequired>
        <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input 
              type={showConfirmPass ? "text" : "password"}
              placeholder='Confirm password'
              onChange={(e) => setConfirmpassword(e.target.value) }
            />
            <InputRightElement width={"4.5rem"}>
              <Button h="1.75rem" size="sm" onClick={handleClickConfirmPass}>
                {showConfirmPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload your Picture</FormLabel>
          <Input 
            type={"file"}
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0]) }
          />
      </FormControl>
    </div>)
    
    return (
      <VStack spacing="5px" color="black">

      <FormControl>
        <RadioGroup onChange={setValue} value={value}>
          <Stack direction='row'>
            <Radio value='1'>User</Radio>
            <Radio value='2'>Corporate</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      
      {value === '1' ? (userForm) : (corporateForm)}      

      <Button
        colorScheme={"blue"}
        width={"100%"}
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
    )
}

export default SignUp