import Head from 'next/head'
import TopNav from '../components/TopNav'
import { Container, Stack, VStack, Heading, Text, useToast } from '@chakra-ui/react'
import CartItem from '../components/CartItem'
import CheckoutBox from '../components/CheckoutBox'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clear } from '../features/cart/cartSlice'
import { useMutation } from 'react-query'

export default function Cart() {
  const productsInCart = Object.values(useAppSelector(state => state.cart.products));
  const dispatch = useAppDispatch();
  const toast = useToast();

  const mutation = useMutation(async () => {
    return fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(productsInCart.map(({id, quantity}) => ({
        id,
        quantity
      })))
    })
  }, {
    onSuccess: () => {
      dispatch(clear());
      toast({
        title: "Achat réussi!",
        status: "success",
      })
    },
    onError: () => {
      toast({
        title: "Erreur inattendue",
        status: "error",
      })
    }
  })

  async function handleCheckout() {
    mutation.mutateAsync();
  }

  return (
    <main>
      <Head>
        <title>Panier | Mon Chocolat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TopNav />

      <Container 
        maxW={{
          base: 'container.md',
          lg: 'container.lg',
          xl: 'container.xl'
        }}
        mt="12"
        mb="6"
      >
        <Heading as="h1">Panier</Heading>
      </Container>

      <Container 
        maxW={{
          base: 'container.md',
          lg: 'container.lg',
          xl: 'container.xl'
        }}
      >
        <Stack
          direction={{
            base: 'column',
            lg: 'row'
          }}
          spacing="8"
        >
          <VStack 
            w="100%"
            spacing="4"
            data-testid="cart-list"
          >
            {productsInCart.length > 0 && (
              productsInCart.map(product => (
                <CartItem key={product.id} {...product}/>
              ))
            )}

            {productsInCart.length === 0 && (
              <Text as="h2" fontSize="2xl" w="100%">Votre panier est vide</Text>
            )}
          </VStack>

          
          <CheckoutBox 
            products={productsInCart} 
            shipping={{
              name: 'Standard (3 jours ouvrables)',
              price: 9.99
            }}
            onCheckout={handleCheckout}
          />
        </Stack>
 
      </Container>

 
    </main>
  )
}