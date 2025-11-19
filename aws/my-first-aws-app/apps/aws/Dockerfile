FROM node:22-alpine

# 1️⃣ Set working directory to monorepo root
WORKDIR /app

# 2️⃣ Copy root package files
COPY package*.json ./

# 3️⃣ Copy gateway package.json (if it exists)
#COPY apps/aws/package*.json ./apps/aws/

# 4️⃣ Install dependencies
#RUN npm install

# 5️⃣ Copy the entire monorepo
COPY . .

# 6️⃣ Build gateway project
# RUN npx nest build apps/aws
RUN npx nest build

# 7️⃣ Run the compiled output
#CMD ["node", "dist/apps/aws/main.js"]
CMD ["node", "dist/main.js"]