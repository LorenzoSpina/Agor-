import React from 'react'
import SideDrawer from '../components/miscellanous/SideDrawer'
import { useLocation } from 'react-router-dom'
import { Box, Badge, Image, VStack, Button } from '@chakra-ui/react'
import ErrorPage from './ErrorPage'

const ServiceUserPage = () => {

    const [picture, setPicture] = React.useState()
    const [id, setId] = React.useState()
    const [title, setTitle] = React.useState()
    const [description, setDescription] = React.useState()
    const [place, setPlace] = React.useState()
    const [price, setPrice] = React.useState()
    const [dataRequired, setDataRequired] = React.useState()
    const [dataCreation, setDataCreation] = React.useState()
    const [lastUpdate, setLastUpdate] = React.useState()
    const [error, setError] = React.useState()

    const location = useLocation()

    function fetchInfo() {
        if (location.state) {
            setId(location.state.id)
            setPicture(location.state.picture)
            setTitle(location.state.title)
            setDescription(location.state.description)
            setPlace(location.state.place)
            setPrice(location.state.price)
            setDataRequired(location.state.dataRequired)
            setDataCreation(location.state.dataCreation)
            setLastUpdate(location.state.lastUpdate)
        } else {
            setError(401)
        }
    }

    React.useEffect(() => {
        fetchInfo()
    },[])

    if (!location.state) {
        <div stye={{ width: "100% "}}>
            <SideDrawer/>
            <ErrorPage error={error} />
        </div>
    } else {
        return (
            <div>
                <SideDrawer/>
                <VStack>
                    <Box margin='2%' w='70%' borderWidth='5px' borderRadius='lg' display='flex' overflow='hidden'>
                        <Image w='50%' src={picture} alt='hi' />
                        <Box w='50%'>
                            <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Title
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    textTransform='uppercase'
                                    ml='2'
                                >
                                    {title}
                                </Box>
                            </Box>
                            <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Description
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    ml='2'
                                >
                                    {description}
                                </Box>
                            </Box>
                            <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Place
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    ml='2'
                                >
                                    {place}
                                </Box>
                            </Box>
                            {dataRequired ? (
                                <Box alignItems='baseline'>
                                    <Badge borderRadius='full' px='10' colorScheme='teal'>
                                        Data Required
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                    >
                                        {dataRequired}
                                    </Box>
                                </Box>
                            ) : (
                                <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Price
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    textTransform='uppercase'
                                    ml='2'
                                >
                                    {price}€
                                </Box>
                            </Box>
                            )}
                            <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Data Creation
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    textTransform='uppercase'
                                    ml='2'
                                >
                                    {dataCreation.split('T')[0]}
                                </Box>
                            </Box>
                            <Box alignItems='baseline'>
                                <Badge borderRadius='full' px='10' colorScheme='teal'>
                                    Last Update
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    textTransform='uppercase'
                                    ml='2'
                                >
                                    {lastUpdate.split('T')[0]}
                                </Box>
                            </Box>
                            <Button
                            mt='5%'
                            colorScheme={'blue'}
                            width='20%'
                            >
                                Update
                            </Button>
                            <Button
                            mt='5%'
                            colorScheme='red'
                            width='20%'
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </div>
        )
    }
}

export default ServiceUserPage