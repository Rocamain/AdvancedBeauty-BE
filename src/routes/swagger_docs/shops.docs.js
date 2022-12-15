const shopList = {
  tags: ['Shop'],
  description: 'Get all shops.',
  parameters: [
    {
      $ref: '#/parameters/limit',
    },
    {
      $ref: '#/parameters/offset',
    },
    {
      $ref: '#/parameters/order',
    },
    {
      name: 'orderBy',
      description: 'By default on id.',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['id', 'shopName'],
      },
    },
    {
      name: 'shopName',
      in: 'query',
      schema: {
        type: 'string',
      },
    },
  ],
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              shops: [
                {
                  id: 1,
                  shopName: 'Turo Park',
                  city: 'Barcelona',
                  street: 'C/ Tenor Viñas, 3',
                  postcode: '08021 – Barcelona',
                  phone: '93 200 96 56',
                  mobile: '640 725 934',
                  createdAt: '2022-12-13T12:41:07.706Z',
                  updatedAt: '2022-12-13T12:41:07.706Z',
                },
                {
                  id: 2,
                  shopName: "L'Illa Diagonal",
                  city: 'Barcelona',
                  street: 'Avda. Diagonal, 569',
                  postcode: '08029 – Barcelona',
                  phone: '93 410 14 87',
                  mobile: '640 725 935',
                  createdAt: '2022-12-13T12:41:07.706Z',
                  updatedAt: '2022-12-13T12:41:07.706Z',
                },
                {
                  id: 3,
                  shopName: 'Palma de Majorca',
                  city: 'Palma de Majorca',
                  street: 'C/ Josep Anselm Clavé, 6',
                  postcode: '07002 – Palma de Majorca ',
                  phone: '971 707 281',
                  mobile: '646 531 481',
                  createdAt: '2022-12-13T12:41:07.706Z',
                  updatedAt: '2022-12-13T12:41:07.706Z',
                },
              ],
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const getShopById = {
  tags: ['Shop'],
  description: 'Get a shop by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  responses: {
    200: {
      description: 'Succeed',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              shop: {
                id: 1,
                shopName: 'Turo Park',
                city: 'Barcelona',
                street: 'C/ Tenor Viñas, 3',
                postcode: '08021 – Barcelona',
                phone: '93 200 96 56',
                mobile: '640 725 934',
                createdAt: '2022-12-13T12:41:07.706Z',
                updatedAt: '2022-12-13T12:41:07.706Z',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const modifyShop = {
  tags: ['Shop'],
  description: 'Modify a shop by id params.',
  parameters: [
    {
      $ref: '#/parameters/idPath',
    },
  ],
  requestBody: {
    description:
      'Change one or more of the properties: shopName, city, street, postcode, phone, mobile.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              required: 'true',
              example: 'New city',
            },
            street: {
              type: 'string',
              required: 'true',
              example: 'New street',
            },
            postcode: {
              type: 'string',
              required: 'true',
              example: 'New street',
            },
            phone: {
              type: 'string',
              required: 'true',
              example: 'New phone',
            },
            mobile: {
              type: 'string',
              required: 'true',
              example: 'New mobile',
            },
          },
        },
      },
    },
  },
  responses: {
    203: {
      description: 'Modified',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            example: {
              shop: {
                id: 1,
                shopName: 'Turo Park',
                city: 'Barcelona',
                street: 'C/ Tenor Viñas, 3',
                postcode: '08021 – Barcelona',
                phone: '340 049 999',
                mobile: '640 725 934',
                createdAt: '2022-12-13T12:41:07.706Z',
                updatedAt: '2022-12-14T14:23:32.484Z',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request: ',
    },
  },
};

const shopRouteDoc = {
  '/shops': {
    get: shopList,
  },
  '/shops/{id}': {
    get: getShopById,
    put: modifyShop,
  },
};

module.exports = shopRouteDoc;
