interface TagInfo {
  polish: string
  english: string
  explanation: string
  category: string
}

const tagTranslations: { [key: string]: TagInfo } = {
  // Gatunki
  Action: {
    polish: "Akcja",
    english: "Action",
    explanation:
      "Anime pełne dynamicznych scen, szybkich pościgów, intensywnych walk i wysokiego tempa akcji, często skupiające się na fizycznych wyzwaniach bohaterów.",
    category: "Gatunki",
  },
  Adventure: {
    polish: "Przygoda",
    english: "Adventure",
    explanation:
      "Produkcje, w których bohaterowie wyruszają w długą podróż, eksplorują nowe światy, podejmują wyprawy i odkrywają tajemnice nieznanych krain.",
    category: "Gatunki",
  },
  Comedy: {
    polish: "Komedia",
    english: "Comedy",
    explanation:
      "Anime, których głównym celem jest rozbawienie widza – wykorzystują humor sytuacyjny, zabawne dialogi i często absurdalne zdarzenia.",
    category: "Gatunki",
  },
  Drama: {
    polish: "Dramat",
    english: "Drama",
    explanation:
      "Produkcje koncentrujące się na emocjonalnych konfliktach, głębokich relacjach między postaciami oraz trudnych sytuacjach życiowych, często budujących silny ładunek emocjonalny.",
    category: "Gatunki",
  },
  Ecchi: {
    polish: "Ecchi",
    english: "Ecchi",
    explanation:
      "Anime, w których pojawiają się sugestywne sceny, lekkie odniesienia do erotyki i elementy fan serwisu, ale bez jawnie eksplicytnej treści erotycznej.",
    category: "Gatunki",
  },
  Fantasy: {
    polish: "Fantastyka",
    english: "Fantasy",
    explanation:
      "Produkcje osadzone w magicznych, często baśniowych światach, gdzie występują czary, mityczne stworzenia i niezwykłe moce.",
    category: "Gatunki",
  },
  Horror: {
    polish: "Horror",
    english: "Horror",
    explanation:
      "Anime, których celem jest wywołanie uczucia strachu, niepokoju i napięcia, często z elementami nadprzyrodzonymi lub psychologicznymi.",
    category: "Gatunki",
  },
  "Mahou Shoujo": {
    polish: "Magiczna Dziewczyna",
    english: "Magical Girl",
    explanation:
      "Produkcje, w których głównymi bohaterkami są młode dziewczęta obdarzone magicznymi mocami, zwykle walczące z siłami zła i często przeżywające dramatyczne przemiany.",
    category: "Gatunki",
  },
  Mecha: {
    polish: "Mecha",
    english: "Mecha",
    explanation:
      "Anime skupiające się na gigantycznych robotach lub maszynach – zarówno jako narzędzia walki, jak i symbol nowoczesnej technologii, często w kontekście konfliktów militarystycznych.",
    category: "Gatunki",
  },
  Music: {
    polish: "Muzyka",
    english: "Music",
    explanation:
      "Produkcje, w których muzyka, koncerty, życie w zespole lub kariera muzyczna stanowią kluczowy element fabuły i wpływają na rozwój postaci.",
    category: "Gatunki",
  },
  Mystery: {
    polish: "Tajemnica",
    english: "Mystery",
    explanation:
      "Anime, które w centrum uwagi stawiają zagadki, niewyjaśnione zdarzenia lub kryminalne intrygi, zmuszając bohaterów (i widzów) do stopniowego odkrywania prawdy.",
    category: "Gatunki",
  },
  Psychological: {
    polish: "Psychologiczny",
    english: "Psychological",
    explanation:
      "Produkcje badające głębokie procesy mentalne, wewnętrzne konflikty oraz złożone stany emocjonalne bohaterów, często z elementami suspensu i introspekcji.",
    category: "Gatunki",
  },
  Romance: {
    polish: "Romans",
    english: "Romance",
    explanation:
      "Anime, których głównym tematem są miłość i związki – zarówno pierwsze zauroczenia, jak i skomplikowane relacje między postaciami.",
    category: "Gatunki",
  },
  "Sci-Fi": {
    polish: "Science Fiction",
    english: "Sci-Fi",
    explanation:
      "Produkcje eksplorujące futurystyczne koncepcje, zaawansowaną technologię, podróże kosmiczne oraz alternatywne wersje rzeczywistości, często z elementami spekulatywnymi.",
    category: "Gatunki",
  },
  "Slice of Life": {
    polish: "Życie Codzienne",
    english: "Slice of Life",
    explanation:
      "Anime przedstawiające zwykłe, codzienne życie, relacje między ludźmi i drobne perypetie bohaterów, często w realistycznym i stonowanym tonie.",
    category: "Gatunki",
  },
  Sports: {
    polish: "Sport",
    english: "Sports",
    explanation:
      "Produkcje koncentrujące się na rywalizacji sportowej, treningach, drużynowej współpracy i rozwoju osobistym przez pryzmat aktywności fizycznej.",
    category: "Gatunki",
  },
  Supernatural: {
    polish: "Nadprzyrodzone",
    english: "Supernatural",
    explanation:
      "Anime, w których występują zjawiska i byty wykraczające poza granice naturalnego świata – duchy, demony, moce magiczne czy inne niewyjaśnione zjawiska.",
    category: "Gatunki",
  },
  Thriller: {
    polish: "Thriller",
    english: "Thriller",
    explanation:
      "Produkcje budujące napięcie, niepewność i intensywną atmosferę, często z zaskakującymi zwrotami akcji oraz elementami kryminalnymi lub psychologicznymi.",
    category: "Gatunki",
  },
  Hentai: {
    polish: "Hentai",
    english: "Hentai",
    explanation:
      "Anime o treściach jawnie erotycznych lub pornograficznych, przeznaczone głównie dla dorosłej widowni.",
    category: "Gatunki",
  },

  // Obsada / Główna Obsada
  "Anti-Hero": {
    polish: "Antybohater",
    english: "Anti-Hero",
    explanation:
      "Główny bohater, który nie spełnia tradycyjnych cech heroizmu – może mieć wady, działać na pograniczu moralności lub podejmować kontrowersyjne decyzje.",
    category: "Obsada / Główna Obsada",
  },
  "Elderly Protagonist": {
    polish: "Starszy Protagonista",
    english: "Elderly Protagonist",
    explanation:
      "Anime, w których główną rolę odgrywa postać w podeszłym wieku, często posiadająca dużą życiową wiedzę i doświadczenie.",
    category: "Obsada / Główna Obsada",
  },
  "Ensemble Cast": {
    polish: "Zbiorowa Obsada",
    english: "Ensemble Cast",
    explanation:
      "Produkcje, w których akcja rozwija się równolegle na tle wielu równorzędnych postaci, każda z własnym wątkiem i historią.",
    category: "Obsada / Główna Obsada",
  },
  "Estranged Family": {
    polish: "Rozdzielona Rodzina",
    english: "Estranged Family",
    explanation:
      "Anime, w których centralnym motywem są konflikty lub separacja między członkami rodziny, co wpływa na rozwój fabuły i losy bohaterów.",
    category: "Obsada / Główna Obsada",
  },
  "Female Protagonist": {
    polish: "Kobieta Protagonista",
    english: "Female Protagonist",
    explanation:
      "Produkcje, w których główną rolę pełni kobieta – jej przygody, wyzwania i rozwój osobisty są kluczowe dla narracji.",
    category: "Obsada / Główna Obsada",
  },
  "Male Protagonist": {
    polish: "Mężczyzna Protagonista",
    english: "Male Protagonist",
    explanation:
      "Anime, w których głównym bohaterem jest mężczyzna, a jego ścieżka życiowa i decyzje kształtują przebieg historii.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Adult Cast": {
    polish: "Głównie Dorosła Obsada",
    english: "Primarily Adult Cast",
    explanation:
      "Produkcje, w których większość postaci to dorośli, poruszające tematy związane z życiem zawodowym, rodziną i dojrzałymi problemami.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Animal Cast": {
    polish: "Głównie Zwierzęca Obsada",
    english: "Primarily Animal Cast",
    explanation:
      "Anime, w których głównymi bohaterami są zwierzęta – często ożywione, antropomorficzne postaci nadające się do opowiadania nietypowych historii.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Child Cast": {
    polish: "Głównie Dziecięca Obsada",
    english: "Primarily Child Cast",
    explanation:
      "Produkcje skupiające się na przygodach i problemach dzieci, z perspektywą młodego widza oraz tematami dojrzewania.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Female Cast": {
    polish: "Głównie Żeńska Obsada",
    english: "Primarily Female Cast",
    explanation:
      "Anime, w których dominują kobiece postaci, co wpływa na sposób opowiadania historii, relacje i tematykę.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Male Cast": {
    polish: "Głównie Męska Obsada",
    english: "Primarily Male Cast",
    explanation:
      "Produkcje, w których przeważają postaci męskie, często z akcentem na rywalizację, przyjaźń i męskie wzorce zachowań.",
    category: "Obsada / Główna Obsada",
  },
  "Primarily Teen Cast": {
    polish: "Głównie Nastolatkowa Obsada",
    english: "Primarily Teen Cast",
    explanation:
      "Anime, w których głównymi bohaterami są nastolatkowie, ukazujące ich zmagania z dorastaniem, pierwsze miłości oraz konflikty pokoleniowe.",
    category: "Obsada / Główna Obsada",
  },

  // Tematy / Slice of Life
  Agriculture: {
    polish: "Rolnictwo",
    english: "Agriculture",
    explanation: "Życie na farmie lub uprawa roślin.",
    category: "Tematy / Slice of Life",
  },
  "Cute Boys Doing Cute Things": {
    polish: "Słodcy Chłopcy Robią Słodkie Rzeczy",
    english: "Cute Boys Doing Cute Things",
    explanation: "Codzienne życie uroczych chłopców.",
    category: "Tematy / Slice of Life",
  },
  "Cute Girls Doing Cute Things": {
    polish: "Słodkie Dziewczyny Robią Słodkie Rzeczy",
    english: "Cute Girls Doing Cute Things",
    explanation: "Codzienne życie uroczych dziewczyn.",
    category: "Tematy / Slice of Life",
  },
  "Family Life": {
    polish: "Życie Rodzinne",
    english: "Family Life",
    explanation: "Relacje rodzinne jako główny motyw.",
    category: "Tematy / Slice of Life",
  },
  Horticulture: {
    polish: "Hodowla Roślin",
    english: "Horticulture",
    explanation: "Pielęgnacja roślin i ogrodnictwo.",
    category: "Tematy / Slice of Life",
  },
  Iyashikei: {
    polish: "Iyashikei",
    english: "Iyashikei",
    explanation: "Relaksujące, uspokajające anime (np. Mushishi).",
    category: "Tematy / Slice of Life",
  },
  Parenthood: {
    polish: "Rodzicielstwo",
    english: "Parenthood",
    explanation: "Tematyka bycia rodzicem.",
    category: "Tematy / Slice of Life",
  },

  // Tematy / Inne
  Adoption: {
    polish: "Adopcja",
    english: "Adoption",
    explanation: "Bohaterowie adoptowani lub adoptujący.",
    category: "Tematy / Inne",
  },
  Animals: {
    polish: "Zwierzęta",
    english: "Animals",
    explanation: "Zwierzęta jako kluczowi bohaterowie.",
    category: "Tematy / Inne",
  },
  Astronomy: {
    polish: "Astronomia",
    english: "Astronomy",
    explanation: "Nauka o gwiazdach i kosmosie.",
    category: "Tematy / Inne",
  },
  Autobiographical: {
    polish: "Autobiograficzne",
    english: "Autobiographical",
    explanation: "Historia oparta na życiu twórcy.",
    category: "Tematy / Inne",
  },
  Biographical: {
    polish: "Biograficzne",
    english: "Biographical",
    explanation: "Adaptacja życia realnej osoby.",
    category: "Tematy / Inne",
  },
  "Body Horror": {
    polish: "Horror Ciała",
    english: "Body Horror",
    explanation: "Przemiany fizyczne budzące grozę.",
    category: "Tematy / Inne",
  },
  Cannibalism: {
    polish: "Kanibalizm",
    english: "Cannibalism",
    explanation: "Motyw jedzenia ludzi.",
    category: "Tematy / Inne",
  },
  Chibi: {
    polish: "Chibi",
    english: "Chibi",
    explanation: "Przerysowany, słodki styl rysunku.",
    category: "Tematy / Inne",
  },
  "Cosmic Horror": {
    polish: "Kosmiczny Horror",
    english: "Cosmic Horror",
    explanation: "Strach przed niepojętym kosmosem.",
    category: "Tematy / Inne",
  },
  Crime: {
    polish: "Kryminał",
    english: "Crime",
    explanation: "Śledztwa i przestępczość.",
    category: "Tematy / Inne",
  },
  Crossover: {
    polish: "Crossover",
    english: "Crossover",
    explanation: "Połączenie światów różnych serii.",
    category: "Tematy / Inne",
  },
  "Death Game": {
    polish: "Gra Śmierci",
    english: "Death Game",
    explanation: "Śmiertelne wyzwania (np. Squid Game).",
    category: "Tematy / Inne",
  },
  Denpa: {
    polish: "Denpa",
    english: "Denpa",
    explanation: "Surrealistyczne, psychodeliczne motywy.",
    category: "Tematy / Inne",
  },
  Drugs: {
    polish: "Narkotyki",
    english: "Drugs",
    explanation: "Tematyka uzależnień.",
    category: "Tematy / Inne",
  },
  Economics: {
    polish: "Ekonomia",
    english: "Economics",
    explanation: "Systemy finansowe jako fabuła.",
    category: "Tematy / Inne",
  },
  Educational: {
    polish: "Edukacyjne",
    english: "Educational",
    explanation: "Nauka poprzez anime.",
    category: "Tematy / Inne",
  },
  Environmental: {
    polish: "Ekologia",
    english: "Environmental",
    explanation: "Problemy środowiska naturalnego.",
    category: "Tematy / Inne",
  },
  "Ero Guro": {
    polish: "Ero Guro",
    english: "Ero Guro",
    explanation: "Połączenie erotyki i groteski.",
    category: "Tematy / Inne",
  },
  Filmmaking: {
    polish: "Tworzenie Filmów",
    english: "Filmmaking",
    explanation: "Proces produkcji filmowej.",
    category: "Tematy / Inne",
  },
  "Found Family": {
    polish: "Znaleziona Rodzina",
    english: "Found Family",
    explanation: "Grupa stająca się rodziną.",
    category: "Tematy / Inne",
  },
  Gambling: {
    polish: "Hazard",
    english: "Gambling",
    explanation: "Gry losowe i ryzyko.",
    category: "Tematy / Inne",
  },
  "Gender Bending": {
    polish: "Zmiana Płci",
    english: "Gender Bending",
    explanation: "Eksperymenty z tożsamością płciową.",
    category: "Tematy / Inne",
  },
  Gore: {
    polish: "Gore",
    english: "Gore",
    explanation: "Drastyczne sceny przemocy.",
    category: "Tematy / Inne",
  },
  "Language Barrier": {
    polish: "Bariera Językowa",
    english: "Language Barrier",
    explanation: "Problemy komunikacyjne.",
    category: "Tematy / Inne",
  },
  "LGBTQ+ Themes": {
    polish: "Motyw LGBTQ+",
    english: "LGBTQ+ Themes",
    explanation: "Postacie nieheteronormatywne.",
    category: "Tematy / Inne",
  },
  "Lost Civilization": {
    polish: "Zaginiona Cywilizacja",
    english: "Lost Civilization",
    explanation: "Odkrywanie starożytnych kultur.",
    category: "Tematy / Inne",
  },
  Marriage: {
    polish: "Małżeństwo",
    english: "Marriage",
    explanation: "Relacje małżeńskie jako temat.",
    category: "Tematy / Inne",
  },
  Medicine: {
    polish: "Medycyna",
    english: "Medicine",
    explanation: "Bohaterowie-lekarze lub tematyka zdrowia.",
    category: "Tematy / Inne",
  },
  "Memory Manipulation": {
    polish: "Manipulacja Pamięcią",
    english: "Memory Manipulation",
    explanation: "Zmiana lub wymazywanie wspomnień.",
    category: "Tematy / Inne",
  },
  Meta: {
    polish: "Meta",
    english: "Meta",
    explanation: "Samoświadomość gatunku (np. parodia konwencji).",
    category: "Tematy / Inne",
  },
  Mountaineering: {
    polish: "Wspinaczka Górska",
    english: "Mountaineering",
    explanation: "Wyprawy na szczyty.",
    category: "Tematy / Inne",
  },
  Noir: {
    polish: "Noir",
    english: "Noir",
    explanation: "Mroczne, detektywistyczne klimaty.",
    category: "Tematy / Inne",
  },
  "Otaku Culture": {
    polish: "Kultura Otaku",
    english: "Otaku Culture",
    explanation: "Życie fanów anime/mangi.",
    category: "Tematy / Inne",
  },
  Pandemic: {
    polish: "Pandemia",
    english: "Pandemic",
    explanation: "Epidemie i wirusy.",
    category: "Tematy / Inne",
  },
  Philosophy: {
    polish: "Filozofia",
    english: "Philosophy",
    explanation: "Rozważania egzystencjalne.",
    category: "Tematy / Inne",
  },
  Politics: {
    polish: "Polityka",
    english: "Politics",
    explanation: "Intrygi władzy i rządu.",
    category: "Tematy / Inne",
  },
  "Proxy Battle": {
    polish: "Walka przez Pełnomocnika",
    english: "Proxy Battle",
    explanation: "Konflikty rozgrywane przez zastępców.",
    category: "Tematy / Inne",
  },
  Psychosexual: {
    polish: "Psychoseksualne",
    english: "Psychosexual",
    explanation: "Złożone relacje na tle seksualnym.",
    category: "Tematy / Inne",
  },
  Reincarnation: {
    polish: "Reinkarnacja",
    english: "Reincarnation",
    explanation: "Ponowne narodziny duszy.",
    category: "Tematy / Inne",
  },
  Religion: {
    polish: "Religia",
    english: "Religion",
    explanation: "Wiara i instytucje religijne.",
    category: "Tematy / Inne",
  },
  "Royal Affairs": {
    polish: "Sprawy Królewskie",
    english: "Royal Affairs",
    explanation: "Dworskie intrygi.",
    category: "Tematy / Inne",
  },
  Slavery: {
    polish: "Niewolnictwo",
    english: "Slavery",
    explanation: "Walka o wolność.",
    category: "Tematy / Inne",
  },
  "Software Development": {
    polish: "Tworzenie Oprogramowania",
    english: "Software Development",
    explanation: "Programiści jako bohaterowie.",
    category: "Tematy / Inne",
  },
  Survival: {
    polish: "Przetrwanie",
    english: "Survival",
    explanation: "Walka o przetrwanie w ekstremalnych warunkach.",
    category: "Tematy / Inne",
  },
  Terrorism: {
    polish: "Terroryzm",
    english: "Terrorism",
    explanation: "Ataki i zamachy.",
    category: "Tematy / Inne",
  },
  Torture: {
    polish: "Tortury",
    english: "Torture",
    explanation: "Sceny fizycznego lub psychicznego znęcania.",
    category: "Tematy / Inne",
  },
  Travel: {
    polish: "Podróże",
    english: "Travel",
    explanation: "Wędrówki po świecie.",
    category: "Tematy / Inne",
  },
  "Vocal Synth": {
    polish: "Syntezator Wokalny",
    english: "Vocal Synth",
    explanation: "Postacie inspirowane Hatsune Miku.",
    category: "Tematy / Inne",
  },
  War: {
    polish: "Wojna",
    english: "War",
    explanation: "Konflikty zbrojne jako tło.",
    category: "Tematy / Inne",
  },

  // Tematy / Inne-Organizacje
  Assassins: {
    polish: "Zabójcy",
    english: "Assassins",
    explanation: "Najemnicy specjalizujący się w morderstwach.",
    category: "Tematy / Inne-Organizacje",
  },
  "Criminal Organization": {
    polish: "Organizacja Przestępcza",
    english: "Criminal Organization",
    explanation: "Grupy łamiące prawo.",
    category: "Tematy / Inne-Organizacje",
  },
  Cult: {
    polish: "Kult",
    english: "Cult",
    explanation: "Sekty i rytuały.",
    category: "Tematy / Inne-Organizacje",
  },
  Firefighters: {
    polish: "Strażacy",
    english: "Firefighters",
    explanation: "Akcje ratunkowe.",
    category: "Tematy / Inne-Organizacje",
  },
  Gangs: {
    polish: "Gangi",
    english: "Gangs",
    explanation: "Uliczne grupy przestępcze.",
    category: "Tematy / Inne-Organizacje",
  },
  Mafia: {
    polish: "Mafia",
    english: "Mafia",
    explanation: "Zorganizowana przestępczość.",
    category: "Tematy / Inne-Organizacje",
  },
  Military: {
    polish: "Wojsko",
    english: "Military",
    explanation: "Życie żołnierzy.",
    category: "Tematy / Inne-Organizacje",
  },
  Police: {
    polish: "Policja",
    english: "Police",
    explanation: "Śledztwa i służba mundurowa.",
    category: "Tematy / Inne-Organizacje",
  },
  Triads: {
    polish: "Triady",
    english: "Triads",
    explanation: "Chińskie organizacje przestępcze.",
    category: "Tematy / Inne-Organizacje",
  },
  Yakuza: {
    polish: "Yakuza",
    english: "Yakuza",
    explanation: "Japońska mafia.",
    category: "Tematy / Inne-Organizacje",
  },

  // Tematy / Inne-Pojazdy
  Aviation: {
    polish: "Lotnictwo",
    english: "Aviation",
    explanation: "Samoloty i piloci.",
    category: "Tematy / Inne-Pojazdy",
  },
  Cars: {
    polish: "Samochody",
    english: "Cars",
    explanation: "Wyścigi lub modyfikacje aut.",
    category: "Tematy / Inne-Pojazdy",
  },
  Mopeds: {
    polish: "Motorowery",
    english: "Mopeds",
    explanation: "Małe motocykle.",
    category: "Tematy / Inne-Pojazdy",
  },
  Motorcycles: {
    polish: "Motocykle",
    english: "Motorcycles",
    explanation: "Kulturę motocyklową.",
    category: "Tematy / Inne-Pojazdy",
  },
  Ships: {
    polish: "Statki",
    english: "Ships",
    explanation: "Żegluga morska.",
    category: "Tematy / Inne-Pojazdy",
  },
  Tanks: {
    polish: "Czołgi",
    english: "Tanks",
    explanation: "Pojazdy wojskowe.",
    category: "Tematy / Inne-Pojazdy",
  },
  Trains: {
    polish: "Pociągi",
    english: "Trains",
    explanation: "Podróże koleją.",
    category: "Tematy / Inne-Pojazdy",
  },

  // Tematy / Romans
  "Age Gap": {
    polish: "Różnica Wiekowa",
    english: "Age Gap",
    explanation: "Związek z dużą różnicą wieku.",
    category: "Tematy / Romans",
  },
  Bisexual: {
    polish: "Biseksualność",
    english: "Bisexual",
    explanation: "Postacie o orientacji biseksualnej.",
    category: "Tematy / Romans",
  },
  "Boys' Love": {
    polish: "Boys' Love",
    english: "Boys' Love",
    explanation: "Romans między mężczyznami.",
    category: "Tematy / Romans",
  },
  "Female Harem": {
    polish: "Harem Żeński",
    english: "Female Harem",
    explanation: "Jeden mężczyzna i wiele kobiet.",
    category: "Tematy / Romans",
  },
  Heterosexual: {
    polish: "Heteroseksualny",
    english: "Heterosexual",
    explanation: "Tradycyjne związki.",
    category: "Tematy / Romans",
  },
  "Love Triangle": {
    polish: "Trójkąt Miłosny",
    english: "Love Triangle",
    explanation: "Konflikt uczuciowy między trzema osobami.",
    category: "Tematy / Romans",
  },
  "Male Harem": {
    polish: "Harem Męski",
    english: "Male Harem",
    explanation: "Jedna kobieta i wielu mężczyzn.",
    category: "Tematy / Romans",
  },
  Matchmaking: {
    polish: "Swatka",
    english: "Matchmaking",
    explanation: "Łączenie par przez osoby trzecie.",
    category: "Tematy / Romans",
  },
  "Mixed Gender Harem": {
    polish: "Harem Mieszany",
    english: "Mixed Gender Harem",
    explanation: "Grupa różnych płci skupiona wokół jednej osoby.",
    category: "Tematy / Romans",
  },
  Polyamorous: {
    polish: "Poliamoria",
    english: "Polyamorous",
    explanation: "Związki z wieloma partnerami.",
    category: "Tematy / Romans",
  },
  "Teens' Love": {
    polish: "Miłość Nastolatków",
    english: "Teens' Love",
    explanation: "Romans wśród młodzieży.",
    category: "Tematy / Romans",
  },
  "Unrequited Love": {
    polish: "Niespełniona Miłość",
    english: "Unrequited Love",
    explanation: "Uczucie, które nie jest odwzajemnione.",
    category: "Tematy / Romans",
  },
  Yuri: {
    polish: "Yuri",
    english: "Yuri",
    explanation: "Romans między kobietami.",
    category: "Tematy / Romans",
  },

  // Tematy / Science Fiction
  Cyberpunk: {
    polish: "Cyberpunk",
    english: "Cyberpunk",
    explanation: "Hi-tech, niskie życie (np. Ghost in the Shell).",
    category: "Tematy / Science Fiction",
  },
  "Space Opera": {
    polish: "Opera Kosmiczna",
    english: "Space Opera",
    explanation: "Epickie przygody w kosmosie (np. Legend of the Galactic Heroes).",
    category: "Tematy / Science Fiction",
  },
  "Time Loop": {
    polish: "Pętla Czasowa",
    english: "Time Loop",
    explanation: "Powtarzanie tego samego dnia (np. Re:Zero).",
    category: "Tematy / Science Fiction",
  },
  "Time Manipulation": {
    polish: "Manipulacja Czasem",
    english: "Time Manipulation",
    explanation: "Kontrola nad czasem.",
    category: "Tematy / Science Fiction",
  },
  Tokusatsu: {
    polish: "Tokusatsu",
    english: "Tokusatsu",
    explanation: "Japońskie efekty specjalne (np. Kamen Rider).",
    category: "Tematy / Science Fiction",
  },

  // Tematy / Science Fiction-Mecha
  "Real Robot": {
    polish: "Real Robot",
    english: "Real Robot",
    explanation: "Realistyczne roboty (np. Gundam).",
    category: "Tematy / Science Fiction-Mecha",
  },
  "Super Robot": {
    polish: "Super Robot",
    english: "Super Robot",
    explanation: "Gigantyczne, potężne roboty (np. Mazinger Z).",
    category: "Tematy / Science Fiction-Mecha",
  },

  // Techniczne
  "4-koma": {
    polish: "4-koma",
    english: "4-koma",
    explanation: "Adaptacja komiksu czterokadrowego.",
    category: "Techniczne",
  },
  Achromatic: {
    polish: "Achromatyczny",
    english: "Achromatic",
    explanation: "Brak kolorów (czarno-białe).",
    category: "Techniczne",
  },
  Advertisement: {
    polish: "Reklama",
    english: "Advertisement",
    explanation: "Anime promujące produkt.",
    category: "Techniczne",
  },
  Anthology: {
    polish: "Antologia",
    english: "Anthology",
    explanation: "Zbiór krótkich historii.",
    category: "Techniczne",
  },
  CGI: {
    polish: "CGI",
    english: "CGI",
    explanation: "Animacja komputerowa.",
    category: "Techniczne",
  },
  Episodic: {
    polish: "Epizodyczny",
    english: "Episodic",
    explanation: "Niezwiązane ze sobą odcinki.",
    category: "Techniczne",
  },
  Flash: {
    polish: "Flash",
    english: "Flash",
    explanation: "Krótkie formy animowane.",
    category: "Techniczne",
  },
  "Full CGI": {
    polish: "Pełne CGI",
    english: "Full CGI",
    explanation: "Całość animowana komputerowo.",
    category: "Techniczne",
  },
  "Full Color": {
    polish: "Pełny Kolor",
    english: "Full Color",
    explanation: "Bogata kolorystyka.",
    category: "Techniczne",
  },
  "No Dialogue": {
    polish: "Bez Dialogów",
    english: "No Dialogue",
    explanation: "Brak mówionych kwestii.",
    category: "Techniczne",
  },
  "Non-fiction": {
    polish: "Non-fiction",
    english: "Non-fiction",
    explanation: "Oparte na faktach.",
    category: "Techniczne",
  },
  POV: {
    polish: "POV",
    english: "POV",
    explanation: "Perspektywa pierwszoosobowa.",
    category: "Techniczne",
  },
  Puppetry: {
    polish: "Lalkarstwo",
    english: "Puppetry",
    explanation: "Animacja lalkowa.",
    category: "Techniczne",
  },
  Rotoscoping: {
    polish: "Rotoskopia",
    english: "Rotoscoping",
    explanation: "Animacja na podstawie nagrań aktorów.",
    category: "Techniczne",
  },
  "Stop Motion": {
    polish: "Animacja Poklatkowa",
    english: "Stop Motion",
    explanation: "Technika klatkowa.",
    category: "Techniczne",
  },
}

export function translateTagToPolish(tag: string): string {
  return tagTranslations[tag]?.polish || tag
}

export function translateTagToEnglish(tag: string): string {
  return Object.values(tagTranslations).find((t) => t.polish === tag)?.english || tag
}

export function getTagExplanation(tag: string): string {
  return tagTranslations[tag]?.explanation || "Brak dostępnego opisu dla tego tagu."
}

export function getTagCategory(tag: string): string {
  return tagTranslations[tag]?.category || "Uncategorized"
}

export function getAllTags(): string[] {
  return Object.keys(tagTranslations)
}

export function getAllCategories(): string[] {
  return [...new Set(Object.values(tagTranslations).map((info) => info.category))]
}

export function getTagsByCategory(category: string): string[] {
  return Object.entries(tagTranslations)
    .filter(([, info]) => info.category === category)
    .map(([tag]) => tag)
}

export function getTagColor(tag: string): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F06292",
    "#AED581",
    "#FFD54F",
    "#4DB6AC",
    "#7986CB",
  ]
  const hash = tag.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
  return colors[Math.abs(hash) % colors.length]
}

