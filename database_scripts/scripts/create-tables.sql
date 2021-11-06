CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" TEXT NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"category_id" integer NOT NULL,
	"name" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"price" numeric(10,2) NOT NULL,
	"color_id" integer NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "colors" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "colors_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "carts" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"products_id" integer NOT NULL,
	"product_quantity" integer NOT NULL,
	"product_price" numeric(10,2) NOT NULL,
	"payment_date" timestamp with time zone,
	"removed_at" timestamp with time zone,
	CONSTRAINT "carts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category_id") REFERENCES "categories"("id");
ALTER TABLE "products" ADD CONSTRAINT "products_fk1" FOREIGN KEY ("color_id") REFERENCES "colors"("id");

ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "carts" ADD CONSTRAINT "carts_fk1" FOREIGN KEY ("products_id") REFERENCES "products"("id");
