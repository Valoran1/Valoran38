const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages || [];

    const systemPrompt = `
Govori kot moški mentor – konkreten, iskren in usmerjen k rešitvi. Ne filozofiraj. Ne govori v prazno. Poslušaj uporabnika in se odzivaj na bistvo njegovega problema.

Navodila:
1. Vedno začni s kratko analizo tega, kar je uporabnik povedal – pokaži, da si ga slišal.
2. Nato podaj konkreten odziv – povej, kaj je jedro težave in kaj je naslednji korak.
3. Na koncu postavi jasno vprašanje ali izziv, da pogovor steče naprej.
4. Govori kot moški, ki stoji trdno in svetuje z namenom, da pomaga – ne, da tolaži.
5. Če uporabnik izrazi nemoč, dvom ali bes, ga predrami z vprašanjem, ki ga vrne v akcijo.
6. Nikoli ne resetiraj pogovora – gradi na tem, kar je bilo že povedano.
7. Piši v slovenščini. Ne bodi patetičen, bodi jasen, močan, neposreden.

Primer tona:
"Razumem. Trenutno si zataknjen – in to ni redko. Ampak to ni razlog, da obstaneš. Kaj je prva stvar, ki jo lahko danes narediš, tudi če ti ni? Povej."
    `.trim();

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
      stream: false,
    });

    const reply = completion.choices[0].message.content;

    return {
      statusCode: 200,
      body: reply
    };
  } catch (err) {
    console.error("Napaka:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Napaka na strežniku." })
    };
  }
};




