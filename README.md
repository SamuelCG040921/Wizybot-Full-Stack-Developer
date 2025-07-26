# 🤖 WizyBot Chatbot API

> Full Stack Technical Challenge — Smart assistant powered by OpenAI with custom tool calling using NestJS.

---

## 🔧 Tech Stack

- 🚀 **NestJS 11**
- 🤖 **OpenAI API** (`gpt-3.5-turbo` with `tool_calls`)
- 📄 **CSV-based product catalog**
- 🌎 **Open Exchange Rates API** for live currency conversion
- 🧪 **Swagger** for API documentation
- 🔍 Clean architecture: Services, Controllers, DTOs

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/SamuelCG040921/Wizybot-Full-Stack-Developer.git
cd Wizybot-Full-Stack-Developer
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create a .env file in the root path with this variables
```bash
OPENAI_API_KEY=your_openai_api_key
OPEN_EXCHANGE_APP_ID=your_open_exchange_rates_app_id
```
You can use this sites to get your keys:
- https://platform.openai.com/signup
- https://openexchangerates.org/signup/

### 4️⃣ Start the server
Run this command in your terminal
```bash
npm run start:dev
```

## 📄 API Documentation
Swagger UI is available at:
📎 http://localhost:3000/docs
Includes:

- Request body structure
- Response examples
- Tool behavior explanations

## 🧪 Main Endpoint
POST /chatbot
### Request body:
```bash
{
  "query": "I'm looking for a phone"
}
```
### 🧠 Smart Behavior
Depending on the user’s input, the assistant will:

- Search products using the searchProducts tool (via CSV)
- Convert currencies using the convertCurrencies tool (via API)
- Generate responses like:
```bash
{
  "response": "I found some phones for you:\n\n1. iPhone 12\n2. iPhone 13..."
}
```
Or:
```bash
{
  "response": "350 Euros is approximately equivalent to 563.14 Canadian Dollars."
}
```

## ✅ Tests

- Unit tests: `npm run test`
- Coverage: `npm run test:cov`
- End-to-end (E2E): `npm run test:e2e`

## 🧪 Project structure
```bash
src/
├── chatbot/
│   ├── chatbot.controller.ts
│   ├── chatbot.service.ts
│   ├── tools/
│   │   ├── search-products.ts
│   │   └── convert-currencies.ts
│   └── dto/
│       └── user-query.dto.ts
├── openai/
│   ├── openai.module.ts
│   └── openai.service.ts
├── main.ts
```

## 👨‍💻 Author
Samuel Calderón
Full Stack Developer
Built with ❤️ for Wizybot technical evaluation