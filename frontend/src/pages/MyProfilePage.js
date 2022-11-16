import axios from 'axios'
import React from 'react'
import SideDrawer from '../components/miscellanous/SideDrawer'
import { VStack, Box, Badge, Button, Avatar } from '@chakra-ui/react'
import ErrorPage from './ErrorPage'
import { useNavigate } from 'react-router-dom'
import UpdateProfile from '../components/authentication/UpdateProfile'
import { decrypt } from '../utils/decrypted_value'

const MyProfilePage = () => {

    const [user, setUser] = React.useState()

    const [error, setError] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [update, setUpdate] = React.useState(false)

    const navigate = useNavigate()

    const handleUpdate = () => setUpdate(!update)

    const del = async () => {
        let config = null
        if (user.username) {
            config = {
                params: { user: user.username}
            }
        } else {
            config = {
                params: { user: user.name}
            }
        }
        setLoading(true)
        await axios.delete('/delete_account', config)
        localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
        sessionStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY)
        setLoading(false)
        navigate('/')
    }

    React.useEffect(() => {
        async function fetchInfo() {
            let info = null
            let data = null
            if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
            info = JSON.parse(data)
            } else if (sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
            info = JSON.parse(data)
            } else {
                setError(401)
            }
            if (info) {
                const idUser = info.data.id
                const config = {
                    params: { idUser: idUser }
                }
                const user = await axios.get('/get-user', config)
                if (user) {             
                        setUser({
                            idUser: user.data._id,
                            email: user.data.email,
                            password: user.data.password,
                            picture: user.data.picture,
                            username: user.data.username,
                            name: user.data.name,
                            lastName: user.data.lastName,
                            birthDate: user.data.birthDate,
                            plan:user.data.plan,
                            residence: user.data.countryOfResidence,
                            address: user.data.address,
                            iva: user.data.iva
                        })
                }
            }
        }
        fetchInfo()
    },[])
    

    if (!user) {
        return (
            <div style={{ width: '100%' }}>
                <SideDrawer />
                <ErrorPage error={error} />
            </div>
        )
    } else {
        if (update) {
            return (
                <>
                    <SideDrawer />
                    <UpdateProfile user={user}/>
                </>
            )
        }
        return (
            <div>
                <SideDrawer/>

                <VStack pt={'64px'} h="93.3vh" ml='4%'>
                    <Box borderRadius='lg' w='50%' borderWidth='5px'>
                    <Avatar mt='1%' size='2xl' src={user.picture} />
                        <Box>
                            <Box mt='2%' alignItems='baseline'>
                                <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                    ID
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    ml='2'
                                >
                                    {user.idUser}
                                </Box>
                            </Box>
                            <Box mt='2%' alignItems='baseline'>
                                <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                    Email
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    ml='2'
                                >
                                    {user.email}
                                </Box>
                            </Box>
                            {user.username ? (
                                <Box>
                                    <Box mt='2%' alignItems='baseline'>
                                        <Badge borderRadius='full'width='55%' colorScheme='teal'>
                                            Username
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            ml='2'
                                        >
                                            {user.username}
                                        </Box>
                                    </Box>
                                <Box mt='2%' alignItems='baseline'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        Name
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                    >
                                        {user.name}
                                    </Box>
                                </Box>
                                <Box mt='2%' alignItems='baseline'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        Lastname
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                    >
                                        {user.lastName}
                                    </Box>
                                </Box>
                                <Box mt='2%' alignItems='baseline'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        Brithdate
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                    >
                                        {user.birthDate.split('T')[0]}
                                    </Box>
                                </Box>
                                <Box mt='2%' alignItems='baseline'>
                                    <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                        Plan
                                    </Badge>
                                    <Box
                                        color='gray.500'
                                        fontWeight='semibold'
                                        letterSpacing='wide'
                                        fontSize='xs'
                                        ml='2'
                                    >
                                        {user.plan}
                                    </Box>
                                </Box>
                            </Box>
                            ) : (
                                <Box>
                                    <Box mt='2%' alignItems='baseline'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            Corporate name
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'
                                            ml='2'
                                        >
                                            {user.name}
                                    </Box>
                                    </Box>
                                    <Box mt='2%' alignItems='baseline'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            Residence
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            ml='2'
                                        >
                                            {user.residence}
                                        </Box>
                                    </Box>
                                    <Box mt='2%' alignItems='baseline'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            Address
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            ml='2'
                                        >
                                            {user.address}
                                        </Box>
                                    </Box>
                                    <Box mt='2%' alignItems='baseline'>
                                        <Badge borderRadius='full' width='55%' colorScheme='teal'>
                                            IVA
                                        </Badge>
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            ml='2'
                                        >
                                            {user.iva}
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                            <Button
                            mt='3%'
                            colorScheme={'blue'}
                            width='30%'
                            onClick={handleUpdate}
                            >
                                Update
                            </Button>
                            <Button
                            mt='3%'
                            colorScheme={'red'}
                            width='30%'
                            onClick={del}
                            isLoading={loading}
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

export default MyProfilePage