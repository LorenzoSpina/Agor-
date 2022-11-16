import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'


const OfferedServices = (props) => {

    return (
        <Link
        to='/service'
        state={{
            id: props.item._id,
            picture: props.item.picture,
            title: props.item.title,
            description: props.item.description,
            place: props.item.place,
            price: props.item.price,
            dataCreation: props.item.dataCreation,
            lastUpdate: props.item.lastUpdate,
            user: props.item.user
        }}
        >
            <Box
            cursor='pointer'
            bg='#E8E8E8'
            _hover={{
                background: '#38B2AC',
                color: 'white'
            }}
            w='100%'
            d='flex'
            alignItems='center'
            color='black'
            px={3}
            py={2}
            mb={2}
            borderRadius='lg'
            >
                <Avatar
                mr='2'
                size='sm'
                cursor='pointer'
                name={props.item.title}
                src={props.item.picture}
                />
                <Box>
                    <Text>{props.item.title}</Text>
                    <Text fontSize='xs' >
                        <b>Where:</b>
                        {props.item.place}
                    </Text>
                </Box>
            </Box>
        </Link>
    )
}

export default OfferedServices