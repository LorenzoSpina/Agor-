import React from 'react'
import { Text, Image, InputRightElement, useToast, Input, Button, VStack, Box, Badge, InputGroup } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const UpdateProfile = (props) => {

    const [user, setUser] = React.useState(props.user)

    const [newEmail, setNewEmail] = React.useState()
    const [newPassword, setNewPassword] = React.useState()
    const [confirmNewPassword, setConfirmNewPassword] = React.useState()
    const [newUsername, setNewUsername] = React.useState()
    const [newName, setNewName] = React.useState()
    const [newLastName, setNewLastName] = React.useState()
    const [newBirthDate, setNewBirthDate] = React.useState()
    const [newCorporateName, setNewCorporateName] = React.useState()
    const [newResidence, setNewResidence] = React.useState()
    const [newAddress, setNewAddress] = React.useState()
    const [newIva, setNewIva] = React.useState()
    
    const [showNewPass, setShowNewPass] = React.useState(false)
    const [showConfirmNewPass, setShowConfirmNewPass] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate()
    const toast = useToast()

    const handleClickPass = () => setShowNewPass(!showNewPass)
    const handleClickConfirmPass = () => setShowConfirmNewPass(!showConfirmNewPass)

    const postDetails = async (pics) => {
        setLoading(true)
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
                setUser(user => ({
                    ...user,
                    ...{picture: data.url.toString()}
                }))
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
        }
    }

    const denie = () => navigate('/services')

    const updateProfile = async () => {
        setLoading(true)
        if (newEmail || newUsername || newCorporateName) {
            const data = await axios.get('/all-users')
            const users = data.data
            if (newEmail) {
                const validEmail = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
                const emails = users.map(item => item.email)
                if (emails.includes(newEmail)) {
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
                if (!validEmail.test(newEmail)) {
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
                user.email = newEmail
                setUser({...user})
            }
            if (newUsername) {
                const usernames = users.map(item => item.username)
                if (usernames.includes(newUsername)) {
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
                user.username = newUsername
                setUser({...user})
            }
            if (newCorporateName) {
                const corporatesName = users.map(item => item.name)
                if (corporatesName.includes(newCorporateName)) {
                    toast({
                        title: "Corporate name is already in use",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    })
                    setLoading(false)
                    return
                }
                user.name = newCorporateName
                setUser({...user})
            }
        }
        if (newPassword) {
            const validPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\\[-`{-~]).{6,64}$') 
            if (!validPassword.test(newPassword)) {
                toast({
                    title: "Password format not correct",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
                setLoading(false)
                return
            }
            if (newPassword !== confirmNewPassword) {
                toast({
                    title: "Password do not match",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
                setLoading(false)
                return
            }
            user.password = newPassword
            setUser({...user})
        }
        if (newBirthDate) {
            const date = new Date().getTime()
            const birth = new Date(newBirthDate).getTime()            
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
            user.birthDate = newBirthDate
            setUser({...user})
        }
        if (newName) {
            user.name = newName
            setUser({...user})
        }
        if (newLastName) {
            user.lastName = newLastName
            setUser({...user})
        }
        if (newIva) {
            const data = await axios.get('/all-users')
            const corporates = data.data
            const ivas = corporates.map(item => item.iva)
            if (ivas.includes(newIva)) {
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
            const validIva = new RegExp('^[A-Z]{2}[0-9]{11}$')
            if (!validIva.test(newIva)) {
                toast({
                    title: "Iva format not correct",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                })
                setLoading(false)
                return
            }
            user.iva = newIva
            setUser({...user})
        }
        if (newResidence) {
            user.residence = newResidence
            setUser({...user})
        }
        if (newAddress) {
            user.address = newAddress
            setUser({...user})
        }
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    idUser: props.user.idUser
                }
            }
            if (user.username) {
                const data = {
                    picture: user.picture,
                    name: user.name,
                    lastName: user.lastName,
                    birthDate: user.birthDate,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }
                await axios.patch('/update-user',
                    data,
                    config
                    )
            } else {
                const data = {
                    picture: user.picture,
                    name: user.name,
                    countryOfResidence: user.residence,
                    address: user.address,
                    iva: user.iva,
                    email: user.email,
                    password: user.password,
                }
                await axios.patch('/update-user',
                    data,
                    config
                    )
            }
            toast({
                title: "User updated correctly",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                })
            setLoading(false)
            sessionStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
            localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
            navigate('/auth')
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: err.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
        }
    }

    const form = (
        <Box margin='2%' w='60%' borderWidth='5px' borderRadius='lg' display={{base: 'inline', lg:'flex'}} marginTop="5%">
                <Image objectFit={'contain'} height={{base: '162px',lg: '500px'}} w={{base: '100%', lg:'50%'}} src={user.picture} alt='hi' />
                <Box w={{base: '100%', lg:'50%'}} mt='5%' overflow={'auto'}>
                <Box mt='2%'>
                        <Badge ml='10%' w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal' textAlign={"center"}>
                            <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                                Upload your picture
                            </Text>
                        </Badge>
                        <Input
                        mt='1%'
                        type={'file'}
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                        />
                </Box>
                <Box mt='3%' display='grid'>
                    <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                        Email
                    </Badge>
                        <Input
                        mt='1%'
                        ml='15%'
                        placeholder={user.email}
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        w='70%'
                        onChange={(e) => setNewEmail(e.target.value)}
                        />
                </Box>
                <Box mt='3%' display='grid'>
                    <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                        <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                            New password
                        </Text> 
                    </Badge>
                    <InputGroup display={'flex'}>
                        <Input
                        placeholder='new password'
                        mt='1%'
                        ml='15%'
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        w='70%'
                        type={showNewPass ? "text" : "password"}
                        onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <InputRightElement width={"4.5rem"} >
                            <Button mt='25%' h="1.75rem" size="sm" onClick={handleClickPass}>
                                {showNewPass ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>
                <Box mt='3%' display='grid'>
                    <Badge ml={{base:'2%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal' textAlign={"center"}>
                        <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                            Confirm new password
                        </Text>
                    </Badge>
                    <InputGroup display={'flex'}>
                        <Input
                        placeholder='confirm new password'
                        mt='1%'
                        ml='15%'
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        w='70%'
                        type={showConfirmNewPass ? "text" : "password"}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <InputRightElement width={"4.5rem"}>
                            <Button mt='25%' h="1.75rem" size="sm" onClick={handleClickConfirmPass}>
                                {showConfirmNewPass ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>
                {user.username ? (
                    <Box>
                        <Box display='grid' mt='2%'>
                        <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                            <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                                Name
                            </Text>
                        </Badge>
                        <Input
                            placeholder={user.name}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            fontSize='xs'
                            w='70%'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewName(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                                <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                                    Lastname
                                </Text>
                            </Badge>
                            <Input
                            placeholder={user.lastName}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewLastName(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                                <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                                    Username
                                </Text>
                            </Badge>
                            <Input
                            placeholder={user.username}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge ml={{base:'10%', md:'25%'}} w={{base:'80%', md:'60%'}} borderRadius='full' px='10' colorScheme='teal'>
                                <Text textAlign={"center"} justifyContent={"center"} display="flex">   
                                    Birthdate
                                </Text>
                            </Badge>
                            <Input
                            type='date'
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewBirthDate(e.target.value)}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box>
                        <Box display='grid' mt='2%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                Corporate Name
                            </Badge>
                            <Input
                                placeholder={user.name}
                                color='gray.500'
                                fontWeight='semibold'
                                letterSpacing='wide'
                                fontSize='xs'
                                w='70%'
                                ml='15%'
                                mt='1%'
                                onChange={(e) => setNewCorporateName(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                Residence
                            </Badge>
                            <Input
                            placeholder={user.residence}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewResidence(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                Address
                            </Badge>
                            <Input
                            placeholder={user.address}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewAddress(e.target.value)}
                            />
                        </Box>
                        <Box display='grid' mt='2%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                IVA
                            </Badge>
                            <Input
                            placeholder={user.iva}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='1%'
                            onChange={(e) => setNewIva(e.target.value)}
                            />
                        </Box>
                    </Box>
                )}
                <Box ml='15%' display='flex'>
                    <Button
                    colorScheme={"blue"}
                    width={"40%"}
                    style={{marginTop: 15}}
                    onClick={updateProfile}
                    isLoading={loading}
                    >
                        Update
                    </Button>
                    <Button
                    colorScheme={"red"}
                    width={"40%"}
                    style={{marginTop: 15}}
                    onClick={denie}
                    isLoading={loading}
                    >
                        Denie
                    </Button>
                </Box>
            </Box>
        </Box>
)

    return (
        <VStack pt={'64px'} h="93.3vh" ml="4%" overflowY={"auto"}>
            {form}
        </VStack>
    )
}

export default UpdateProfile