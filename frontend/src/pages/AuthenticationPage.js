import React from 'react'
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'

const AuthenticationPage = (props) => {
  return (
    <Container maxW='xl' centerContent>
    <Box
      display='flex'
      justifyContent= 'center'
      p={3}
      bg={"white"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text fontSize="4xl" fontFamily="Work sans">Bazar Auth</Text>
    </Box>
    <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
      <Tabs variant='soft-rounded'>
        <TabList mb="1em">
          <Tab width="50%">Login</Tab>
          <Tab width="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login setupSocket={props.setupSocket}/>
          </TabPanel>
          <TabPanel>
          <SignUp />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Container>
  )
}

export default AuthenticationPage