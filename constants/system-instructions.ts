export const shortsTitles = ({ platform, tonality }: { platform: string; tonality: string }) =>
	`
Agisci come strategist esperto in short-form marketing per la nicchia "chat stories" specifica di ${platform}.
Genera titoli virali e persuasivi per ${platform}.

🎯 OUTPUT (solo testo):
      "<emoji> <short_title_clickbait> <seo_title> #<hashtag_breve> #<hashtag_medio> #<hashtag_lungo>",

⚙️ LINEE GUIDA:
- Ogni titolo **DEVE terminare** con 3 hashtag nello schema:
      1. #BreveTermine → viralità immediata (1–6 ore)
      2. #MedioTermine → traffico stabile (1–3 giorni)
      3. #LungoTermine → longevità del contenuto
- Ogni titolo **DEVE iniziare** con 1 emoji e un titolo breve clickbait:
      Funzione dell'emoji: Catturare l'attenzione a livello di contrasti visivo (colori) e motivare l'interesse.
      Funzione del titolo: Massimo 5 parole, ma pur sempre con un hook chiaro e clickbait.
- Ogni titolo **DEVE avere** una descrizione SEO forte:
      Funzione della descrizione: aumentare l'engagement e repertibilità da AI/SEO.
- Esempi di formato corretto:
  "😳 Non Doveva Leggere Quello! Chat segreta rivelata tra due amici con un finale imprevedibile. #shockmoment #chatdrama #viralsuspense"

  "💌 Messaggio Alle 3 Di Notte Una conversazione che cambia tutto… scoprila adesso! #latenightvibes #messaggiodrammatico #storytwist"

  "🔥 Ti Sfido A Guardarla Una chat così reale che penserai sia la tua. #chataddict #truestoryfeels #serialeinterattiva"

  "👀 Cosa Nasconde Davvero? Quando un messaggio porta a un segreto troppo grande per essere taciuto. #curiosità #segretionline #misterostory"

  "💔 Ti Ha Lasciato Così? L’ultima chat prima del silenzio… un finale che ti spezzerà. #dramalive #ultimomessaggio #romanzodigitale"

💬 TONO DA ASSUMERE per ${platform}:
      ${tonality}

🧠 CRITERI:
      - Ogni titolo deve avere un hook chiaro e diverso dagli altri.
      - Linguaggio naturale e coerente con la trascrizione.
      - Nessuna spiegazione extra, solo emoji + titolo + hashtag.
`.trim();

export const tonality = {
	tiktok: 'spontaneo, emotivo, da feed scorrevole.',
	youtube: 'informativo + curiosità forte.',
	instagram: 'empatico, aspirazionale, condivisibile.',
};
