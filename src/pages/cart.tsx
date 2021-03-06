import Head from 'next/head'
import { useRouter } from 'next/router';
import { Container, Stack, VStack, Heading, useToast } from '@chakra-ui/react'
import CartItem from '../components/CartItem'
import CheckoutBox from '../components/CheckoutBox'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clear } from '../features/cart/cartSlice'
import { useMutation, useQueryClient } from 'react-query'
import { MotionText } from '../motion'
import { AnimatePresence } from 'framer-motion'
import Main from '../components/Layout/Main'

export default function Cart() {
  const productsInCart = Object.values(useAppSelector(state => state.cart.products));
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

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
      queryClient.invalidateQueries('products');
      
      dispatch(clear());

      toast({
        title: "Achat réussi!",
        status: "success",
        position: "top",
      })
      
      router.push('/');
    },
    onError: () => {
      toast({
        title: "Erreur inattendue",
        status: "error",
        position: "top",
      })
    }
  })

  async function handleCheckout() {
    mutation.mutateAsync();
  }

  return (
    <Main>
      <Head>
        <title>Panier | Mon Chocolat</title>
      </Head>
      
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
          base: '480px',
          lg: 'container.lg',
          xl: 'container.xl'
        }}
      >
        <Stack
          direction={{
            base: 'column',
            lg: 'row'
          }}
          align={{
            base: 'center',
            lg: 'unset'
          }}
          spacing="8"
        >
          <VStack w="100%">
            <VStack 
              w="100%"
              spacing="4"
              data-testid="cart-list"
            >
              <AnimatePresence presenceAffectsLayout>
                {productsInCart.length > 0 && (
                  productsInCart.map((product, i) => (
                    <CartItem key={product.id} i={i} {...product}/>
                  ))
                )}
              </AnimatePresence>            
            </VStack>

            <AnimatePresence>
              {productsInCart.length === 0 && (
                <MotionText 
                  key="vide"
                  as="h2" 
                  fontSize="2xl" 
                  w="100%"
                  variants={{
                    hidden: { opacity: 0 },
                    show: { 
                      opacity: 1,
                      transition: {
                        delay: .5
                      }
                    }
                  }}

                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  Votre panier est vide
                </MotionText>
              )}
            </AnimatePresence>
          </VStack>

          <CheckoutBox 
            products={productsInCart} 
            shipping={{
              name: 'Standard (3 jours ouvrables)',
              price: 9.99
            }}
            onCheckout={handleCheckout}
            isSubmitting={mutation.isLoading}
          />
        </Stack>
      </Container>
    </Main>
  )
}
