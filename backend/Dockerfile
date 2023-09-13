# Pull the python image
FROM python:3.9

# Copy requirements.txt
COPY ./requirements.txt /app/requirements.txt

# Switch working directory
WORKDIR /app

# Install dependecies and packages in the requirements file
RUN pip install -r requirements.txt

# Copy every content from the local file to the image
COPY . /app

# Configure the container to run in an executed manner
ENTRYPOINT ["python"]

CMD ["app.py"]