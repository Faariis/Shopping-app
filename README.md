# Database
<p>Koristio sam mySql. Bazu sam nazvao prodavnica. Ona se sastoji od 4 tabele: shoppers, shopping_lists, shopping_items, shopping_list_items. Nisam želio puno komplikovati što se tiče same baze. Ovdje u MySql folderu imaju fajlovi za kreiranje ovih tabela, također ima baza.txt koja također sadrži query. Prilikom pokretanja provjerite .env tu su podaci o konekciji i potrebno je namjestiti PASSWORD i USERNAME.</p>

# Backend
<p>Što se tiče bekenda koristio sam Node.js i Express.js. Ima dosta CRUD endpointa. Za kupce i proizvode ima 8 endpointa koji pružaju osnovnu funkcionalnost, a to je GET, POST, PATCH i DELETE. Sve sam ih testirao u Potmanu međutim implementirao sam samo GET funkcije da bi ispisali podatke na ekranu jer se tražilo po 5 kupaca i proizvoda u zadatku. Što se tiče same liste/Shopping_lists ona se sastoji od 8 CRUD endpointa. Prva služi da GET-a sve liste, druga vraća samo jednu i ona je služila za testiranje. Postoji jedna POST funkcija za kreiranje liste gdje se vrše određene provjere koje su navedene u zadatku. Postoje 2 PATCH funkcije. Jedna briše listu i omogućava unos novih proizvoda, novog id-a korisnika i novi naziv, nju sam koristio radi testiranja. A druga doda novi proizvod. Postoje 3 delete funkcije. Jedna briše cijelu listu, jedna briše samo jedan proizvod iz liste, zadnja briše sve liste.</p>

# Frontedn
<p>Koristio sam Angular. Nisam se puno bazirao na frontend jer želio sam što prije predati.</p>

# Logika
<p>Napravio sam tako kao što piše u zadatku da se proizvod ne smije pojaviti na više od 3 liste. Također stavio sam ograničenje da se može napraviti 1 lista po korisniku. U listama ne smije se dodati isti proizvod dva puta. Sva sam ograničenja stavio u bekendu tako da se one samo prikažu u alertu. Također nisam htio puno komplikovati pa sam prosliđivao id-ove.</p>

# Pokretanje
<p>Kada se otvori pokrenuti npm install u terminalu. Kada se sve doda pokrenuti npm start za node, a ng serve za angular. Skripta za bazu se nalazi u folderu i pogledati .env.</p>