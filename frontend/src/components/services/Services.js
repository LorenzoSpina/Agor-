import React from 'react'
import { Link } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'




const Services = (props) => {

    const [posts, setPosts] = React.useState([])

    React.useEffect(() => {
        setPosts(props.services)
    },[props.services])


    const services = posts.map(item => (
  
        <Link
        to={`/service`}
        key={item._id}
        state={{
            id: item._id,
            picture: item.picture,
            title: item.title,
            description: item.description,
            place: item.place,
            price: item.price,
            dataRequired: item.dataRequired,
            dataCreation: item.dataCreation,
            lastUpdate: item.lastUpdate,
            user: item.user
        }}>
          
    <Box maxW='sm' borderWidth='5px' borderRadius='lg' overflow='hidden' m='15px' minW='166.28'>
      <Image src={item.picture} alt={item.description} borderWidth='5px' h='299.85'/>

      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Box
            color='gray.500'
            fontWeight='semibold'
            letterSpacing='wide'
            fontSize='xs'
            textTransform='uppercase'
            ml='2'
          >
          </Box>
        </Box>

        <Box
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {item.title}
        </Box>

        <Box>
        

          <Box as='span' color='gray.600' fontSize='sm'>
          
          </Box>
          <Box>
          
          Data creation: {item.dataCreation.split('T')[0]}
          </Box>
          
          <Box>

          </Box>

        </Box>
            {item.place}
        </Box>
        </Box>
        
            
        </Link>
    ))
    
    return (
    
    <div>
        {services}
    </div>
    
    )
}

export default Services