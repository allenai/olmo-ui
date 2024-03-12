FROM python:3.11.3

WORKDIR /api

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT [ "gunicorn" ]
CMD [ "--config", "gunicorn.conf.py", "app:create_app()" ]
