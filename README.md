# StratoStruct Backend Server

Welcome to the StratoStruct Backend Server repository, the backbone of the StratoStruct web application. StratoStruct is engineered using the robust MERN stack (MongoDB, Express.js, React, Node.js), designed to provide a platform for managing and analysing the supply chain for offsite manufacturing of construction components. This server is deployed using the Serverless Framework on AWS Lambda, ensuring scalable and reliable access for users.

## Overview

StratoStruct's backend server is a crucial component that interfaces with the frontend to perform operations such as authentication, data manipulation, and real-time updates. It is designed with scalability, security, and efficiency in mind, making it ideal for handling complex data.

**Visit the Website**: [StratoStruct](http://www.stratostruct.com/)
**Visit the Client Repo** [Client](https://github.com/HOOLAHAN/stratostruct_client)

## Key Features

- **Secure Authentication**: Implements JWT for robust user authentication and authorisation, safeguarding data integrity and privacy.
- **RESTful API Endpoints**: Offers a suite of API endpoints for CRUD operations (Create, Read, Update, Delete) on supply chain data, facilitating seamless data management.
- **MongoDB Integration**: Utilises MongoDB for persistent storage, ensuring data durability and high performance.
- **Real-Time Synchronisation**: Employs WebSocket technology for real-time data updates, enhancing user experience with instant data refresh.
- **Advanced Error Handling**: Incorporates comprehensive error handling and logging mechanisms for improved app stability and debugging.
- **Authorisation Middleware**: Features custom middleware for fine-grained access control, ensuring that users can only access data they are authorised to view or modify.

## Project Organisation

The server's architecture is modular, promoting code reusability and ease of maintenance. Key components include:

- `controllers/`: Houses request handling logic for API endpoints.
- `middleware/`: Contains custom middleware for authentication and authorisation.
- `models/`: Defines MongoDB schema and models for data representation.
- `routes/`: Maps API endpoints to corresponding controller logic.
- `server.js`: The entry point of the application. It initialises the server, middleware, and routes.
- `handler.js`: The entry point for the Serverless Framework. It initialises the Lambda functions.
- `serverless.yml`: Configuration file for the Serverless Framework, defining functions, resources, and plugins.
- `package.json`: Specifies project dependencies and configurations.

## Deployment and CI/CD

This project leverages GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD), automating the deployment process to AWS Lambda upon code pushes to the main branch. This ensures that the latest version of the application is always available without manual intervention.

## Environment Variables

To ensure the proper functionality of the StratoStruct Backend Server, the following environment variables are required:

- `MONGO_URI`: Your MongoDB connection string, necessary for connecting to your database.
- `SECRET`: A secret key used for signing and verifying JWT tokens for authentication purposes. It's crucial for maintaining the security of your user's sessions.
- `MAPBOX_API_KEY`: An API key obtained from Mapbox, required if you're using Mapbox services for mapping or location features within your application.

## Getting Started

### Prerequisites

- Node.js installed locally for development.
- An active MongoDB database connection, either locally or via MongoDB Atlas, for data storage.
- Access to an AWS account for deployment using the Serverless Framework.

### Local Setup

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Set up your environment variables in a `.env` file at the root of the project, including the database URI, secret for JWT, and any other service-specific keys as mentioned above.
4. Deploy the server using the Serverless Framework with `sls deploy`. The application should now be running and accessible through AWS Lambda.

### Running Locally

To run the server locally for development:

1. Start the server locally with `npm start`. The application should now be running and accessible on the specified port.

### Contributing

We welcome contributions from the community! If you'd like to contribute, please follow the standard GitHub fork and pull request workflow. Make sure your code adheres to the project's coding standards and include tests for new features or bug fixes.

## Support and Contact

Should you encounter any issues or have questions regarding the StratoStruct backend server, please do not hesitate to reach out to us. You can file an issue through the GitHub issue tracker or contact the maintainers directly via email.

Thank you for exploring the StratoStruct backend server. For the legacy version, visit the [StratoStruct Legacy](https://github.com/HOOLAHAN/stratostruct-legacy) repository.
