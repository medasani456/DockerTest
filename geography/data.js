// Country dataset: [ISO 3166-1 alpha-2, name, capital, continent]
const COUNTRIES = [
  ["af","Afghanistan","Kabul","Asia"],["al","Albania","Tirana","Europe"],["dz","Algeria","Algiers","Africa"],
  ["ad","Andorra","Andorra la Vella","Europe"],["ao","Angola","Luanda","Africa"],["ar","Argentina","Buenos Aires","South America"],
  ["am","Armenia","Yerevan","Asia"],["au","Australia","Canberra","Oceania"],["at","Austria","Vienna","Europe"],
  ["az","Azerbaijan","Baku","Asia"],["bs","Bahamas","Nassau","North America"],["bh","Bahrain","Manama","Asia"],
  ["bd","Bangladesh","Dhaka","Asia"],["by","Belarus","Minsk","Europe"],["be","Belgium","Brussels","Europe"],
  ["bz","Belize","Belmopan","North America"],["bj","Benin","Porto-Novo","Africa"],["bt","Bhutan","Thimphu","Asia"],
  ["bo","Bolivia","Sucre","South America"],["ba","Bosnia and Herzegovina","Sarajevo","Europe"],["bw","Botswana","Gaborone","Africa"],
  ["br","Brazil","Brasília","South America"],["bn","Brunei","Bandar Seri Begawan","Asia"],["bg","Bulgaria","Sofia","Europe"],
  ["bf","Burkina Faso","Ouagadougou","Africa"],["bi","Burundi","Gitega","Africa"],["kh","Cambodia","Phnom Penh","Asia"],
  ["cm","Cameroon","Yaoundé","Africa"],["ca","Canada","Ottawa","North America"],["cv","Cape Verde","Praia","Africa"],
  ["cf","Central African Republic","Bangui","Africa"],["td","Chad","N'Djamena","Africa"],["cl","Chile","Santiago","South America"],
  ["cn","China","Beijing","Asia"],["co","Colombia","Bogotá","South America"],["cr","Costa Rica","San José","North America"],
  ["hr","Croatia","Zagreb","Europe"],["cu","Cuba","Havana","North America"],["cy","Cyprus","Nicosia","Europe"],
  ["cz","Czechia","Prague","Europe"],["cd","DR Congo","Kinshasa","Africa"],["dk","Denmark","Copenhagen","Europe"],
  ["dj","Djibouti","Djibouti","Africa"],["do","Dominican Republic","Santo Domingo","North America"],["ec","Ecuador","Quito","South America"],
  ["eg","Egypt","Cairo","Africa"],["sv","El Salvador","San Salvador","North America"],["ee","Estonia","Tallinn","Europe"],
  ["et","Ethiopia","Addis Ababa","Africa"],["fj","Fiji","Suva","Oceania"],["fi","Finland","Helsinki","Europe"],
  ["fr","France","Paris","Europe"],["ga","Gabon","Libreville","Africa"],["ge","Georgia","Tbilisi","Asia"],
  ["de","Germany","Berlin","Europe"],["gh","Ghana","Accra","Africa"],["gr","Greece","Athens","Europe"],
  ["gt","Guatemala","Guatemala City","North America"],["gn","Guinea","Conakry","Africa"],["ht","Haiti","Port-au-Prince","North America"],
  ["hn","Honduras","Tegucigalpa","North America"],["hu","Hungary","Budapest","Europe"],["is","Iceland","Reykjavík","Europe"],
  ["in","India","New Delhi","Asia"],["id","Indonesia","Jakarta","Asia"],["ir","Iran","Tehran","Asia"],
  ["iq","Iraq","Baghdad","Asia"],["ie","Ireland","Dublin","Europe"],["il","Israel","Jerusalem","Asia"],
  ["it","Italy","Rome","Europe"],["jm","Jamaica","Kingston","North America"],["jp","Japan","Tokyo","Asia"],
  ["jo","Jordan","Amman","Asia"],["kz","Kazakhstan","Astana","Asia"],["ke","Kenya","Nairobi","Africa"],
  ["kw","Kuwait","Kuwait City","Asia"],["kg","Kyrgyzstan","Bishkek","Asia"],["la","Laos","Vientiane","Asia"],
  ["lv","Latvia","Riga","Europe"],["lb","Lebanon","Beirut","Asia"],["ly","Libya","Tripoli","Africa"],
  ["lt","Lithuania","Vilnius","Europe"],["lu","Luxembourg","Luxembourg","Europe"],["mg","Madagascar","Antananarivo","Africa"],
  ["mw","Malawi","Lilongwe","Africa"],["my","Malaysia","Kuala Lumpur","Asia"],["mv","Maldives","Malé","Asia"],
  ["ml","Mali","Bamako","Africa"],["mt","Malta","Valletta","Europe"],["mr","Mauritania","Nouakchott","Africa"],
  ["mx","Mexico","Mexico City","North America"],["md","Moldova","Chișinău","Europe"],["mc","Monaco","Monaco","Europe"],
  ["mn","Mongolia","Ulaanbaatar","Asia"],["me","Montenegro","Podgorica","Europe"],["ma","Morocco","Rabat","Africa"],
  ["mz","Mozambique","Maputo","Africa"],["mm","Myanmar","Naypyidaw","Asia"],["na","Namibia","Windhoek","Africa"],
  ["np","Nepal","Kathmandu","Asia"],["nl","Netherlands","Amsterdam","Europe"],["nz","New Zealand","Wellington","Oceania"],
  ["ni","Nicaragua","Managua","North America"],["ne","Niger","Niamey","Africa"],["ng","Nigeria","Abuja","Africa"],
  ["kp","North Korea","Pyongyang","Asia"],["mk","North Macedonia","Skopje","Europe"],["no","Norway","Oslo","Europe"],
  ["om","Oman","Muscat","Asia"],["pk","Pakistan","Islamabad","Asia"],["pa","Panama","Panama City","North America"],
  ["pg","Papua New Guinea","Port Moresby","Oceania"],["py","Paraguay","Asunción","South America"],["pe","Peru","Lima","South America"],
  ["ph","Philippines","Manila","Asia"],["pl","Poland","Warsaw","Europe"],["pt","Portugal","Lisbon","Europe"],
  ["qa","Qatar","Doha","Asia"],["ro","Romania","Bucharest","Europe"],["ru","Russia","Moscow","Europe"],
  ["rw","Rwanda","Kigali","Africa"],["sa","Saudi Arabia","Riyadh","Asia"],["sn","Senegal","Dakar","Africa"],
  ["rs","Serbia","Belgrade","Europe"],["sg","Singapore","Singapore","Asia"],["sk","Slovakia","Bratislava","Europe"],
  ["si","Slovenia","Ljubljana","Europe"],["so","Somalia","Mogadishu","Africa"],["za","South Africa","Pretoria","Africa"],
  ["kr","South Korea","Seoul","Asia"],["ss","South Sudan","Juba","Africa"],["es","Spain","Madrid","Europe"],
  ["lk","Sri Lanka","Sri Jayawardenepura Kotte","Asia"],["sd","Sudan","Khartoum","Africa"],["sr","Suriname","Paramaribo","South America"],
  ["se","Sweden","Stockholm","Europe"],["ch","Switzerland","Bern","Europe"],["sy","Syria","Damascus","Asia"],
  ["tw","Taiwan","Taipei","Asia"],["tj","Tajikistan","Dushanbe","Asia"],["tz","Tanzania","Dodoma","Africa"],
  ["th","Thailand","Bangkok","Asia"],["tg","Togo","Lomé","Africa"],["tt","Trinidad and Tobago","Port of Spain","North America"],
  ["tn","Tunisia","Tunis","Africa"],["tr","Turkey","Ankara","Asia"],["tm","Turkmenistan","Ashgabat","Asia"],
  ["ug","Uganda","Kampala","Africa"],["ua","Ukraine","Kyiv","Europe"],["ae","United Arab Emirates","Abu Dhabi","Asia"],
  ["gb","United Kingdom","London","Europe"],["us","United States","Washington, D.C.","North America"],["uy","Uruguay","Montevideo","South America"],
  ["uz","Uzbekistan","Tashkent","Asia"],["ve","Venezuela","Caracas","South America"],["vn","Vietnam","Hanoi","Asia"],
  ["ye","Yemen","Sana'a","Asia"],["zm","Zambia","Lusaka","Africa"],["zw","Zimbabwe","Harare","Africa"]
].map(([code, name, capital, continent]) => ({ code, name, capital, continent }));

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

