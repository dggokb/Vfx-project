#!/usr/bin/env bash
# Monta o APK do Sōkon FX (o HTML único num WebView) só com o SDK do Android, sem Gradle:
#   ANDROID_SDK=/opt/android-sdk sokonfx/android/build-apk.sh [saida.apk]
# Precisa de platforms;android-35 e build-tools;35.0.0, e de uma chave (KEYSTORE, senha em KEYPASS;
# sem chave, cria uma de teste fora do repositório, em ~/.sokonfx-apk.jks).
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"; RAIZ="$(cd "$AQUI/../.." && pwd)"
SDK="${ANDROID_SDK:-/opt/android-sdk}"; BT="$SDK/build-tools/35.0.0"; JAR="$SDK/platforms/android-35/android.jar"
SAIDA="${1:-$RAIZ/sokonfx/android/build/SokonFX.apk}"
KEYSTORE="${KEYSTORE:-$HOME/.sokonfx-apk.jks}"; KEYPASS="${KEYPASS:-sokonfx}"
B="$AQUI/build"; rm -rf "$B"; mkdir -p "$B/assets" "$B/classes" "$B/dex"
node "$RAIZ/sokonfx/build.mjs" >/dev/null
# O HTML com a ponte de download logo no começo.
node -e '
const fs=require("fs");const [html,ponte,out]=process.argv.slice(1);
let h=fs.readFileSync(html,"utf8");const p="<script>"+fs.readFileSync(ponte,"utf8")+"</script>";
const i=h.indexOf("<head>");h=i>=0?h.slice(0,i+6)+p+h.slice(i+6):p+h;fs.writeFileSync(out,h)' \
 "$RAIZ/sokonfx/dist/SokonFX.html" "$AQUI/ponte.js" "$B/assets/SokonFX.html"
"$BT/aapt2" compile --dir "$AQUI/res" -o "$B/res.zip"
VERSAO="$(git -C "$RAIZ" rev-list --count HEAD 2>/dev/null || echo 1)"
"$BT/aapt2" link -o "$B/base.apk" -I "$JAR" --manifest "$AQUI/AndroidManifest.xml" -A "$B/assets" \
 --min-sdk-version 24 --target-sdk-version 35 --version-code "$VERSAO" --version-name "1.$VERSAO" "$B/res.zip"
javac -source 8 -target 8 -nowarn -Xlint:-options -bootclasspath "$JAR" -classpath "$JAR:$BT/core-lambda-stubs.jar" -encoding UTF-8 -d "$B/classes" $(find "$AQUI/java" -name '*.java')
"$BT/d8" --min-api 24 --lib "$JAR" --output "$B/dex" $(find "$B/classes" -name '*.class')
cp "$B/base.apk" "$B/sem-assinar.apk"; (cd "$B/dex" && zip -q -j "$B/sem-assinar.apk" classes.dex)
"$BT/zipalign" -f -p 4 "$B/sem-assinar.apk" "$B/alinhado.apk"
[ -f "$KEYSTORE" ] || keytool -genkeypair -keystore "$KEYSTORE" -storepass "$KEYPASS" -keypass "$KEYPASS" -alias sokonfx \
 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Sokon FX" >/dev/null 2>&1
mkdir -p "$(dirname "$SAIDA")"
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-pass "pass:$KEYPASS" --out "$SAIDA" "$B/alinhado.apk"
echo "APK: $SAIDA ($(du -h "$SAIDA" | cut -f1))"
