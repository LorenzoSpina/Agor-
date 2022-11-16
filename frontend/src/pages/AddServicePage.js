import React from 'react'
import { Text, Box, Tabs, Tab, TabList, TabPanels, TabPanel} from '@chakra-ui/react'
import SideDrawer from '../components/miscellanous/SideDrawer'
import AddOfferedService from '../components/services/AddOfferedService'
import AddRequiredService from '../components/services/AddRequiredService'
import ErrorPage from './ErrorPage'
import { useLocation } from 'react-router-dom'

const AddServices = () => {

  const [insertPost, setInsertPost] = React.useState(true)
  const [error, setError] = React.useState()

  const location = useLocation()

  function check() {
    if (location.state) {
      if (location.state.info.plan === 'free' && location.state.postsNumber === 1) {
        setInsertPost(false)
        return
      } else if (location.state.info.plan === 'cheap' && location.state.postsNumber === 3) {
        setInsertPost(false)
        return
      }
    } else {
      setError(401)
    }
  }

  React.useEffect(() => {
    check()
  })

  if (!location.state) {
    return (
      <div syle={{ width:'100%'}}>
        <SideDrawer />
        <ErrorPage error={error} />
      </div>
    )
  } else {
    if (location.state.info.username) {
      return (
        <div>
          <SideDrawer />
            { insertPost ? (
              <Box w="100%" p={4} borderRadius="2xl" color="black" pt={'64px'}>
                <Tabs variant='soft-rounded' colorScheme='green' >
                  <TabList mb="1em">
                    <Tab width="50%">Offered Service</Tab>
                    <Tab width="50%">Required Service</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <AddOfferedService info={location.state.info} />
                    </TabPanel>
                    <TabPanel>
                      <AddRequiredService info={location.state.info} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            ) : (
              <Box w="100%" p={4} borderRadius="2xl" color="black" pt={'64px'}>
                <Tabs variant='soft-rounded' colorScheme='green' >
                  <TabList mb="1em">
                    <Tab width="50%">Offered Service</Tab>
                    <Tab width="50%">Required Service</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      { (location.state.info.plan === 'free') ? (
                        <Text as={"b"} color={"red"}>With Free plan you can add only one Offered Service</Text>
                      ) : (
                        <Text color={"red"}>With Cheap plan you can add only three Offered Services</Text>
                      )}
                    </TabPanel>
                    <TabPanel>
                      <AddRequiredService info={location.state.info} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            )}
        </div>
      )
    } else if (location.state.info.name) {
      return (
        <div>
          <SideDrawer />
          <Box            
            w="100%"
            pt='100px'
            >
            <AddOfferedService info={location.state.info} />
          </Box>
        </div>
      )
    }
  }
}

export default AddServices