# CakePals Backend API

CakePals is a platform that allows people to sell and purchase home-baked cakes and pies. This backend API serves as the core of the CakePals application, providing the necessary functionalities for users, including registration, authentication, product management, order placement, and more.

## Features

### User Management

- **Registration**: Users can create new accounts as either Members or Bakers.

- **Authentication**: Bakers and Members can authenticate themselves.

### Baker Profile

- **Location**: Baker profiles include location information.

- **Rating**: Bakers are rated by customers, and their ratings contribute to their overall rating.

- **Collection Time Range**: Bakers specify their availability for order collection times.

### Product Management

- **Add, Edit and Delete Products**: Bakers can add new products for sale and update existing ones.

- **Product Details**: Products include details such as baking time and type (e.g., fruit cake, meat pie).

### Product Listing

- **List Available Products**: All users can view available products.

- **Filtering**: Products can be filtered by location (distance) and type.

### Baker Profile Viewing

- **View Baker Profile**: All users can see a baker's profile, including their rating.

### Order Placement

- **Place Orders**: Members can place orders for products.

- **Availability Consideration**: Collection times are determined based on baking time and baker capacity.

### Order Management

- **View Orders**: Bakers can see their incoming orders.

- **Accept and Reject Orders**: Bakers can accept or reject orders.

- **Fulfill Orders**: Bakers fulfill orders within the agreed-upon collection time.

### Order Rating

- **Rating Orders**: Customers can rate their fulfilled orders, affecting the baker's overall rating.

## Use Case Example

Here's an example of how CakePals works:

- Alice, a baker, registers on CakePals and lists her cherry cakes and kidney pies.

- Bob, Carol, and Dan discover CakePals and use it to place orders:

  - Bob orders a kidney pie with a collection time of 14:00.
  - Carol orders a cherry pie for dinner at 19:00.
  - Dan orders a cherry pie for 16:30.

- Alice bakes and fulfills the orders, and at the end of the day, Bob, Carol, and Dan rate their orders, improving Alice's baker rating.

## Installation

1. Clone this repository to your local machine.

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. The API will be available at `http://localhost:3000`.

## Database

### Schema

**Baker**

| Attribute       | Type       | Constraints |
| --------------- | ---------- | ----------- |
| id              | string(id) | PK          |
| fistName        | string     |             |
| lastName        | string     |             |
| email           | string     | unique      |
| password        | string     |             |
| collectionStart | number     |             |
| CollectionEnd   | number     |             |
| rating          | number     |             |
| longitude       | number     |             |
| latitude        | number     |             |

**Member**

| Attribute | Type       | Constraints |
| --------- | ---------- | ----------- |
| id        | string(id) | PK          |
| fistName  | string     |             |
| lastName  | string     |             |
| email     | string     | unique      |
| password  | string     |             |
| longitude | number     |             |
| latitude  | number     |             |

**Product**

| Attribute | Type   | Constraints | References      |
| --------- | ------ | ----------- | --------------- |
| id        | string | PK          |                 |
| type      | string |             |                 |
| duration  | string |             |                 |
| bakerId   | string | FK          | Baker[id] (m-1) |

**Order**

| Attribute      | Type   | Constraints | References        |
| -------------- | ------ | ----------- | ----------------- |
| id             | string | PK          |                   |
| state          | string |             |                   |
| payment        | string |             |                   |
| collectionTime | string |             |                   |
| rating         | number |             |                   |
| memberId       | string | FK          | Member[id] (m-1)  |
| bakerId        | string | FK          | Baker[id] (m-1)   |
| productId      | string | FK          | Product[id] (m-1) |

## API Endpoints Documentation

**Start with /api**

**Bakers:**

```
   - /bakers/signup            [POST]
   - /bakers/login             [POST]
   - /bakers/available/:id     [GET]
   - /bakers/                  [GET]
   - /bakers/:id               [GET]
```

**Members:**

```
   - /members/signup            [POST]
   - /members/login             [POST]
```

**Products:**

```
   - /products/        [POST]
   - /products/search  [GET]
   - /products/        [GET]
   - /products/:id     [GET]
   - /products/:id     [PUT]
   - /products/:id     [DELETE]
```

**Orders:**

orderRouter.put("/state/:id", isBaker, orderController.updatedOrderSate); // Update order state (Baker)

```
   - /orders/             [POST]
   - /orders/             [GET]
   - /orders/:id          [GET]
   - /orders/baker/:id    [GET]
   - /orders/rate/:id     [PUT]
   - /orders/state:id     [DELETE]
```

For detailed information on the API endpoints and how to use them, please refer to the [API Documentation](api-docs.md).

## Technologies Used

- Node.js
- Express.js
- TypeScript
- SQLite (for demonstration purposes; replace with your preferred database)
- JWT (JSON Web Tokens) for authentication

## Optimizations

### Backlog:

- Integrate with the front-end to present project functionality to users.
- Add FSM (Finite State Machine) to progress order status from 'pending' to 'fulfilled' or 'rejected'.
- Add express validators
- Use day and month in orders creation (collectionTime)
- Create location entity to store Baker, Member coordinate with ability to search them directly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
