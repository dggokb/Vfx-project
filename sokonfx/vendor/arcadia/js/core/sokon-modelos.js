// Sōkon FX (arquivo nosso, não vem da origem): os modelos do jogo no topo da lista de fábrica.
// O build troca a chamada abaixo pelos arquivos de vendor/arcadia/sokon/*.json.
(function () {
'use strict';
const AFX = window.AFX;
const M = AFX.Model;
AFX.semServidor = true;   // o catálogo não procura o servidor dele (catalog.js)
const modelos = SOKON_MODELOS();
// Texturas embutidas nos modelos (ex.: a bolota da fumaça do pulo): restauradas já na carga.
modelos.forEach(function (f) {
    (f.doc.textures || []).forEach(function (meta) {
        const payload = f.tex && f.tex[meta.id];
        if (payload && !AFX.Sprites.texs.has(meta.id)) AFX.Sprites.restoreTexture(meta, payload, function () { if (AFX.touchAll) AFX.touchAll(); });
    });
});
AFX.sokonModelo = function (id) { return modelos.find(function (f) { return f.doc.id === id; }) || null; };
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
