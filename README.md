# README

* Ruby version
2.7.3

* Configuration
Make sure you have Ruby 2.7.3 set

yarn install
bundle install

if there's an error trying to install the gem pg (which is to connect with postgres)
Before bundle install run:
sudo gem install pg -- --with-pg-config=/Library/PostgreSQL/13/bin/pg_config
replacing the path to wherever the pg_confit is colated

* Database creation
The system won't work without the database so:
Install the latest version of postgresql
Make sure you have a user and a password like the config file, otherwise comment it and put your credentials. Also comment the dev credentials and use the ones that work locally.

Then:
rails db:create

* Database initialization
After creating the damn database and you have it running:
rails db:migrate

* How to run the test suite
