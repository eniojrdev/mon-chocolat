import { createServer, Factory, Model, Response } from 'miragejs';

export function makeServer({environment = "test"}) {
  return createServer({
    environment,

    factories: {
      product: Factory.extend({
        name(i) {
          return `Chocolat ${i + 1}`
        },

        price() {
          return 49.99
        },

        availableQuantity(i) {
          const quantity = [
            5, 11, 18, 27, 6, 0, 9
          ]

          return quantity[i % quantity.length]
        },

        imageUrl(i) {
          const imageIds = [
            1, 2, 3, 4, 5
          ]

          return `/img/products/${imageIds[i % imageIds.length]}.png`
        }
      }),
    },

    models: {
      product: Model,
    },

    routes() {
      // Development mode fix
      this.passthrough('/_next/static/development/_devPagesManifest.json');

      this.namespace = 'api';
      this.timing = 1750;
  
      this.get('/products');
      this.post('/checkout', (schema, request) => {
        const products = JSON.parse(request.requestBody);

        for(const {id, quantity} of products) {
          const product = schema.products.find(id)

          if(product.availableQuantity - quantity < 0) {
            return new Response(400);
          }

          product.update("availableQuantity", product.availableQuantity - quantity)
        }

        return new Response(200);
      });      
    },

    seeds(server) {
      server.createList("product", 9);
    }
  })
}

