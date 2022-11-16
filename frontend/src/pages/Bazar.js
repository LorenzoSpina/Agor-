import React from 'react'
import Services from '../components/services/Services'
import SideDrawer from '../components/miscellanous/SideDrawer'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import Home from '../components/miscellanous/Home'
import { Container } from '@chakra-ui/react'
import {  VStack } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'

const Bazar = () => {

    const [offeredServices, setOfferedServices] = React.useState([])
    const [requiredServices, setRequiredServices] = React.useState([])

    async function fetchOfferedServices() {
        const data = await axios.get('/listings-offered-services')
        setOfferedServices(data.data)
    }

    async function fetchRequiredServices() {
        const data = await axios.get('/listings-required-services')
        setRequiredServices(data.data)
    }

    React.useEffect(() => {
        fetchOfferedServices()
        fetchRequiredServices()
    },[])

    return (
    <>
        <SideDrawer/> 
        <Home />
        <Flex display={{base: 'inline', lg:'flex'}}>
            <Container pt='20' >
                <VStack spacing ='50px' w='70%' marginLeft='15%'>
                    <Box bg='blue.500' w='100%' p='25' color='white' borderRadius='7px'>
                        <h1>Offered Services</h1>    
                    </Box>
                <Services services={offeredServices}/>
                </VStack>   
            </Container>
            <Container pt='20'>
                <VStack spacing ='50px' w='70%' marginLeft='15%'>
                    <Box bg='blue.500' w='100%' p='25' color='white' borderRadius='7px'>
                        <h1>Required Services</h1>
                    </Box>
                    <Services services={requiredServices} />
                </VStack>
            </Container> 
        </Flex>
    </>
   
    )
}

export default Bazar