// Quiz catalogue shown on the landing page (mirrors quiz.com's card grid).
const QUIZZES = [
  { id: "flags",        title: "Guess the Flag",        emoji: "🏳️", color: "#e21b3c", desc: "Which country does this flag belong to?", type: "flag" },
  { id: "capitals",     title: "World Capitals",        emoji: "🏛️", color: "#1368ce", desc: "Name the capital city of each country.", type: "capital" },
  { id: "reverse",      title: "Capital → Country",     emoji: "📍", color: "#d89e00", desc: "Which country is this the capital of?", type: "reverse" },
  { id: "continents",   title: "Which Continent?",      emoji: "🌍", color: "#26890c", desc: "Place each country on the right continent.", type: "continent" },
  { id: "europe-flags", title: "Flags of Europe",       emoji: "🇪🇺", color: "#864cbf", desc: "European flags only.", type: "flag", filter: "Europe" },
  { id: "africa-caps",  title: "Capitals of Africa",    emoji: "🦁", color: "#0aa3a3", desc: "African capitals only.", type: "capital", filter: "Africa" },
  { id: "asia-flags",   title: "Flags of Asia",         emoji: "🏯", color: "#c3326b", desc: "Asian flags only.", type: "flag", filter: "Asia" },
  { id: "americas",     title: "Americas Capitals",     emoji: "🗽", color: "#46178f", desc: "North & South American capitals.", type: "capital", filter: ["North America", "South America"] },
  { id: "mixed",        title: "Ultimate Geography Mix", emoji: "🧭", color: "#333f4e", desc: "Flags, capitals and continents combined.", type: "mixed" }
];

// Countries whose continent is commonly disputed; kept out of continent questions.
const TRANSCONTINENTAL = new Set(["ru", "tr", "ge", "am", "az", "cy", "kz", "eg"]);
