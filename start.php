<?php

// Register Mustache
require "vendor/mustache/mustache/src/Mustache/Autoloader.php";
Mustache_Autoloader::register();

// Init Mustache
$mustache = new Mustache_Engine(array(
  "loader" => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . "/")
));

// Fake Tictail data
$d = array();

//
// Store info
//

$d["store_name"] = "Arrivals";

//
// Page type
//

parse_str($_SERVER["QUERY_STRING"]);

$d["product_page"] = false;
$d["about_page"] = false;
$d["list_page"] = false;

if ($page === "about") {
  $d["about_page"] = true;
} else if ($page === "list") {
  $d["list_page"] = true;
} else if ($page === "product") {
  $d["product_page"] = true;
}

//
// Product info
//

$d["product"] = array(
  "title" => "Product tile",
  "price" => "3 500",
  "price_with_currency" => "3 500 kr",
  "url" => "url-to-product",
  "id" => "1337",
  "out_of_stock" => false,

  "primary_image" = array(
    "title" => "Primary image text",
    "url-300" = "http://placehold.it/300x250"
  )
);


      </article>



// Render theme
echo $mustache->render("theme", $d);

?>