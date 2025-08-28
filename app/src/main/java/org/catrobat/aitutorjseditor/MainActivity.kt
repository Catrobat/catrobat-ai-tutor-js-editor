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
                        const config = {         
                          type: Phaser.AUTO,         
                          parent: 'game-container',         
                          width: 800,         
                          height: 600,         
                          backgroundColor: '#10131a',         
                          physics: {           
                            default: 'arcade',           
                            arcade: {             
                              gravity: { y: 0 },             
                              debug: false           
                            }         
                          },         
                          scene: { preload: preload, create: create, update: update }       
                        };        

                        let player, coins, cursors, scoreText, score = 0, pointerTarget = null;        

                        new Phaser.Game(config);        

                        function preload() {         
                          // nothing to load: we'll generate textures at runtime       
                        }        

                        function create() {         
                          // Helper: generate a filled-circle texture         
                          function makeCircleTexture(key, radius, color) {           
                            const g = this.make.graphics({ x: 0, y: 0, add: false });           
                            g.fillStyle(color, 1);           
                            g.fillCircle(radius, radius, radius);           
                            g.generateTexture(key, radius * 2, radius * 2);           
                            g.destroy();         
                          }          

                          makeCircleTexture.call(this, 'playerTex', 18, 0x25b1ff);         
                          makeCircleTexture.call(this, 'coinTex', 10, 0xffd54f);          

                          // Player         
                          player = this.physics.add.image(400, 300, 'playerTex');         
                          player.setCircle(18).setCollideWorldBounds(true).setDamping(true).setDrag(0.001);          

                          // Coins         
                          coins = this.physics.add.group({ 
                            key: 'coinTex', 
                            repeat: 9, 
                            setXY: { x: 60, y: 80, stepX: 70 } 
                          });         
                          coins.children.iterate(function(c) {           
                            c.setCircle(10);           
                            c.setBounce(1);           
                            c.setVelocity(Phaser.Math.Between(-120, 120), Phaser.Math.Between(-120, 120));           
                            c.setCollideWorldBounds(true);         
                          });          

                          // Overlap: collect coin         
                          this.physics.add.overlap(player, coins, function(playerObj, coin) {           
                            coin.disableBody(true, true);           
                            score += 10;           
                            scoreText.setText('Score: ' + score);            

                            // respawn a coin after a short delay at a random spot           
                            this.time.delayedCall(600, function() {             
                              const x = Phaser.Math.Between(30, this.scale.width - 30);             
                              const y = Phaser.Math.Between(30, this.scale.height - 30);             
                              const newCoin = coins.get(x, y);             
                              if (newCoin) {               
                                newCoin.enableBody(true, x, y, true, true);               
                                newCoin.setCircle(10);               
                                newCoin.setBounce(1);               
                                newCoin.setVelocity(Phaser.Math.Between(-120, 120), Phaser.Math.Between(-120, 120));               
                                newCoin.setCollideWorldBounds(true);             
                              }           
                            }, [], this);         
                          }, null, this);          

                          // Keyboard controls         
                          cursors = this.input.keyboard.createCursorKeys();          

                          // Pointer / touch: hold to move toward pointer, release to stop         
                          this.input.on('pointerdown', function(pointer) {           
                            pointerTarget = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);         
                          });         
                          this.input.on('pointermove', function(pointer) {           
                            if (pointer.isDown) {             
                              pointerTarget = new Phaser.Math.Vector2(pointer.worldX, pointer.worldY);           
                            }         
                          });         
                          this.input.on('pointerup', function() { pointerTarget = null; });          

                          // UI         
                          scoreText = this.add.text(16, 16, 'Score: 0', { 
                            fontFamily: 'monospace', 
                            fontSize: '20px', 
                            color: '#ffffff' 
                          });         
                          this.add.text(16, 44, 'Arrows = move  •  Touch & hold = move to finger', { 
                            fontFamily: 'monospace', 
                            fontSize: '14px', 
                            color: '#9bb1ff' 
                          });          

                          // Resize to fit window while keeping aspect         
                          this.scale.scaleMode = Phaser.Scale.FIT;         
                          this.scale.refresh();       
                        }        

                        function update(time, delta) {         
                          const speed = 220;         
                          player.setVelocity(0);          

                          // Keyboard movement         
                          if (cursors.left && cursors.left.isDown)  player.setVelocityX(-speed);         
                          if (cursors.right && cursors.right.isDown) player.setVelocityX(speed);         
                          if (cursors.up && cursors.up.isDown)    player.setVelocityY(-speed);         
                          if (cursors.down && cursors.down.isDown)  player.setVelocityY(speed);          

                          // Pointer movement (seek toward target)         
                          if (pointerTarget) {           
                            const to = new Phaser.Math.Vector2(pointerTarget.x - player.x, pointerTarget.y - player.y);           
                            const dist = to.length();           
                            if (dist > 4) {             
                              to.normalize().scale(speed);             
                              player.setVelocity(to.x, to.y);           
                            } else {             
                              player.setVelocity(0, 0);           
                            }         
                          }       
                        }
                    """.trimIndent()
                    )
                }
                var showAiTutor by remember { mutableStateOf(false) }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    floatingActionButton = {
                        Column {
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
                        )
                    }

                    AiTutorView(
                        show = showAiTutor,
                        onDismissRequest = { showAiTutor = false },
                        codeContext = text,
                        systemContext = "The user is editing a JavaScript program for a Phaser game."
                    )
                }
            }
        }
    }
}