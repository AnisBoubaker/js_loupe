/* JSX: React.DOM */

var React = require('react');
var CallStack = require('./call-stack.jsx');
var EventLoopSpinner = require('./event-loop-spinner.jsx');
var WebApis = require('./web-apis.jsx');
var Editor = require('./editor.jsx');
var CallbackQueue = require('./callback-queue.jsx');
var RenderQueue = require('./render-queue.jsx');
var HTMLEditor = require('./html-editor.jsx');
var SettingsPanel = require('./settings-panel.jsx');
var EventMixin = require('react-backbone-events-mixin');
var Modal = require('react-modal');

module.exports = React.createClass({
    mixins: [EventMixin],

    getInitialState: function () {
        var showRenderQueue = window.location.search.match(/show-renders/);

        return {
            settingsOpen: false,
            code: app.store.code,
            modalOpen: true
        };
    },

    openModal: function () {
        this.setState({ modalOpen: true });
    },

    closeModal: function () {
        this.setState({ modalOpen: false });
    },

    registerListeners: function (props, state) {
        this.listenTo(state.code, 'change:simulateRenders', function () {
            this.forceUpdate();
        }.bind(this));
    },

    toggleSettings: function () {
        this.setState({
            settingsOpen: !this.state.settingsOpen
        });
    },
    render: function () {
        return (
          <div>
            <div className='flexContainer'>
              <nav className="top-nav">
                <button className='settings-button' onClick={this.toggleSettings}>⚒</button>
                <h1>loupe</h1>
                <a className='modal-button' onClick={this.openModal}>aide</a>
              </nav>
              <div className="flexChild rowParent">
                <SettingsPanel open={this.state.settingsOpen}/>

                <div className="flexChild columnParent codeColumn">
                  <div className="flexChild columnParent editorBox">
                    <Editor/>
                  </div>

                  <div className="flexChild columnParent htmlEditorBox">
                    <HTMLEditor/>
                  </div>
                </div>

                <div className="flexChild columnParent">
                  <div className="flexChild rowParent stackRow">
                    <div className="stackBox columnParent">

                      <CallStack />

                      <EventLoopSpinner />
                    </div>

                    <div className="flexChild columnParent">
                      <WebApis/>
                    </div>
                  </div>

                  <div className="flexChild callbackRow columnParent">
                    { this.state.code.simulateRenders ? <RenderQueue /> : null }
                    <CallbackQueue />
                  </div>
                </div>
              </div>
            </div>

            <Modal
                isOpen={this.state.modalOpen}
                onRequestClose={this.closeModal}>

                <a className="modalClose" onClick={this.closeModal}>fermer</a>

                <h1>Loupe</h1>
                <h2>Intro</h2>
                <p>Loupe est un outil de visualisation pour vous aider à comprendre comment la boucle d'événement de JavaScript fonctionne.</p>
                <h2>Instructions</h2>
                <ul>
                    <li>Écrire du code javascript dans l'éditeur de gauche.</li>
                    <li>Presser le bouton "Enregister + Run" pour visualiser l'exécution.</li>
                    <li>Il est possible de créer des élément HTML dans la boite en bas à gauche en pressant le bouton "Modifier".</li>
                    <li>Ensuite, intercepter les événements du DIM avec <pre>$.on("button", "click", function () {'{'} console.log("hello") {'}'}</pre></li>
                    <li>Cliquer sur l'icône d'outils en haut à gauche pour plus d'options.</li>
                    <li>Besoin d'aide? Envoyez un message à <a href="http://x.com/philip_roberts">@philip_roberts</a> sur X.</li>
                </ul>

                <h2>Comme ça marche?</h2>
                <ul>
                    <li>Loupe s'exécute entièrement dans votre navigateur.</li>
                    <li>Ça prend votre code.</li>
                    <li>Ça l'exécute à travers esprima, un parseur JavaScript.</li>
                    <li>Le code est modifié de sorte que loupe sache où les appels de fonctions, timeouts, événements du DOM, etc se produisent.</li>
                    <li>Ça ajoute un paquet de boucles while pour ralentir l'exécution.</li>
                    <li>Ce code modifié est ensuite converti en JavaScript et envoyé à un Webworker (dans votre navigateur) qui l'exécute.</li>
                    <li>Pendant qu'il s'exécute, le code qui a été ajouté envoie des messages à la visualisation pour illustrer ce qui se passe, permettant ainsi les animations au bon moment.</li>
                    <li>Il ajoute aussi quelques truc magiques pour permettre le fonctionnement adéquat des événements du DOM et des timers.</li>
                </ul>

                <p className="info"><em>Créé par <a href="http://github.com/latentflip">Philip Roberts</a> de <a href="http://andyet.com">&amp;yet</a>. Le code est sur <a href="https://github.com/latentflip/loupe">github</a></em>.</p>

                <p className="info">Tout compris? <a onClick={this.closeModal}>Fermer cette boite</a></p>
            </Modal>
          </div>
        )
    }
});
