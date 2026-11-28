package com.sokonfx.app;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * Sōkon FX no celular: o HTML único do Sōkon FX (assets/SokonFX.html) num WebView, com a ponte para
 * baixar (Download/SokonFX) e escolher arquivos (print da luta, referência, tipos, efeitos do Arcadia).
 */
public class MainActivity extends Activity {
    private static final int ESCOLHER = 1;
    private WebView web;
    private ValueCallback<Uri[]> escolha;

    @Override
    protected void onCreate(Bundle salvo) {
        super.onCreate(salvo);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setBuiltInZoomControls(true);
        s.setDisplayZoomControls(false);
        web.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        web.addJavascriptInterface(new Ponte(), "SokonAndroid");
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (escolha != null) escolha.onReceiveValue(null);
                escolha = cb;
                Intent i = p.createIntent();
                if (p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                try {
                    startActivityForResult(i, ESCOLHER);
                } catch (Exception e) {
                    escolha = null;
                    return false;
                }
                return true;
            }
        });
        if (salvo != null) web.restoreState(salvo);
        else web.loadUrl("file:///android_asset/SokonFX.html");
    }

    @Override
    protected void onActivityResult(int pedido, int resultado, Intent dados) {
        if (pedido != ESCOLHER || escolha == null) return;
        Uri[] uris = null;
        if (resultado == RESULT_OK && dados != null) {
            if (dados.getClipData() != null) {
                int n = dados.getClipData().getItemCount();
                uris = new Uri[n];
                for (int k = 0; k < n; k++) uris[k] = dados.getClipData().getItemAt(k).getUri();
            } else if (dados.getData() != null) {
                uris = new Uri[]{dados.getData()};
            }
        }
        escolha.onReceiveValue(uris);
        escolha = null;
    }

    @Override
    protected void onSaveInstanceState(Bundle estado) {
        super.onSaveInstanceState(estado);
        web.saveState(estado);
    }

    @Override
    public void onBackPressed() {
        // Com o editor de partículas aberto, voltar fecha o editor (o botão Cancelar dele).
        web.evaluateJavascript("(function(){var c=document.getElementById('arcadiaEditor');if(c&&c.classList.contains('aberto')){document.getElementById('arcadiaCancelar').click();return 1}return 0})()",
            r -> { if (!"1".equals(r)) { if (web.canGoBack()) web.goBack(); else finish(); } });
    }

    /** O que a página chama: grava o arquivo baixado em Download/SokonFX. */
    private class Ponte {
        @JavascriptInterface
        public void salvar(String nome, String tipo, String base64) {
            String limpo = nome.replaceAll("[\\\\/:*?\"<>|]", "_");
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                String onde;
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, limpo);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, tipo);
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/SokonFX");
                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    try (OutputStream o = getContentResolver().openOutputStream(uri)) { o.write(bytes); }
                    onde = "Download/SokonFX/" + limpo;
                } else {
                    File pasta = new File(getExternalFilesDir(null), "SokonFX");
                    pasta.mkdirs();
                    File f = new File(pasta, limpo);
                    try (FileOutputStream o = new FileOutputStream(f)) { o.write(bytes); }
                    onde = f.getAbsolutePath();
                }
                aviso("Salvo em " + onde);
            } catch (Exception e) {
                aviso("Não deu para salvar " + limpo + ": " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void erro(String msg) { aviso("Erro ao baixar: " + msg); }
    }

    private void aviso(String texto) {
        runOnUiThread(() -> Toast.makeText(this, texto, Toast.LENGTH_LONG).show());
    }
}
