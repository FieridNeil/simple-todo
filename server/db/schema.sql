create database if not exists simpletodo;

use simpletodo;

create table todo (
	id int not null auto_increment primary key,
    name varchar(255) not null,
    is_done bool not null,
    due_date datetime null,
    avt_id int not null
);

create table avatar (
	id int not null auto_increment primary key,
    initial varchar(2) not null default '--' unique,
    background_color varchar(7) not null default '#ccc' unique
);

insert into avatar (initial, background_color) values (default, default);