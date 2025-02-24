import fs from "fs";

const text = `1 - Cómo se llama el Puente de la Imponente obra víal que une Chaco’i con Asunción?  
Puente Héroes del Chaco

2- Quién es el Presidente del Paraguay Electo desde el 2023 al 2028?
Santiago Peña

3- ¿Qué ríos forman parte de la Hidrovía Paraguay-Paraná?
Río Paraguay y Río Paraná

4- ¿Cuál es la moneda oficial de Paraguay?
Guaraní (PYG)

5- ¿Cuántos habitantes tiene Paraguay aproximadamente en 2024?
Aproximadamente 7,5 millones

6- ¿Cómo se llama la festividad religiosa más importante de Paraguay?
Fiesta de la Virgen de Caacupé

7- ¿Qué instrumento musical es símbolo de Paraguay?
Arpa paraguaya

8- ¿Qué idioma, además del español, es oficial en Paraguay?
Guaraní

9- ¿Cómo se llama el autor del Multipremiado Libro "Chipas de Raíces Profundas, Páginas con Sabor”
¨Grillo¨ Benitez

10- ¿Cómo se llama la sopa sólida que se come en Paraguay?
Sopa paraguaya

11- ¿Cuál es la bebida fría tradicional preparada con yerba mate y agua fría?
Tereré

12- ¿Cuál es el plato típico hecho con harina de maíz y queso?
Chipa

13- ¿Qué ciudad paraguaya es conocida como la "Capital del Verano"?
San Bernardino

14- ¿Cómo se llama la mayor represa hidroeléctrica compartida entre Paraguay y Brasil?
Itaipú

15- ¿Cuál es la capital de Paraguay?
Asunción

16- ¿Qué guerra libró Paraguay contra Bolivia?
Guerra del Chaco

17- ¿En qué año se independizó Paraguay?
1811

18- Cuál fue el primer presidente de Paraguay?
Carlos Antonio López

19- Cómo se llama la Principal organización que agrupa a las empresas y entidades dedicadas al desarrollo de software en Paraguay?
CISOFT - Cámara Paraguaya de la Industria del Software

20- Cómo se llama la Empresa Paraguaya que Desarrolla y Comercializa Soluciones Tecno Educativas?
La Clase Digital`;

const formattedData = text
  .split(/\n?\d+[-–.] /)
  .slice(1)
  .map((entry) => {
    const parts = entry.split("\n");
    return {
      question: parts[0].trim(),
      answer: parts.slice(1).join(" ").trim(),
    };
  });

fs.writeFileSync("output.json", JSON.stringify(formattedData, null, 2));

console.log("JSON generado y guardado como output.json");
