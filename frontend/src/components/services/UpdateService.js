import React from 'react'
import { useToast, NumberInput, InputGroup, InputRightAddon, NumberInputField, Textarea, Image, Input, Button, VStack, Box, Badge } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { decrypt } from '../../utils/decrypted_value'

const UpdateService = (props) => {

    const [title, setTitle] = React.useState(props.post.title)
    const [description, setDescription] = React.useState(props.post.description)
    const [price, setPrice] = React.useState(props.post.price)
    const [place, setPlace] = React.useState(props.post.place)
    const [dataRequired, setDataRequired] = React.useState(props.post.dataRequired)
    const [picture, setPicture] = React.useState(props.post.picture)
    const [loading, setLoading] = React.useState(false)

    const toast = useToast()
    const navigate = useNavigate()

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
            setPicture(data.url.toString())
            setLoading(false)
            })
            .catch((err) => {
            console.log(err)
            setLoading(false)
            })
        }
    }
    
    const updatePost = async () => {
        setLoading(true)
        if (dataRequired) {
            const required = new Date(dataRequired).getTime()
            const creation = new Date(props.post.dataCreation).getTime()
            if (required < creation) {
                toast({
                    title: "Data Required is not valid",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
                setLoading(false)
                return
            }
        }
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
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                params: {
                    idPost: props.post.id
                }
            }
            if (dataRequired) {
                const data = {
                    picture: picture,
                    title: title,
                    description: description,
                    place: place,
                    dataRequired: dataRequired,
                }
                await axios.patch('/update-required-service', 
                    data,
                    config,
                )
            } else {
                const data = {
                    picture: picture,
                    title: title,
                    description: description,
                    place: place,
                    price: price,
                }
                await axios.patch('/update-offered-service', 
                    data,
                    config,
                )
            }
            toast({
                title: "Post updated correctly",
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

    const denie = () => {
        navigate('/services')
    }

    const form = (
        <VStack pt={'64px'} h="100%">
            <Box margin='2%' w='60%' borderWidth='5px' borderRadius='lg' display={{base: 'inline', lg:'flex'}} overflow='hidden' marginTop="5%">
                <Image objectFit={'contain'} height={{base: '162px',lg: '500px'}} w={{base: '100%', lg:'50%'}} src={picture} alt='hi' />
                <Box w={{base: '100%', lg:'50%'}} mt='5%' overflow={'auto'}>
                    <Box alignItems='baseline'>
                        <Badge borderRadius='full' width='50%' colorScheme='teal'>
                            Title
                        </Badge>
                            <Input
                            mt='2%'
                            ml='1%'
                            placeholder={title}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            fontSize='xs'
                            w='70%'
                            onChange={(e) => setTitle(e.target.value)}
                            />
                    </Box>
                    <Box display='grid' mt='5%'>
                        <Badge w={{base:'75%', lg:'50%'}} ml={{base:'12%', lg:'25%'}} borderRadius='full' px='10' colorScheme='teal'>
                            Description
                        </Badge>
                        <Textarea
                            maxLength={500}
                            placeholder={description}
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            fontSize='xs'
                            w='70%'
                            ml='15%'
                            mt='2%'
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Box>
                    <Box display='grid' mt='5%'>
                        <Badge ml='25%' w='50%' borderRadius='full' px='10' colorScheme='teal'>
                            Place
                        </Badge>
                        <Input
                        ml='15%'
                        mt='2%'
                        placeholder={place}
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        w='70%'
                        fontSize='xs'
                        onChange={(e) => setPlace(e.target.value)}
                        />
                    </Box>
                    {dataRequired ? (
                        <Box display='grid' mt='5%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                Data Required
                            </Badge>
                            <Input
                            type='date'
                            color='gray.500'
                            fontWeight='semibold'
                            letterSpacing='wide'
                            w='70%'
                            fontSize='xs'
                            ml='15%'
                            mt='2%'
                            onChange={(e) => setDataRequired(e.target.value)}
                            />
                        </Box>
                    ) : (
                        <Box display='grid' mt='5%'>
                            <Badge w='50%' ml='25%' borderRadius='full' px='10' colorScheme='teal'>
                                Price
                            </Badge>
                            <NumberInput
                            ml='27%'
                            mt='2%'
                            precision={2}
                            >
                                <InputGroup w='70%'>
                                    <InputRightAddon children='€' />
                                    <NumberInputField
                                    w='70%'
                                    placeholder={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    />
                                </InputGroup>
                            </NumberInput>
                        </Box>
                    )}
                    <Box mt='5%'>
                            <Badge borderRadius='full' px='10' colorScheme='teal'>
                                Upload your picture
                            </Badge>
                            <Input
                            mt='2%'
                            type={'file'}
                            p={1.5}
                            accept='image/*'
                            onChange={(e) => postDetails(e.target.files[0])}
                            />
                    </Box>
                    <Box display='flex'>
                        <Button
                        colorScheme={"blue"}
                        width={"50%"}
                        style={{marginTop: 15}}
                        onClick={updatePost}
                        isLoading={loading}
                        >
                            Update
                        </Button>
                        <Button
                        colorScheme={"red"}
                        width={"50%"}
                        style={{marginTop: 15}}
                        onClick={denie}
                        isLoading={loading}
                        >
                            Denie
                        </Button>
                    </Box>
                </Box>
            </Box>
        </VStack>
    )

    return (
        <VStack>
            {form}
        </VStack>
    )
}

export default UpdateService