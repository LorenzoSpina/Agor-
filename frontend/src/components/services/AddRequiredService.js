import React from 'react'
import { Button, useToast, VStack, FormControl, FormLabel, Input} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddRequiredService = (props) => {

    const [title, setTitle] = React.useState()
    const [description, setDescription] = React.useState()
    const [place, setPlace] = React.useState()
    const [picture, setPicture] = React.useState()
    const [dataRequired, setDataRequired] = React.useState()
    const [dataCreation, setDataCreation] = React.useState()
    const [lastUpdate, setLastUpdate] = React.useState()
    const [user, setUser] = React.useState()
    const [loading, setLoading] = React.useState()

    const toast = useToast()
    const navigate = useNavigate()

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

    const submitPost = async () => {
        setUser(props.info.id)
        setDataCreation(new Date())
        setLastUpdate(dataCreation)
        setLoading(true)            
        if(!title || !description || !place || !picture || !dataRequired) {
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
        const required = new Date(dataRequired).getTime()
        const creation = new Date(dataCreation).getTime()
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
        try {
            const config = {
                headers: {
                "Content-type":"application/json",
                Authorization: `Bearer ${props.info.token}`
                },
            }
            await axios.post(
            "/add-required-service",
            {title, description, place, picture, dataRequired, dataCreation, lastUpdate, user},
            config
            )
            toast({
            title: "Post inserted correctly",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            })
            setLoading(false)
            navigate('/services')
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

    const form = (
        <div style={{width:'50%'}}>
            <FormControl id='title' isRequired>
            <FormLabel>Title</FormLabel>
                <Input
                maxLength={50}
                placeholder='Enter title'
                onChange={(e) => setTitle(e.target.value)}
                />
            </FormControl>
    
            <FormControl id='description' isRequired>
            <FormLabel>Description</FormLabel>
                <Input
                maxLength={500}
                placeholder='Enter description'
                height='100px'
                onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>

            <FormControl id='dataRequired' isRequired>
            <FormLabel>Data required</FormLabel>
            <Input 
            placeholder='Enter data required'
            type='date'
            onChange={(e) => {setDataRequired(e.target.value)}}
            />
            </FormControl>
    
            <FormControl id='place' isRequired>
            <FormLabel>Place</FormLabel>
            <Input 
            placeholder='Enter place'
            onChange={(e) => {setPlace(e.target.value)}}
            />
            </FormControl>
    
            <FormControl id='pic' isRequired>
            <FormLabel>Upload your Picture</FormLabel>
                <Input 
                type={"file"}
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
        </div>
    )

    return (
        <VStack spacing="5px" color="black">
        {form}
        <Button
        colorScheme={"blue"}
        width={"50%"}
        style={{marginTop: 15}}
        onClick={submitPost}
        isLoading={loading}
        >
            Add Required Service
        </Button>
    </VStack>
    )
}

export default AddRequiredService