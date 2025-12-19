package org.catrobat.aitutorjseditor

import android.content.Intent
import android.graphics.Typeface
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import io.github.rosemoe.sora.event.ContentChangeEvent
import io.github.rosemoe.sora.langs.textmate.TextMateColorScheme
import io.github.rosemoe.sora.langs.textmate.TextMateLanguage
import io.github.rosemoe.sora.widget.CodeEditor
import io.github.rosemoe.sora.widget.style.builtin.ScaleCursorAnimator
import io.github.rosemoe.sora.widget.subscribeEvent
import org.catrobat.aitutor.ui.public.AiTutorFloatingActionButton
import org.catrobat.aitutor.ui.public.AiTutorView
import org.catrobat.aitutorjseditor.ui.theme.CatrobatAITutorJSEditorTheme
import org.eclipse.tm4e.core.registry.IGrammarSource
import org.eclipse.tm4e.core.registry.IThemeSource
import java.io.InputStreamReader

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CatrobatAITutorJSEditorTheme {
                val context = LocalContext.current
                var text by rememberSaveable {
                    mutableStateOf(
                        """
                    // Write your Phaser game code here
                    console.log("Hello, World!");
                """.trimIndent()
                    )
                }
                var showAiTutor by remember { mutableStateOf(false) }
                var showFileSelector by remember { mutableStateOf(false) }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    floatingActionButton = {
                        Column {
                            FloatingActionButton(onClick = {
                                showFileSelector = true
                            }) {
                                Icon(
                                    imageVector = Icons.Filled.Folder,
                                    contentDescription = "Select File"
                                )
                            }
                            Spacer(modifier = Modifier.padding(8.dp))
                            AiTutorFloatingActionButton(
                                onClick = {
                                    showAiTutor = true
                                }
                            )
                            Spacer(modifier = Modifier.padding(8.dp))
                            FloatingActionButton(onClick = {
                                // Create an Intent to launch GameActivity
                                val intent = Intent(context, GameActivity::class.java).apply {
                                    putExtra("USER_CODE", text)
                                }
                                context.startActivity(intent)
                            }) {
                                Icon(
                                    imageVector = Icons.Filled.PlayArrow,
                                    contentDescription = "Run Code"
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        AndroidView(
                            modifier = Modifier.fillMaxSize(),
                            factory = { context ->
                                CodeEditor(context).apply {

                                    // Setup JavaScript language and theme
                                    val theme =
                                        assets.open("textmate/darcula.tmTheme.json").use {
                                            IThemeSource.fromInputStream(
                                                it,
                                                "darcula.tmTheme.json",
                                                null
                                            )
                                        }
                                    val colorScheme = TextMateColorScheme.create(theme)
                                    this.colorScheme = colorScheme
                                    val language = TextMateLanguage.create(
                                        IGrammarSource.fromInputStream(
                                            assets.open("textmate/javascript/syntaxes/javascript.tmLanguage.json"),
                                            "javascript.tmLanguage.json",
                                            null
                                        ),
                                        InputStreamReader(assets.open("textmate/javascript/javascript.language-configuration.json")),
                                        theme
                                    )
                                    setEditorLanguage(language)

                                    setText(text)
                                    typefaceText = Typeface.createFromAsset(
                                        assets,
                                        "JetBrainsMono-Regular.ttf"
                                    )
                                    cursorAnimator = ScaleCursorAnimator(this)
                                    nonPrintablePaintingFlags =
                                        CodeEditor.FLAG_DRAW_WHITESPACE_LEADING or CodeEditor.FLAG_DRAW_LINE_SEPARATOR or CodeEditor.FLAG_DRAW_WHITESPACE_IN_SELECTION

                                    subscribeEvent<ContentChangeEvent> { event, _ ->
                                        text = event.editor.text.toString()
                                    }
                                }
                            },
                            update = { editor ->
                                // Update editor content when text state changes (e.g., from file selection)
                                if (editor.text.toString() != text) {
                                    editor.setText(text)
                                }
                            }
                        )
                    }

                    AiTutorView(
                        show = showAiTutor,
                        onDismissRequest = { showAiTutor = false },
                        codeContext = text,
                        systemContext = "The user is editing a JavaScript program for a Phaser game."
                    )

                    FileSelectorDialog(
                        show = showFileSelector,
                        onDismissRequest = { showFileSelector = false },
                        onFileSelected = { fileContent ->
                            text = fileContent
                        }
                    )
                }
            }
        }
    }
}