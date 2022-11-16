import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import SearchLoading from './SearchLoading'
import ListOfferedServices from './ListOfferedServices'
import ListRequiredServices from './ListRequiredServices'
import { decrypt } from '../../utils/decrypted_value'

import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useToast,
  Text,
  Drawer, DrawerBody, Input, Tab, TabPanel, Tabs, TabList, TabPanels, DrawerContent, DrawerOverlay, DrawerCloseButton, Tooltip,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const SideDrawer = () => {

  const [searchOfferedServices, setSearchOfferedServices] = React.useState('')
  const [offeredServices, setOfferedServices] = React.useState([])
  const [searchRequiredServices, setSearchRequiredServices] = React.useState('')
  const [requiredServices, setRequiredServices] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const toast = useToast()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  let user = null
  let data = null
  if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
    data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
    user = JSON.parse(data)
  } else if (sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
    data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
    user = JSON.parse(data)
  }

  const logoutHandler = () => {
    sessionStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
    navigate('/')
  }

  const handleSearchRequiredServices = async () => {
    if(!searchRequiredServices){
      toast({
        title: "Please enter something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
      return
    }
    try{
      setLoading(true)
      const config = {
        params: { search: searchRequiredServices }
      }
      const data = await axios.get('/required-services', config) 
      setLoading(false)
      setRequiredServices(data.data)
    } catch(err) { 
      toast({
        title: "Error occurred",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const handleSearchOfferedServices = async () => {
    if(!searchOfferedServices){
      toast({
        title: "Please enter something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
      return
    }
    try{
      setLoading(true)
      const config = {
        params: { search: searchOfferedServices }
      }
      const data = await axios.get('/offered-services', config) 
      setLoading(false)
      setOfferedServices(data.data)
    } catch(err) { 
      toast({
        title: "Error occurred",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  return (
    <>
      <Box backgroundColor="#EDF2F7" px={4} position={'fixed'} w={'100%'} zIndex={'2'} backdropFilter={'10px'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>

          <Tooltip hasArrow placement='bottom-end'>
            <Button variant={'solid'}
              colorScheme={'teal'}
              size={'sm'}
              mr={4}
              ref={btnRef}
              onClick={onOpen}>
              <i className="fas fa-search"></i>
                <Text d={{base: "none"}} px="4">
                  Search Services
                </Text>
            </Button>
          </Tooltip>
          <Drawer
          isOpen={isOpen}
          placement='bottom'
          onClose={onClose}
          finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList mr='40%' ml='40%'>
                  <Tab>Search Offered Services</Tab>
                  <Tab>Search Required Services</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <DrawerBody>
                      <Box d='flex' pb={2}>
                        <Input 
                        placeholder='Offered service...'
                        onChange={e => setSearchOfferedServices(e.target.value)}
                        />
                        <Button
                        onClick={handleSearchOfferedServices}
                        >
                          search
                        </Button>
                      </Box>
                      {loading ? (<SearchLoading />) :
                          (offeredServices?.map(item => (
                            <ListOfferedServices
                              key={item._id}
                              item={item}
                            />
                            ))
                          )
                        }
                    </DrawerBody>
                  </TabPanel>
                  <TabPanel>
                  <DrawerBody>
                    <Box d='flex' pb={2}>
                      <Input 
                      placeholder='Required service...'
                      onChange={e => setSearchRequiredServices(e.target.value)}
                      />
                      <Button
                      onClick={handleSearchRequiredServices}
                      >
                        search
                      </Button>
                    </Box>
                    {loading ? (<SearchLoading />) :
                        (requiredServices?.map(item => (
                          <ListRequiredServices
                            key={item._id}
                            item={item}
                          />
                          ))
                        )
                      }
                  </DrawerBody>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </DrawerContent>
          </Drawer>
          <Link to="/">
            <Text as='button' fontSize={"5xl"} fontFamily="Work sans" >
              Bazar
            </Text>
          </Link>
          {user ? (
            <Flex alignItems={'center'}>
              <Menu >
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} height={"100%"}>
                  {user.data.username ? (<Text>{user.data.username}</Text>)
                  : <Text>{user.data.name}</Text>}
                  <Avatar size={'sm'} cursor='pointer' name={user.data.username} src={user.data.pic} />
                </MenuButton>
                <MenuList>
                  <Link to='/my-profile'>
                    <MenuItem>My Profile</MenuItem>
                  </Link>
                  <MenuDivider />
                    <Link to='/services'>
                      <MenuItem>Services</MenuItem>
                    </Link>
                  <MenuDivider />
                  <Link to='/chats'>
                      <MenuItem>Chat</MenuItem>
                    </Link>
                  <MenuDivider />
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ):(
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar size={'sm'} cursor='pointer' />
              </MenuButton>
              <MenuList>
              <Link to='/auth'>
                  <MenuItem>Registrati</MenuItem>
              </Link>
              <MenuDivider />
              <Link to='/auth'>
                <MenuItem>Accedi</MenuItem>
              </Link>
            </MenuList>
            </Menu>
          </Flex>

        )}
        </Flex>
      </Box>
    </>
  )
}

export default SideDrawer