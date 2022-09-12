import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Box, Button, /*Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, */Menu, MenuButton, MenuDivider, MenuItem, MenuList, /*Spinner,*/ Text, Tooltip/*, useDisclosure, useToast */} from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'

const SideDrawer = () => {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("userInfo"))

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate('/')
  } 

  return (
    <>
        <Box
            display={"flex"}
            justifyContent="space-between"
            alignItems={"center"}
            bgGradient="linear(to-r, blue.500, purple.200)"
            w="100%"
            p="5px 10px 5px 10px"
            borderWidth={"5px"}
            borderColor="00FFFF"
            boxShadow='dark-lg'
        >
        <Tooltip label="Search User" hasArrow placement='bottom-end'>
          <Button variant={"ghost"} >
            <i className="fas fa-search"></i>
              <Text d={{base: "none", md: "flex"}} px="4">
                Search Service
              </Text>
          </Button>
        </Tooltip>
        <Link to="/">
          <Text as='button' fontSize={"2xl"} fontFamily="Work sans">
            Bazar
          </Text>
        </Link>
        <div>
          <Menu>
            <MenuButton p={1}> 
              <BellIcon fontSize="1.5rem" m={1}/>
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          {user ? (
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
                <MenuItem>My Profile</MenuItem>
              <MenuDivider />
                <Link to='/services'>
                  <MenuItem>Services</MenuItem>
                </Link>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
          ):(
            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
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
              <MenuDivider />
            </MenuList>
          </Menu>
          )}
        </div>
      </Box>
    </>
  )
}

export default SideDrawer