import { extendTheme } from "@chakra-ui/react"

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

export const theme = extendTheme({
  colors,
  fonts: {
    heading: 'Roboto',
    body: 'Raleway'
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white"
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
      }
    }
  },
})