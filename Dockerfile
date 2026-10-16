FROM ruby:3.2-slim

RUN apt-get update \
    && apt-get install --no-install-recommends -y build-essential git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

COPY Gemfile ./
RUN bundle install

EXPOSE 4000 35729

CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
