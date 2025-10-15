import fs from "fs";

const text = `Cómo se llama el evento que promueve la ciencia, la tecnología y la innovación en Ituzaingó?
Innovatech

Innovatech es un espacio de encuentro entre empresas, instituciones educativas y gobierno para compartir innovación tecnológica?

Si 

¿Qué tren llega hasta la estación de Ituzaingó?
Tren Sarmiento 

Ituzaingo tiene 38,51Km2 , cuántos Barrios tiene?
42 Barrios 

¿Qué autopista pasa por Ituzaingó
 Acceso Oeste 

¿Qué significa “Ituzaingó”, voz Guaraní?
“Agua que cae, Catarata 

¿Qué club de fútbol tiene sede en la ciudad?
 Club Atlético Ituzaingó 

¿Qué río atraviesa la zona?
Río Reconquista 

¿Qué día se festeja el aniversario de la ciudad?
24 de octubre 

En qué año se presentó el Escudo de Ituzaingó, que representa su  identidad, su espacio y su historia.
En el año 2014 


¿Cómo se llama la avenida más comercial?
Santa Rosa 

A las personas que viven en Ituzaingó cómo se les  llama?
ituzainguenses

En 1940 cuál fue una de las primeras Familias en instalarse en Villa Udaondo?
La Familia Leloir 

¿Qué lugar es ideal para hacer picnic o deportes al aire libre en Ituzaingó?
 Parque Leloir 

¿Qué partido limita con Ituzaingó al oeste?
Merlo 

¿Qué herramienta utiliza el municipio para acompañar a los emprendedores y pymes locales?

Las Rondas de Negocios y el Programa de Desarrollo Productivo.

¿Qué famoso escritor o artista argentino vivió en Parque Leloir?
 Luis Alberto Spinetta 

¿Qué tipo de árboles abundan en las calles de Ituzaingó?
 Tipas y jacarandás 

¿Qué evento cultural suele realizarse en la plaza San Martín?
Feria del libro y emprendedores 

¿Cómo se llama el evento que promueve la ciencia, la tecnología y la innovación en Ituzaingó?
Innovatech 
`;

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
