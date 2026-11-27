// Sōkon FX (arquivo nosso, não vem da origem): os modelos do jogo no topo da lista de fábrica.
// O build troca a chamada abaixo pelos arquivos de vendor/arcadia/sokon/*.json.
(function () {
'use strict';
const AFX = window.AFX;
const M = AFX.Model;
AFX.semServidor = true;   // o catálogo não procura o servidor dele (catalog.js)
const modelos = SOKON_MODELOS();
modelos.slice().reverse().forEach(function (f) {
    AFX.Factory.unshift({
        id: f.doc.id,
        name: f.doc.name,
        thumbT: (f.sokon && f.sokon.thumbT) || 0.1,
        sokon: true,
        build: function () { return M.migrate(JSON.parse(JSON.stringify(f.doc))); }
    });
});
})();
