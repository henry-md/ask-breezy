# Ask Breezy

Ask Breezy is a simple chatbot that uses the OpenAI and AccuWeather APIs to generate responses. It allows you to search for weather information for any location in the world in conversational form.

## OpenAI API

This project uses the OpenAI API. You need to create an account and get an API key to use the API. Consult the [quick start guide](https://platform.openai.com/docs/quickstart) for instructions.

## AccuWeather API

We will be using AccuWeather developer services to obtain weather forecasts. AccuWeather is an American company that offers international weather forecasting services. Go to the [AccuWeather API](https://developer.accuweather.com/) website and create a free account. Following this, you should register a new application to obtain an API key. 

## Convex

This project uses [Convex](https://convex.dev/) for the backend. You need to create a free account.

## Run locally

Clone the repository and install the dependencies.

```bash
cd ask-breezy
pnpm install
```

Run the following command to start the Convex development server.

```bash
npx convex dev
```

The first time you run the command, you will be asked to log in to your Convex account. Follow the instructions in the terminal. It will also ask you to create a new project. You can use the default settings.

Once the development server is running, you will see a `.env.local` file in the project root. Don't modify this file directly. Don't commit this file to the repository either.

At this point, you need to set you OpenAI and AccuWeather API keys. Run the following command:

```bash
npx convex env set OPENAI_API_KEY sk-...
npx convex env set ACCUWEATHER_API_KEY ...
```

This needs to be done only once. The API key will be stored on the Convex server and will be used every time you run the development server. From this point on, you can start the Convex development server with the following command:

```bash
npx convex dev
```

Finally, run the following command to start the frontend development server.

```bash
pnpm dev
```

Open the browser and navigate to <http://localhost:5173/>.
