import React from 'react'
import SideDrawer from '../components/miscellanous/SideDrawer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Badge, Image, VStack, Button, useToast, Text } from '@chakra-ui/react'
import UpdateService from '../components/services/UpdateService'
import axios from 'axios'
import { decrypt } from '../utils/decrypted_value'
import ErrorPage from './ErrorPage'

const ServiceUserPage = () => {

    const [post, setPost] = React.useState()
    const [isOwner, setIsOwner] = React.useState(false)
    const [update, setUpdate] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState()

    const location = useLocation()
    const navigate = useNavigate()
    const toast = useToast()

    const handleUpdate = () => setUpdate(!update)

    const del = async () => {
        setLoading(true)
        try {
            let _info = null
            let data = null
            if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
                _info = JSON.parse(data)
            } else {
                data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
                _info = JSON.parse(data)
            }
            const token = _info.data.token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    idPost: post.id
                }
            }
            if (post.dataRequired) {
                await axios.delete('/delete-required-service', config)
            } else {
                await axios.delete('/delete-offered-service', config)
            }
            toast({
                title: "Post deleted correctly",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                })
            setLoading(false)
            navigate('/services')
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

    React.useEffect(() => {
        function fetchInfo() {
            if (location.state) {
                let info = null
                let data = null
                if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                    data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
                    info = JSON.parse(data)
                } else if (sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                    data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
                    info = JSON.parse(data)
                }
                if (info) {
                    if (info.data.name) {
                        if (info.data.name === location.state.user) setIsOwner(true)
                    } else if (info.data.username) {
                        if (info.data.username === location.state.user) setIsOwner(true)
                    }
                }
                const _post = {
                    id: location.state.id,
                    user: location.state.user,
                    picture: location.state.picture,
                    title: location.state.title,
                    description: location.state.description,
                    place: location.state.place,
                    price: location.state.price,
                    dataRequired: location.state.dataRequired,
                    dataCreation: location.state.dataCreation,
                    lastUpdate: location.state.lastUpdate
                }
                setPost(_post)
            } else {
                setError(404)
            }
        }
        fetchInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[post])

    if(!post) {
        return (
            <>
                <SideDrawer />
                <ErrorPage error = {error} />
            </>
        )
    } else {
        if (update) {
            return (
                <div>
                    <SideDrawer />
                    <UpdateService post={post}  />
                </div>
            )
        } else {
            return (
                <div>
                    <SideDrawer/>
                    <VStack pt={'64px'} h="100%">
                        <Box margin='2%' w='60%' borderWidth='5px' borderRadius='lg' display={{base: 'inline', lg:'flex'}} overflow='hidden' margin-top="5%">
                            <Image objectFit={'contain'} height={{base: '162px',lg: '500px'}} w={{base: '100%', lg:'50%'}} src={post.picture} alt='hi' />
                            <Box w={{base: '100%', lg:'50%'}} mt='5%' overflow={'auto'}>
                                <Box alignItems='baseline'>
                                    <Badge borderRadius='full' width='55%'  colorScheme='teal'>
                                        <Text fontSize='80%'>
                                        Title
                                        </Text>
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'
                                        ml='2'
                                        p='1%'
                                    >
                                        {post.title}
                                    </Box>
                                </Box>
                                <Box alignItems='baseline' minW='30'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        <Text fontSize='80%'>
                                        Description
                                        </Text>
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                        p='1%'
                                    >
                                        {post.description}
                                    </Box>
                                </Box>
                                <Box alignItems='baseline'minW='30'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        <Text fontSize='80%'>
                                        Place
                                        </Text>
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                        p='1%'
                                    >
                                        {post.place}
                                    </Box>
                                </Box>
                                {post.dataRequired ? (
                                    <Box alignItems='baseline'minW='30'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            <Text fontSize='80%'>
                                            Data Required
                                            </Text>
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            ml='2'
                                            p='1%'
                                        >
                                            {post.dataRequired.split('T')[0]}
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box alignItems='baseline'minW ='30'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            <Text fontSize='80%'>
                                            Price
                                            </Text>
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            ml='2'
                                            p='1%'
                                        >
                                            {post.price}€
                                        </Box>
                                    </Box>
                                )}
                                <Box alignItems='baseline'minW='30'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        <Text fontSize='80%'>
                                        Data Creation
                                        </Text>
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'
                                        ml='2'
                                        p='1%'
                                    >
                                        {post.dataCreation.split('T')[0]}
                                    </Box>
                                </Box>
                                <Box alignItems='baseline'minW='30'>
                                    
                                    
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                    <Text fontSize='80%' letterSpacing='wide' > 
                                        Last Update
                                    </Text>
                                        
                                    </Badge>
                                    
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        textTransform='uppercase'
                                        ml='2'
                                        p='1%'
                                    >
                                        {post.lastUpdate.split('T')[0]}
                                    </Box>
                                    
                                </Box>
                                {isOwner ? (
                                    <Box>
                                        <Box alignItems='baseline'minW='30'>
                                            <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                                <Text fontSize='80%'>
                                                Post ID
                                                </Text>
                                            </Badge>
                                            <Box
                                                color='gray.500'
                                                fontWeight='semibold'
                                                letterSpacing='wide'
                                                fontSize='xs'
                                                textTransform='uppercase'
                                                ml='2'
                                                p='1%'
                                            >
                                                {post.id}
                                            </Box>
                                        </Box>
                                        <Button
                                        mt='5%'
                                        colorScheme={'blue'}
                                        width='30%'
                                        onClick={handleUpdate}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                        mt='5%'
                                        colorScheme='red'
                                        width='30%'
                                        isLoading={loading}
                                        onClick={del}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Box alignItems='baseline' minW='30'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            <Text fontSize='80%'>
                                            User
                                            </Text>
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            ml='2'
                                            p='1%'
                                        >
                                            {post.user}
                                        </Box>
                                        </Box>
                                        <Link
                                            to="/chats"
                                            state={{ user: post.user}}
                                        >
                                            <Button
                                            mt='5%'
                                            colorScheme={'blue'}
                                            width='100%'
                                            >
                                                <Text d={{base:'none'}} px= "4">
                                                Contact {post.user}
                                                </Text>
                                            </Button>
                                        </Link>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </VStack>
                </div>
            )
        }
    }
}

export default ServiceUserPage