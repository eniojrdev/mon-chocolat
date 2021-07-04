import Link from 'next/link'
import { Box, Container, HStack, Heading} from '@chakra-ui/react';
import CartButton from './CartButton';

export default function TopNav() {
  return (
    <Box bg="gray.700" as="nav">
      <Container 
        maxW={{
          base: 'container.md',
          lg: 'container.lg',
          xl: 'container.xl'
        }}
        py="4"
      >
        <HStack justify="space-between">
          <Heading
            fontSize="2xl"
          >
            <Link href="/">
              <a data-testid="home-link">mon chocolat</a>
            </Link>
          </Heading>
          <CartButton />
        </HStack>
      </Container>
    </Box>
  )
}