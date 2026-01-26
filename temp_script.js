/*Google tag*/
async
            src="https://www.googletagmanager.com/gtag/js?id=G-GGFY2CW2Q4"

window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag("js", new Date());

            gtag("config", "G-GGFY2CW2Q4");

/*Acceptrics cookie banner*/            
window.acceptrics = {};
            localStorage.setItem(
                "__acceptrics_conf",
                JSON.stringify({
                    gcmAdvanced: true,
                    backgroundColor: "#333",
                    fontColor: "#ffffff",
                    geoArea: "worldwide",
                    accountNum: "8bavvtk8",
                    useTranslation: true,
                    bannerStyle: "",
                    ec: false,
                }),
            );
            document.addEventListener("__acceptrics_loaded", () => {
                window.acceptrics.initializeSettings();
            });

document.addEventListener("DOMContentLoaded", function () {
  // Si se necesita cargar una fuente específica para hebreo
  // (La fuente SBL Hebrew es buena para hebreo con puntuación masorética)
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Alternativa si la fuente específica no está disponible
  document.querySelectorAll(".book-hebrew").forEach((element) => {
    if (!document.fonts || !document.fonts.check('12px "SBL Hebrew"')) {
      element.style.fontFamily = '"Noto Sans Hebrew", "Times New Roman", serif';
    }
  });

  // Efecto suave al cargar los libros
  const books = document.querySelectorAll(".book");
  books.forEach((book, index) => {
    book.style.opacity = "0";
    book.style.transform = "translateY(20px)";

    setTimeout(
      () => {
        book.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        book.style.opacity = "1";
        book.style.transform = "translateY(0)";
      },
      100 + index * 30,
    );
  });
});
