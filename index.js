import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = process.env.PORT;

const db = new pg.Client({
  user:process.env.USER_NAME,
  host:process.env.HOST,
  database:process.env.DATABASE,
  password:process.env.PASSWORD,
  port:process.env.SQL_PORT
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req,res)=>{
  const result = await db.query("SELECT code FROM countries")
  let countries=[]
  result.rows.forEach(country=>{
    countries.push(country.code)
  });
  console.log(result.rows)
  res.render("index.ejs",{countries:countries , total:countries.length})

})
app.post("/add", async (req, res) => {
  const input = req.body["country"];
 const imp_input = input.charAt(0).toUpperCase() + input.slice(1)
  const result = await db.query(
    "SELECT country_code FROM all_countries WHERE country = $1",
    [imp_input]
  );

  if (result.rows.length !== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO countries (code) VALUES ($1)", [
      countryCode,
    ]);
    res.redirect("/");
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});