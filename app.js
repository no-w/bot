var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
        // session.send("Salut, bolosse. Prêt à lutter contre le gaspillage alimentaire?");
        session.beginDialog('greetings3');

        // session.send("Ce bolosse vient des dire: %s", session.message.text);
    },
    function (session, results) {
        session.beginDialog('choice1');
    },
    function (session, results) {

        session.beginDialog('start1');
    },
    function (session, results) {
       if (results.response.entity == 'J\'ai faim!') {
           session.beginDialog('faim');
        }
    }
]);
// Ask the user for their name and greet them by name.
bot.dialog('greetings', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
]);

bot.dialog('greetings2', [
    function (session) {
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.HeroCard(session)
                .title("NOW")
                .subtitle("No Waste, Act Now")
                .text("Toi aussi, contribue à la lutte contre le gaspillage alimentaire")
                .images([builder.CardImage.create(session, 'https://raw.githubusercontent.com/no-w/no-w.github.io/master/img/header-bg-now.jpg')])
            // .buttons([
            //     builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            // ])
        ]);
        session.send(msg).endDialog();
    }
]);

bot.dialog('greetings3', [
    function (session) {
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.AnimationCard(session)
                .autoloop(true)
                .autostart(true)
                // .title("Tous les jours des tonnes d'aliments sont gaspillés à traver le monde.")
                .media([builder.CardMedia.create(session, "https://media.giphy.com/media/XmxcpZ7S8cJb2/giphy.gif")])
        ]);
        session.send(msg).endDialog();
        // session.send(msg);
        // builder.Prompts.text(session, "Es-tu prêt à lutter contre le gaspillage alimentaire?")
    }
]);

bot.dialog("choice1", [
    function (session) {
        builder.Prompts.text(session, "Es-tu prêt à lutter contre le gaspillage alimentaire?")
    },
    function (session, results) {
        session.endDialog("Magnifique!")
    }
]);

bot.dialog('faim', [
    function (session, results) {
        session.beginDialog('localisation');
    },
    function (session, results) {
        // session.send("Je t'envoie les magains proche de %s", results.response);
        session.beginDialog('magasin');
    }
]);

bot.dialog('start1', [
    function (session) {
        //builder.Prompts.text(session, "How many people are in your party?");
        builder.Prompts.choice(
            session,
            "Je suis le robot NOW, à ton service. Que puis-je faire pour toi?",
            ["J'ai faim!", "Où est ma bouffe?", "Je veux parler à ton supérieur"],
            { listStyle: 3 });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('localisation', [
    function (session) {
        builder.Prompts.text(session, "Ou es-tu?");
    },
    function (session, results) {
    //     session.send("Tu es à %s", results.response);
        session.endDialogWithResult(results);
    }

]);

bot.dialog('magasin', [
    function (session, results) {
        session.endDialogWithResult('Tu es à %s', results.response)
    }

]);

bot.dialog('help', function (session) {
    session.endDialog("Comment pouvons-nous vous aider?");
})
.triggerAction({
    matches: /^help$/i,
});
