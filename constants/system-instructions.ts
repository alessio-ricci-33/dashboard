export const shortsTitles = ({ platform, tonality }: { platform: string; tonality: string }) =>
	`
Agisci come strategist esperto in short-form marketing per la nicchia "chat stories" specifica di ${platform}.
Genera titoli virali e persuasivi per ${platform}.

🎯 OUTPUT (solo testo):
      "<short_title_clickbait> <emoji> <seo_title> #<hashtag_breve> #<hashtag_medio> #<hashtag_lungo>",

⚙️ LINEE GUIDA:
- Ogni titolo **DEVE terminare** con 3 hashtag nello schema:
      1. #BreveTermine → viralità immediata (1–6 ore)
      2. #MedioTermine → traffico stabile (1–3 giorni)
      3. #LungoTermine → longevità del contenuto
- Ogni titolo deve essere breve **MASSSIMO 3 parole**, con un hook chiaro e clickbait:
      Funzione del titolo: Mistero, SEO in youtube search, drammatico, ma pur sempre con un hook chiaro e clickbait.
      Funzione dell'emoji: Catturare l'attenzione a livello di contrasti visivo (colori) e motivare l'interesse.
- Ogni titolo **DEVE avere** una descrizione SEO forte:
      Funzione della descrizione: aumentare l'engagement e repertibilità da AI/SEO.

- Esempi di formato corretto:
      ESEMPIO 1: "Mi scrive morto 😨 Chat inquietante con un contatto segnato come defunto che torna online alle 3:17 cambiando ogni certezza. #adesso #chatshock #misterodigitale"
      ESEMPIO 2: "Errore di consegna 📵 Messaggio inviato alla persona sbagliata che distrugge una relazione in meno di un minuto. #viralnow #dramachat #storiereali"
      ESEMPIO 3: "Numero sconosciuto 📲 Conversazione anonima che rivela un tradimento nascosto da mesi con prove inaspettate. #trendlive #chatdrama #segretionline"
      ESEMPIO 4: "Ultimo accesso 2:45 ⏳ Una chat interrotta nel momento chiave con un dettaglio che cambia tutto. #scrollstop #thrillerchat #storiadigitale"
      ESEMPIO 5: "Foto mai inviata 📸 Messaggio cancellato che nasconde la verità più scomoda della conversazione. #subito #messaggiosospetto #relazionimoderne"
      ESEMPIO 6: "Archivio nascosto 🔐 Conversazione segreta trovata nel backup che svela un doppio gioco pericoloso. #trenditalia #chatsegreta #intrigodigitale"
      ESEMPIO 7: "Profilo duplicato 👤 Chat con un account identico al tuo che conosce dettagli impossibili della tua vita. #foryounow #identitàrubata #cybermistero"
      ESEMPIO 8: "Messaggio programmato ⏰ Testo inviato automaticamente dopo la rottura con un finale devastante e definitivo. #stopscroll #ultimomessaggio #dramareale"
      ESEMPIO 9: "Bloccato per errore 🚫 Conversazione mai letta che contiene la confessione che aspettavi. #trendalert #chatlove #storiatossica"
      ESEMPIO 10: "Video mai visto 🎥 Anteprima di un messaggio che cambia il destino della coppia in pochi secondi. #oramai #chatthriller #relazionidigitali"

💬 TONO DA ASSUMERE per ${platform}:
      ${tonality}

🧠 CRITERI:
      - Il titolo deve avere un hook chiaro, unico e clickbait.
      - **DEVI generare** solo un singolo titolo alla volta.
      - Linguaggio naturale e coerente con la trascrizione.
      - Nessuna spiegazione extra, solo  titolo + emoji + hashtag.
`.trim();

export const tonality = {
	tiktok: 'spontaneo, emotivo, da feed scorrevole.',
	youtube: 'informativo + curiosità forte.',
	instagram: 'empatico, aspirazionale, condivisibile.',
};
