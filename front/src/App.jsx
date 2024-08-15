import { Outlet, useLoaderData } from "react-router-dom";
import CategoryList from "./components/categories/CategoryList";
import { Box, Typography, Container } from "@mui/material";
// import { Slideshow } from "@mui/icons-material";
import Slideshow from "./components/Slideshow";

function App() {
  const data = useLoaderData();
  // console.log(`app`, data);

  const images = [
    "/images/Kazimiero_baznycia.jpg",
    "/images/Petro_ir_Povilo_baznycia.jpg",
    "/images/Rotuses_pozemiai.jpg",
    "/images/sunisku_peduciu_kelias.jpg",
    "/images/Valdovu_rumai.jpg",
  ];

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Atraskite Vilniaus Stebuklus Su Mūsų Ekskursijomis!
          </Typography>
          <div className="App">
            <Slideshow images={images} interval={2000} />
          </div>
          <Typography variant="h6" paragraph>
            Vilnius – miestas, kurio istorija ir kultūra žavi kiekvieną
            keliautoją. Mūsų ekskursijos suteiks jums galimybę atrasti šį
            nuostabų miestą iš naujos perspektyvos. Nesvarbu, ar esate pavienis
            keliautojas, ar didelė grupė, mūsų kruopščiai paruošti maršrutai
            atitiks jūsų lūkesčius ir interesus.
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Ekskursijos Pavieniams
          </Typography>
          <Typography variant="body1" paragraph>
            Jei keliaujate vienas arba su draugu ir ieškote asmeniškesnio
            patyrimo, mūsų ekskursijos pavieniams yra puikus pasirinkimas. Mūsų
            gidai jums pasiūlys įdomius ir informatyvius pasakojimus apie
            svarbiausias Vilniaus vietas, architektūros šedevrus ir istorinius
            įvykius. Pasirinkite iš įvairių teminių ekskursijų:
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Ekskursijos Grupėms
          </Typography>
          <Typography variant="body1" paragraph>
            Planavote kelionę su šeima, draugais ar kolegomis? Mūsų ekskursijos
            grupėms yra pritaikytos specialiai jūsų poreikiams. Pasirinkite iš
            mūsų įvairių programų ir mėgaukitės kokybišku laiku kartu. Siūlome:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Kultūriniai ir Teminiai Turo Paketai – Suformuokite savo turą
                pagal interesus ir poreikius, pvz., kulinarijos, istorijos ar
                meno tematikos ekskursijas.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Korporatyvinės Ekskursijos – Stiprinkite komandą ir gerinkite
                tarpusavio ryšius per įdomias ir praturtinančias ekskursijas.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Šeimos Pasiūlymai – Pasirinkite šeimai pritaikytus maršrutus su
                veiklomis, pritaikytomis visiems amžiaus grupėms.
              </Typography>
            </li>
          </ul>
        </Box>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Rezervuokite Dabar
          </Typography>
          <Typography variant="body1" paragraph>
            Pradėkite savo nuotykį ir patirkite Vilniaus grožį su mūsų
            profesionalių gidų pagalba. Užsisakykite ekskursiją šiandien ir
            leiskite sau pasinerti į unikalią Vilniaus atmosferą.
          </Typography>

          <CategoryList categories={data.categories} />
        </Box>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Kodėl Rinktis Mus?
          </Typography>
          <Typography variant="body1" paragraph>
            • <strong>Profesionalūs Gidai</strong> – Mūsų gidai yra patyrę ir
            aistringi Vilniaus istorijos ir kultūros žinovai.
            <br />• <strong>Lankstūs Planai</strong> – Mes prisitaikome prie
            jūsų poreikių ir pageidavimų.
            <br />• <strong>Kokybiškas Aptarnavimas</strong> – Užtikriname, kad
            jūsų patirtis būtų maloni ir atitiktų aukščiausius standartus.
          </Typography>
          <Typography variant="body1" paragraph>
            Atraskite Vilniaus stebuklus su mumis ir padarykite savo kelionę
            įsimintiną!
          </Typography>
        </Box>
      </Container>

      <Outlet />
    </>
  );
}

export default App;
