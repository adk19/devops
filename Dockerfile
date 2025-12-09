FROM node:20-alpine

# Set working directory
WORKDIR /user/src/app

# Copy package.json + package-lock first (cashing)
COPY package*.json ./

# Install production dependencies only (dev deps not needed to run)
# User --omit=dev to avoid installing deveDependencies in final image.
RUN npm ci --omit=dev

# Copy rest of app files
COPY . .
# Expose port your app use
EXPOSE 3000

# Start app
CMD ["npm", "start"]