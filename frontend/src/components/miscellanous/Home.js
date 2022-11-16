import {
  Stack,
  Container,
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import work from '../../assets/lavoratori-autonomi-professionali.jpg'

const Home = () => {
  return (
    <Box bg={'gray.800'} position={'relative'} w="75vw" marginLeft={"12%"} borderRadius="15px" pt={"64px"} background="linear-gradient(180deg, hsl(210,8%,15%), hsl(210,8%,35%))">
      <Flex
        flex={1}
        zIndex={0}
        display={{ base: 'none', lg: 'flex' }}
        backgroundImage={work}
        backgroundSize={'cover'}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        position={'absolute'}
        width={'50%'}
        insetY={0}
        right={0}>
        <Flex
          bgGradient={'linear(to-r, gray.800 10%, transparent)'}
          w={'full'}
          h={'full'}
        />
      </Flex>
      <Container maxW={'7xl'} position={'relative'}>
        <Stack direction={{ base: 'column', lg: 'row' }}>
          <Stack
            flex={1}
            color={'gray.400'}
            justify={{ lg: 'center' }}
            py={{ base: 4, md: 20, xl: 60 }}>
            <Box mb={{ base: 8, md: 20 }}>
              <Text
                fontFamily={'heading'}
                fontWeight={700}
                textTransform={'uppercase'}
                mb={3}
                fontSize={'xl'}
                color={'gray.500'}>
                Bazar
              </Text>
              <Heading
                color={'white'}
                mb={5}
                fontSize={{ base: '3xl', md: '5xl' }}>
                21st century independent jobs
              </Heading>
              <Text fontSize={'xl'} color={'gray.400'}>
              Thanks to bazar, small workers can offer their services through a network of people all over the world
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              {stats.map((stat) => (
                <Box key={stat.title}>
                  <Text
                    fontFamily={'heading'}
                    fontSize={'3xl'}
                    color={'white'}
                    mb={3}>
                    {stat.title}
                  </Text>
                  <Text fontSize={'xl'} color={'gray.400'}>
                    {stat.content}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
          <Flex flex={1} />
        </Stack>
      </Container>
    </Box>
  );
}

const stats = [
  {
    title: '10+',
    content: (
      <>
        <Text as={'span'} fontWeight={700} color={'white'}>Country</Text> where Bazar is #1 in market
      </>
    ),
  },
  {
    title: '24/7',
    content: (
      <>
        <Text as={'span'} fontWeight={700} color={'white'}>Chat</Text> available to talk with people to discuss 
        about services
      </>
    ),
  },
]
export default Home