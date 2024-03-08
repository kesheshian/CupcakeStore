FROM node:20
WORKDIR /usr/src/app

# Install Python and the virtual environment package
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment and activate it
RUN python3 -m venv cqlshenv
ENV PATH="/usr/src/app/cqlshenv/bin:$PATH"

# Install cqlsh in the virtual environment
RUN pip install cqlsh

# Copy the script and make it executable
COPY wait-for-scylla.sh .
RUN chmod +x wait-for-scylla.sh

# Install wait-for-scylla.sh
COPY wait-for-scylla.sh /wait-for-scylla.sh
RUN chmod +x /wait-for-scylla.sh

# Install app dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Build app
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
