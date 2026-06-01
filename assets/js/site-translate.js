
(function(){
  "use strict";

  const DICT = {
    "Page Not Found": {hi:"पेज नहीं मिला"},
    "404 Error": {hi:"404 त्रुटि"},
    "The page you tried to open does not exist or the link may be incorrect. Use one of the options below to continue exploring the site.": {hi:"जिस पेज को आप खोलना चाहते थे वह उपलब्ध नहीं है या लिंक गलत हो सकता है। साइट देखने के लिए नीचे दिए गए विकल्पों का उपयोग करें।"},
    "Go to Homepage": {hi:"होमपेज पर जाएँ"},
    "Explore Tours": {hi:"टूर देखें"},
    "Move Through City": {hi:"शहर में आगे बढ़ें"},
    "If you reached here from a broken link, please return to the homepage.": {hi:"यदि आप किसी टूटे हुए लिंक से यहाँ पहुँचे हैं, तो कृपया होमपेज पर वापस जाएँ।"},

    "Home": {hi:"होम"},
    "Routes": {hi:"रूट्स"},
    "Route Map": {hi:"रूट मैप"},
    "Calendar": {hi:"कैलेंडर"},
    "City Journey": {hi:"शहर यात्रा"},
    "Tours": {hi:"टूर"},
    "Kathas": {hi:"कथाएँ"},
    "Rituals": {hi:"अनुष्ठान"},
    "Admin": {hi:"एडमिन"},
    "Theme": {hi:"थीम"},
    "Menu": {hi:"मेनू"},

    "Spiritual Tours • Rituals • Kathas": {hi:"आध्यात्मिक यात्राएँ • अनुष्ठान • कथाएँ"},
    "Plan trips to Kashi, Ayodhya, Prayagraj — book rituals, kathas & arrangements. Build itinerary, view route on map, and share on WhatsApp.": {hi:"काशी, अयोध्या, प्रयागराज की यात्राएँ प्लान करें — अनुष्ठान, कथाएँ और व्यवस्थाएँ बुक करें। यात्रा सूची बनाएँ, रूट मैप पर देखें और WhatsApp पर साझा करें।"},
    "📍 Locations database": {hi:"📍 स्थान डेटाबेस"},
    "🗺 Route Map": {hi:"🗺 रूट मैप"},
    "📅 Festivals Calendar": {hi:"📅 पर्व कैलेंडर"},
    "💬 WhatsApp enquiry": {hi:"💬 WhatsApp पूछताछ"},
    "Start Route Builder": {hi:"रूट बिल्डर शुरू करें"},
    "Open Route Map": {hi:"रूट मैप खोलें"},
    "Open Calendar": {hi:"कैलेंडर खोलें"},
    "Quick Actions": {hi:"त्वरित क्रियाएँ"},
    "Everything important in one tap": {hi:"सब कुछ एक ही टैप में"},
    "Tour Maker": {hi:"टूर मेकर"},
    "🖼 Pictures": {hi:"🖼 चित्र"},
    "🎥 Videos": {hi:"🎥 वीडियो"},
    "🗺 Route-ready": {hi:"🗺 रूट के लिए तैयार"},
    "🏙️ Cities:": {hi:"🏙️ शहर:"},
    "📌 Places:": {hi:"📌 स्थान:"},
    "🎉 Occasions:": {hi:"🎉 अवसर:"},
    "Tip: Use the search below to find a place or festival and jump directly to building the itinerary.": {hi:"सुझाव: नीचे दिए गए खोज बॉक्स से स्थान या पर्व खोजें और सीधे यात्रा सूची बनाना शुरू करें।"},
    "SEARCH + HIGHLIGHTS": {hi:"खोज + मुख्य बिंदु"},
    "LEFT: Smart Search": {hi:"बाएँ: स्मार्ट खोज"},
    "Smart Search": {hi:"स्मार्ट खोज"},
    "Search across Locations + Occasions (3+ characters)": {hi:"स्थान + अवसर में खोजें (3+ अक्षर)"},
    "Go to Routes": {hi:"रूट्स पर जाएँ"},
    "Locations + Occasions": {hi:"स्थान + अवसर"},
    "Locations only": {hi:"सिर्फ स्थान"},
    "Occasions only": {hi:"सिर्फ अवसर"},
    "Loading master data…": {hi:"मास्टर डेटा लोड हो रहा है…"},
    "RIGHT: Today / This month": {hi:"दाएँ: आज / यह महीना"},
    "Highlights": {hi:"मुख्य बिंदु"},
    "Today + this month from occasions.json": {hi:"आज + इस महीने के अवसर occasions.json से"},
    "This Month": {hi:"यह महीना"},
    "Festivals based on your": {hi:"आपके आधार पर पर्व"},
    "CITY SPOTLIGHT": {hi:"शहर स्पॉटलाइट"},
    "City Spotlight": {hi:"शहर स्पॉटलाइट"},
    "Top places from locations.json": {hi:"locations.json से प्रमुख स्थान"},
    "Add top 5 to itinerary": {hi:"शीर्ष 5 को यात्रा सूची में जोड़ें"},
    "Open Itinerary": {hi:"यात्रा सूची खोलें"},
    "Powered by master data:": {hi:"मास्टर डेटा द्वारा संचालित:"},
    "Core": {hi:"मुख्य"},
    "Optional (if you use popout elsewhere)": {hi:"वैकल्पिक (यदि आप popout अन्य जगह उपयोग करते हैं)"},
    "Find on page": {hi:"पेज में खोजें"},
    "Your existing page logic (UNCHANGED)": {hi:"आपका मौजूदा पेज लॉजिक (जैसा है)"},
    "THEME ENGINE (1,2,3,4)": {hi:"थीम इंजन (1,2,3,4)"},

    "Move Through the City": {hi:"शहर में आगे बढ़ें"},
    "Visual City Explorer": {hi:"दृश्य शहर एक्सप्लोरर"},
    "Press locations on the left to move through the city. Each stop opens its pictures and videos so the visitor can explore before adding it to a route or tour.": {hi:"शहर में आगे बढ़ने के लिए बाईं ओर दिए गए स्थानों पर क्लिक करें। हर ठहराव पर चित्र और वीडियो खुलेंगे, ताकि उपयोगकर्ता उसे देखने के बाद रूट या टूर में जोड़ सके।"},
    "📍 Location list": {hi:"📍 स्थान सूची"},
    "Browse Stops": {hi:"ठहराव देखें"},
    "Locations": {hi:"स्थान"},
    "Loading locations…": {hi:"स्थान लोड हो रहे हैं…"},
    "Loading city journey…": {hi:"शहर यात्रा लोड हो रही है…"},
    "All Cities": {hi:"सभी शहर"},
    "No locations match your search right now.": {hi:"अभी आपकी खोज से कोई स्थान मेल नहीं खा रहा है।"},
    "spiritual place": {hi:"आध्यात्मिक स्थान"},
    "No location selected.": {hi:"कोई स्थान चयनित नहीं है।"},
    "Open Gallery": {hi:"गैलरी खोलें"},
    "City": {hi:"शहर"},
    "Coordinates": {hi:"निर्देशांक"},
    "Media": {hi:"मीडिया"},
    "images": {hi:"चित्र"},
    "videos": {hi:"वीडियो"},
    "About this stop": {hi:"इस स्थान के बारे में"},
    "A meaningful stop on your spiritual city journey.": {hi:"आपकी आध्यात्मिक शहर यात्रा का एक महत्वपूर्ण पड़ाव।"},
    "Details will appear here as you enrich the location data.": {hi:"जैसे-जैसे आप स्थान डेटा समृद्ध करेंगे, विवरण यहाँ दिखाई देगा।"},
    "Open city map": {hi:"शहर का मानचित्र खोलें"},
    "Browse tours": {hi:"टूर देखें"},
    "Check occasions": {hi:"अवसर देखें"},
    "Continue the journey": {hi:"यात्रा जारी रखें"},
    "Use Previous and Next to move through the city, then add the places you like to your route map or itinerary.": {hi:"शहर में आगे बढ़ने के लिए Previous और Next का उपयोग करें, फिर पसंदीदा स्थानों को अपने रूट मैप या यात्रा सूची में जोड़ें।"},
    "← Previous": {hi:"← पिछला"},
    "Next →": {hi:"अगला →"},
    "No image or video is available yet for": {hi:"अभी तक कोई चित्र या वीडियो उपलब्ध नहीं है:"},
    "Could not load city data right now.": {hi:"अभी शहर का डेटा लोड नहीं हो सका।"},
    "Location list": {hi:"स्थान सूची"},

    "Unified Calendar": {hi:"एकीकृत कैलेंडर"},
    "Weekly • Monthly • Yearly • Synced to occasions.json": {hi:"साप्ताहिक • मासिक • वार्षिक • occasions.json से सिंक"},
    "Occasions": {hi:"अवसर"},
    "Weekly": {hi:"साप्ताहिक"},
    "Monthly": {hi:"मासिक"},
    "Yearly": {hi:"वार्षिक"},
    "« Year": {hi:"« वर्ष"},
    "Year »": {hi:"वर्ष »"},
    "Today": {hi:"आज"},
    "WEEK": {hi:"सप्ताह"},
    "Next 7 Days": {hi:"अगले 7 दिन"},
    "MONTH": {hi:"महीना"},
    "Month": {hi:"महीना"},
    "YEAR": {hi:"वर्ष"},
    "Year": {hi:"वर्ष"},
    "DAY RESULTS": {hi:"दिन के परिणाम"},
    "Occasions on:": {hi:"इस तारीख के अवसर:"},

    "Route Builder + Map": {hi:"रूट बिल्डर + मैप"},
    "Single page: Search → Itinerary → Map (auto sync)": {hi:"एक पेज: खोज → यात्रा सूची → मैप (ऑटो सिंक)"},
    "Route Builder": {hi:"रूट बिल्डर"},
    "Same storage key:": {hi:"समान स्टोरेज कुंजी:"},
    ". Any change updates the map immediately.": {hi:"। कोई भी बदलाव तुरंत मैप अपडेट करता है।"},
    "LEFT": {hi:"बाएँ"},
    "Search & Add": {hi:"खोजें और जोड़ें"},
    "Loading data…": {hi:"डेटा लोड हो रहा है…"},
    "Only locations.json": {hi:"सिर्फ locations.json"},
    "Only OpenStreetMap": {hi:"सिर्फ OpenStreetMap"},
    "Both (locations first)": {hi:"दोनों (पहले locations)"},
    "Search": {hi:"खोज"},
    "Clear": {hi:"साफ़ करें"},
    "Itinerary": {hi:"यात्रा सूची"},
    "Auto-updates map": {hi:"मैप अपने-आप अपडेट होता है"},
    "Download": {hi:"डाउनलोड"},
    "WhatsApp": {hi:"WhatsApp"},
    "RIGHT": {hi:"दाएँ"},
    "Map": {hi:"मैप"},
    "Open old Routes page": {hi:"पुराना Routes पेज खोलें"},
    "Includes": {hi:"शामिल"},
    "Leaflet": {hi:"Leaflet"},
    "Data + render + popout": {hi:"डेटा + रेंडर + popout"},
    "NEW: combined editor + map": {hi:"नया: संयुक्त एडिटर + मैप"},
    "Map invalidate-size fix": {hi:"मैप आकार सुधार"},
    "Type 3+ characters…": {hi:"3+ अक्षर लिखें…"},
    "Search source": {hi:"खोज स्रोत"},

    "Routes — Search + Itinerary": {hi:"रूट्स — खोज + यात्रा सूची"},
    "Search places • Build itinerary • Syncs with Route Map": {hi:"स्थान खोजें • यात्रा सूची बनाएँ • रूट मैप से सिंक"},
    "Choose search source, start typing (3+ chars) or press Search. Add places to itinerary, reorder, remove, then open Route Map.": {hi:"खोज स्रोत चुनें, टाइप करना शुरू करें (3+ अक्षर) या Search दबाएँ। स्थानों को यात्रा सूची में जोड़ें, क्रम बदलें, हटाएँ, फिर Route Map खोलें।"},
    "Language Toggle": {hi:"भाषा टॉगल"},
    "My Itinerary": {hi:"मेरी यात्रा सूची"},
    "Saved in localStorage key:": {hi:"localStorage कुंजी में सुरक्षित:"},
    "Download JSON": {hi:"JSON डाउनलोड करें"},
    "Share WhatsApp": {hi:"WhatsApp साझा करें"},
    "Clear Itinerary": {hi:"यात्रा सूची साफ़ करें"},
    "Hindi/English core": {hi:"हिंदी/अंग्रेज़ी आधार"},
    "Toggle + apply translations after includes load": {hi:"includes लोड होने के बाद टॉगल + अनुवाद लागू करें"},

    "Map Tours": {hi:"मैप टूर"},
    "Explore": {hi:"देखें"},
    "Varanasi": {hi:"वाराणसी"},
    "Ayodhya": {hi:"अयोध्या"},
    "Prayagraj": {hi:"प्रयागराज"},
    "with tourist places. Use": {hi:"के दर्शनीय स्थानों के साथ। उपयोग करें"},
    "Current Location": {hi:"वर्तमान स्थान"},
    "to get nearby suggestions, then add places to": {hi:"ताकि आसपास के सुझाव मिलें, फिर स्थान जोड़ें"},
    "Use Current Location": {hi:"वर्तमान स्थान उपयोग करें"},
    "Open Tour Maker": {hi:"टूर मेकर खोलें"},
    "Search places": {hi:"स्थान खोजें"},
    "Type city/place/tag (e.g.,": {hi:"शहर/स्थान/टैग लिखें (जैसे,"},
    "ghat": {hi:"घाट"},
    "kashi": {hi:"काशी"},
    "Selected place": {hi:"चयनित स्थान"},
    "Tap a marker to view details.": {hi:"विवरण देखने के लिए मार्कर पर टैप करें।"},
    "Quick add": {hi:"त्वरित जोड़ें"},
    "Add a whole city’s top places to Tour Maker:": {hi:"पूरे शहर के प्रमुख स्थान टूर मेकर में जोड़ें:"},

    "Contact": {hi:"संपर्क"},
    "v1 placeholder (Option C). Next we will fill this with JSON-driven cards.": {hi:"v1 प्लेसहोल्डर (विकल्प C)। अगला चरण JSON-आधारित कार्ड्स से भरना है।"},
    "Auto from upcoming occasions (Calendar) with fallback to curated featured flags.": {hi:"आगामी अवसरों (कैलेंडर) से ऑटो, और आवश्यकता होने पर curated featured flags का उपयोग।"},
    "Coming next": {hi:"आगे आने वाला"},
    "Data-driven content + booking CTAs.": {hi:"डेटा-आधारित सामग्री + बुकिंग CTA।"},
    "See Gallery": {hi:"गैलरी देखें"},

    "Master Data Preview": {hi:"मास्टर डेटा पूर्वावलोकन"},
    "Edit JSON files in": {hi:"JSON फ़ाइलें यहाँ संपादित करें"},
    "and refresh this page to see updates.": {hi:"और अपडेट देखने के लिए पेज रीफ्रेश करें।"},
    "Open Experiences": {hi:"अनुभव खोलें"},
    "Files:": {hi:"फ़ाइलें:"},

    "Admin — Locations Editor": {hi:"एडमिन — लोकेशन्स एडिटर"},
    "Visual Admin Helper": {hi:"विज़ुअल एडमिन हेल्पर"},
    "Locations Editor": {hi:"लोकेशन्स एडिटर"},
    "Loads": {hi:"लोड करता है"},
    "• Autosaves draft in": {hi:"• ड्राफ्ट यहाँ ऑटोसेव होता है"},
    "• Export as JSON": {hi:"• JSON के रूप में एक्सपोर्ट"},
    "Reload from file": {hi:"फ़ाइल से पुनः लोड करें"},
    "Load draft": {hi:"ड्राफ्ट लोड करें"},
    "Save draft": {hi:"ड्राफ्ट सेव करें"},
    "Download locations.json": {hi:"locations.json डाउनलोड करें"},
    "Copy JSON": {hi:"JSON कॉपी करें"},
    "Import JSON": {hi:"JSON इम्पोर्ट करें"},
    "Cities: 0": {hi:"शहर: 0"},
    "Places: 0": {hi:"स्थान: 0"},
    "Missing coords: 0": {hi:"गुम निर्देशांक: 0"},
    "Duplicate IDs: 0": {hi:"डुप्लिकेट ID: 0"},
    "Ready.": {hi:"तैयार।"},
    "LEFT: Cities": {hi:"बाएँ: शहर"},
    "Cities": {hi:"शहर"},
    "Select a city to edit places": {hi:"स्थान संपादित करने के लिए शहर चुनें"},
    "+ City": {hi:"+ शहर"},
    "City Editor": {hi:"शहर एडिटर"},
    "Apply": {hi:"लागू करें"},
    "Delete city": {hi:"शहर हटाएँ"},
    "Tip: keep city IDs lowercase, underscores only. Example:": {hi:"सुझाव: city ID छोटे अक्षरों में और केवल underscores रखें। उदाहरण:"},
    "RIGHT: Places": {hi:"दाएँ: स्थान"},
    "Places": {hi:"स्थान"},
    "Select a city…": {hi:"शहर चुनें…"},
    "+ Place": {hi:"+ स्थान"},
    "Place Editor": {hi:"स्थान एडिटर"},
    "Delete place": {hi:"स्थान हटाएँ"},
    "Images: store files inside": {hi:"चित्र: फ़ाइलें यहाँ रखें"},
    "and add paths here.": {hi:"और उनके पथ यहाँ जोड़ें।"},

    "All tags": {hi:"सभी टैग"},
    "Featured": {hi:"फ़ीचर्ड"},
    "All Acharyas": {hi:"सभी आचार्य"},
    "All Kathas": {hi:"सभी कथाएँ"},
    "All Occasions": {hi:"सभी अवसर"},
    "All Rituals": {hi:"सभी अनुष्ठान"},
    "Yagyas": {hi:"यज्ञ"},
    "All Yagyas": {hi:"सभी यज्ञ"},
    "Tags": {hi:"टैग"},

    "Photos & moments from tours, rituals, and kathas.": {hi:"टूर, अनुष्ठान और कथाओं की तस्वीरें व झलकियाँ।"},
    "Browse by Category": {hi:"श्रेणी के अनुसार देखें"},
    "Use Previous/Next or swipe on mobile.": {hi:"Previous/Next का उपयोग करें या मोबाइल पर स्वाइप करें।"},
    "Category": {hi:"श्रेणी"},

    "Videos": {hi:"वीडियो"},
    "Scroll to play. Videos animate in and auto pause when out of view.": {hi:"चलाने के लिए स्क्रॉल करें। वीडियो एनिमेट होकर दिखते हैं और स्क्रीन से बाहर होने पर अपने-आप रुक जाते हैं।"},
    "Add/Edit videos in data/videos.json": {hi:"वीडियो जोड़ें/संपादित करें: data/videos.json"},
    "Auto-play works best when videos are muted.": {hi:"ऑटो-प्ले म्यूट वीडियो पर सबसे अच्छा काम करता है।"},
    "Play": {hi:"चलाएँ"},
    "Pause": {hi:"रोकें"},
    "Open": {hi:"खोलें"},

    "Unified Experiences": {hi:"एकीकृत अनुभव"},
    "Services auto-linked with calendar dates and videos using shared tags.": {hi:"साझा टैग्स का उपयोग करके सेवाएँ कैलेंडर तारीखों और वीडियो से अपने-आप जुड़ती हैं।"},
    "Help: How Experiences Work": {hi:"सहायता: अनुभव कैसे काम करते हैं"},
    "Show": {hi:"दिखाएँ"},
    "Hide": {hi:"छिपाएँ"},
    "Golden rule: Tags are the glue. If tags don't match, items won't link.": {hi:"सुनहरा नियम: टैग ही जोड़ने वाली कड़ी हैं। टैग न मिलें तो आइटम लिंक नहीं होंगे।"},
    "How to add new items": {hi:"नए आइटम कैसे जोड़ें"},
    "Add a service in": {hi:"एक सेवा जोड़ें"},
    "with tags.": {hi:"टैग्स के साथ।"},
    "Add a calendar occasion in": {hi:"एक कैलेंडर अवसर जोड़ें"},
    "Add a video in": {hi:"एक वीडियो जोड़ें"},
    "with the same tags (or add its youtubeId in service.relatedVideos).": {hi:"उसी टैग्स के साथ (या उसका youtubeId service.relatedVideos में जोड़ें)।"},
    "Reload — cards auto-update.": {hi:"रीलोड करें — कार्ड अपने-आप अपडेट होंगे।"},
    "Experiences": {hi:"अनुभव"},
    "Auto-linked cards (service + next date + video + WhatsApp CTA).": {hi:"ऑटो-लिंक्ड कार्ड (सेवा + अगली तारीख + वीडियो + WhatsApp CTA)।"},
    "Next date": {hi:"अगली तारीख"},
    "Related video": {hi:"संबंधित वीडियो"},
    "Enquire on WhatsApp": {hi:"WhatsApp पर पूछें"},

    "Spiritual Services": {hi:"आध्यात्मिक सेवाएँ"},
    "Tours • Yagya • Katha • Arrangements": {hi:"टूर • यज्ञ • कथा • व्यवस्थाएँ"},
    "All": {hi:"सभी"},
    "Festival": {hi:"पर्व"},
    "Snan": {hi:"स्नान"},
    "Shri Ram": {hi:"श्री राम"},
    "Shiv": {hi:"शिव"},
    "Guru": {hi:"गुरु"},
    "General": {hi:"सामान्य"},
    "No results.": {hi:"कोई परिणाम नहीं।"},
    "No featured items.": {hi:"कोई फ़ीचर्ड आइटम नहीं।"},
    "Type 3+ characters…": {hi:"3+ अक्षर लिखें…"},
    "Showing": {hi:"दिखाए जा रहे हैं"},
    "results": {hi:"परिणाम"},
    "Loaded": {hi:"लोड हुए"},
    "items": {hi:"आइटम"},
    "Failed to load content": {hi:"सामग्री लोड नहीं हो सकी"},
    "WhatsApp पर पूछें": {en:"Enquire on WhatsApp", hi:"WhatsApp पर पूछें"},
    "WhatsApp करें": {en:"WhatsApp", hi:"WhatsApp करें"},
    "No tours yet": {hi:"अभी कोई टूर नहीं है"},
    "Could not load tours.json. If you opened this page via": {hi:"tours.json लोड नहीं हो सका। यदि आपने यह पेज इस माध्यम से खोला है:"},
    "use a local server (VS Code Live Server). On GitHub Pages it will work.": {hi:"तो लोकल सर्वर (VS Code Live Server) का उपयोग करें। GitHub Pages पर यह काम करेगा।"},
    "Tour enquiry:": {hi:"टूर पूछताछ:"},
    "Add to Tour Maker": {hi:"टूर मेकर में जोड़ें"},
    "Added to Tour Maker!": {hi:"टूर मेकर में जोड़ दिया गया!"},

    "Kashi Shiva Circuit": {hi:"काशी शिव परिक्रमा"},
    "Sunrise Ghats Walk": {hi:"सूर्योदय घाट भ्रमण"},
    "Morning or Evening": {hi:"सुबह या शाम"},
    "Sunrise": {hi:"सूर्योदय"},
    "Fast Route": {hi:"त्वरित रूट"},
    "Darshan": {hi:"दर्शन"},
    "Ghats": {hi:"घाट"},
    "Boat Optional": {hi:"नाव वैकल्पिक"},
    "Varanasi • Shiva": {hi:"वाराणसी • शिव"},
    "Varanasi • Ganga": {hi:"वाराणसी • गंगा"},

    "English / हिन्दी": {hi:"English / हिन्दी"}
  };

  function lang(){ return (window.PP_LANG && PP_LANG.getLang) ? PP_LANG.getLang() : ((document.documentElement.getAttribute('data-lang'))||'en'); }
  function tr(s){
    if (s == null) return s;
    const L = lang();
    const key = String(s).trim();
    const found = DICT[key];
    if (!found) return s;
    return found[L] || found.en || key;
  }
  function replacePreserveSpace(orig, translated){
    const m = String(orig).match(/^(\s*)(.*?)(\s*)$/s);
    return (m?m[1]:'') + translated + (m?m[3]:'');
  }
  function applyToTextNode(node){
    const orig = node.__ppOrigText ?? node.nodeValue;
    node.__ppOrigText = orig;
    const trimmed = String(orig).trim();
    if (!trimmed) return;
    const translated = tr(trimmed);
    node.nodeValue = translated === trimmed ? orig : replacePreserveSpace(orig, translated);
  }
  function applyToAttrs(el){
    ['placeholder','title','aria-label'].forEach(attr=>{
      if (el.hasAttribute && el.hasAttribute(attr)) {
        const okey = '__ppOrigAttr_' + attr.replace(/-/g,'_');
        const orig = el[okey] ?? el.getAttribute(attr);
        el[okey] = orig;
        const translated = tr(orig);
        if (translated) el.setAttribute(attr, translated);
      }
    });
    // common data attrs used for captions / labels
    ['data-kicker','data-title','data-sub','data-chip','data-tip'].forEach(attr=>{
      if (el.hasAttribute && el.hasAttribute(attr)) {
        const key = '__ppOrigAttr_' + attr.replace(/-/g,'_');
        const orig = el[key] ?? el.getAttribute(attr);
        el[key] = orig;
        const translated = tr(orig);
        if (translated) el.setAttribute(attr, translated);
      }
    });
  }
  function walk(root){
    if (!root) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName.toLowerCase();
        if (['script','style','textarea','code','pre'].includes(tag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const texts=[]; let n;
    while((n=tw.nextNode())) texts.push(n);
    texts.forEach(applyToTextNode);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(applyToAttrs);
  }
  function applyDocument(){
    try {
      const dt = document.__ppOrigTitle ?? document.title;
      document.__ppOrigTitle = dt;
      document.title = tr(dt);
      walk(document.body || document.documentElement);
      const btn = document.querySelector('[data-pp-lang], #ppLangBtn, .pp-fallback-lang');
      if (btn) btn.textContent = lang()==='hi' ? 'EN' : 'HI';
    } catch(e){ console.error(e); }
  }
  function ensureFallbackToggle(){
    const existing = document.querySelector('[data-pp-lang], #ppLangBtn, .pp-fallback-lang');
    if (existing || !document.body) return;
    const btn = document.createElement('button');
    btn.className = 'pp-fallback-lang';
    btn.type = 'button';
    btn.textContent = lang()==='hi' ? 'EN' : 'HI';
    btn.style.cssText = 'position:fixed;right:16px;top:16px;z-index:9999;border:none;border-radius:999px;padding:10px 14px;background:#d97706;color:#fff;font-weight:800;box-shadow:0 10px 24px rgba(0,0,0,.18);cursor:pointer';
    btn.addEventListener('click', ()=>{
      const next = lang()==='hi' ? 'en' : 'hi';
      if (window.PP_LANG && PP_LANG.setLang) PP_LANG.setLang(next);
      else {
        localStorage.setItem('pp_lang', next);
        document.documentElement.setAttribute('lang', next);
        document.documentElement.setAttribute('data-lang', next);
        window.dispatchEvent(new CustomEvent('pp:langchange',{detail:{lang:next}}));
      }
    });
    document.body.appendChild(btn);
  }
  function init(){ ensureFallbackToggle(); applyDocument(); }
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('pp:langchange', applyDocument);
  window.addEventListener('pp:includesloaded', ()=>setTimeout(applyDocument,50));
  const mo = new MutationObserver(()=>{ clearTimeout(window.__ppTranslateTick); window.__ppTranslateTick = setTimeout(applyDocument, 60); });
  document.addEventListener('DOMContentLoaded', ()=>{ if (document.body) mo.observe(document.body, {childList:true, subtree:true, characterData:true}); });
  window.PP_SITE_TRANSLATE = { apply: applyDocument, t: tr };
})();
