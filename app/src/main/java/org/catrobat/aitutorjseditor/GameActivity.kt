package org.catrobat.aitutorjseditor

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.core.graphics.toColorInt
import androidx.core.view.setPadding

class GameActivity : ComponentActivity() {

    private lateinit var logView: TextView
    private lateinit var scrollView: ScrollView

    // This class acts as the bridge between JavaScript and Kotlin
    inner class WebAppInterface {
        @JavascriptInterface
        @Suppress("unused")
        fun showLog(message: String) {
            runOnUiThread {
                appendLog(message)
            }
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get the JavaScript code passed from MainActivity
        val userCode = intent.getStringExtra("USER_CODE") ?: "// No code provided"
        Log.d("GameActivity", "Received user code: $userCode")

        val escapedUserCode = userCode
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "")

        // Create the full HTML content to be loaded
        val htmlContent = """
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Phaser Game</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                    
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.0/phaser.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/3.55.0/phaser.min.js"></script>

                    
                    <style>
                        html, body { height: 100%; margin: 0; background:#0e0f12; }
                        #game-container { width: 100%; height: 100%; }
                        canvas { display:block; margin:0 auto; }
                    </style>
                </head>
                <body>
                    <div id="game-container"></div>
                    
                    <script>
                        // Interface for log
                        (function() {
                            const originalLog = console.log;
                            console.log = function(...args) {
                                originalLog.apply(console, args);
                                try {
                                    const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
                                    Android.showLog(message);
                                } catch(e) { /* ignore */ }
                            };
                            window.onerror = (msg, url, line) => console.log(`ERROR: ${"$"}{msg} at line ${"$"}{line}`);
                        })();

                        try {
                            const userCode = "${escapedUserCode}";
                            eval(userCode);
                        } catch (e) {
                            console.log("Execution Error: " + e.message);
                        }
                    </script>
                </body>
            </html>
        """.trimIndent()

        // Setup layout with WebView and Log View

        // 1. Create a root layout
        val rootLayout = FrameLayout(this)

        // 2. Setup the WebView
        val webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            // Add the interface, naming it "Android" in the JS context
            addJavascriptInterface(WebAppInterface(), "Android")
            loadDataWithBaseURL(null, htmlContent, "text/html", "UTF-8", null)
        }

        // 3. Setup the log view
        logView = TextView(this).apply {
            setTextColor(Color.WHITE)
            setBackgroundColor("#80000000".toColorInt()) // Black with 50% opacity
            setPadding(16)
            textSize = 12f
        }

        // 4. Setup a ScrollView for the logs
        scrollView = ScrollView(this).apply {
            addView(logView)
        }

        // 5. Add views to the root layout
        rootLayout.addView(webView) // WebView is at the bottom
        rootLayout.addView(scrollView, FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.BOTTOM // Stick the log view to the bottom
            height = 400 // Max height for the log view
        })

        // 6. Display the final layout
        setContentView(rootLayout)
    }

    private fun appendLog(message: String) {
        // Append new message and scroll to the bottom
        logView.append("\n> $message")
        scrollView.post {
            scrollView.fullScroll(ScrollView.FOCUS_DOWN)
        }
    }
}