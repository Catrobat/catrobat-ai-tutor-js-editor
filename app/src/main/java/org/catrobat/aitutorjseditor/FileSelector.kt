package org.catrobat.aitutorjseditor

import android.content.Context
import android.util.Log
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Code
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import java.io.BufferedReader
import java.io.InputStreamReader

data class JsFile(
    val resourceId: Int,
    val fileName: String,
    val displayName: String,
)

/**
 * Helper function to get all JavaScript files from res/raw folder
 */
fun getAllJsFiles(
    context: Context,
    onError: (String) -> Unit,
): List<JsFile> {
    val files = mutableListOf<JsFile>()
    val rawClass = R.raw::class.java

    rawClass.fields.forEach { field ->
        try {
            val fileName = field.name // e.g., "bouncing_balls"

            val resourceId = field.getInt(null)
            val displayName = formatFileName(fileName)
            files.add(JsFile(resourceId, fileName, displayName))

        } catch (e: Exception) {
            val errorMessage = context.getString(
                R.string.error_accessing_resource_id_for,
                field.name,
                e.message
            )
            Log.e("FileSelector", errorMessage)
            onError(errorMessage)
        }
    }

    return files.sortedBy { it.displayName }
}

/**
 * Format file name for display
 * Converts: coin_collector -> Coin Collector
 */
private fun formatFileName(fileName: String): String {
    return fileName
        .replace("_js", "")
        .split("_")
        .joinToString(" ") { word ->
            word.replaceFirstChar { it.uppercase() }
        }
}

/**
 * Read content from a raw resource file
 */
fun readJsFile(
    context: Context,
    resourceId: Int,
    onError: (String) -> Unit,
): String {
    return try {
        val inputStream = context.resources.openRawResource(resourceId)
        val reader = BufferedReader(InputStreamReader(inputStream))
        reader.use { it.readText() }
    } catch (e: Exception) {
        val errorMessage = context.getString(
            R.string.error_reading_js_file,
            e.message
        )
        Log.e("FileSelector", errorMessage)
        onError(errorMessage)
        context.getString(R.string.error_loading_file, e.message)
    }
}

/**
 * File Selector Dialog Composable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FileSelectorDialog(
    show: Boolean,
    onDismissRequest: () -> Unit,
    onFileSelected: (String) -> Unit,
    onError: (String) -> Unit,
) {
    if (!show) return

    val context = LocalContext.current
    val jsFiles = remember { getAllJsFiles(context = context, onError = onError) }

    Dialog(
        onDismissRequest = onDismissRequest,
        properties = DialogProperties(
            usePlatformDefaultWidth = false
        )
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.9f)
                .fillMaxHeight(0.8f),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 8.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = stringResource(R.string.select_javascript_file),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismissRequest) {
                        Icon(
                            imageVector = Icons.Filled.Close,
                            contentDescription = stringResource(R.string.close)
                        )
                    }
                }

                HorizontalDivider(modifier = Modifier.padding(bottom = 16.dp))

                // File list
                if (jsFiles.isEmpty()) {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = stringResource(R.string.no_javascript_files_found),
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = stringResource(R.string.add_js_files_to_res_raw_folder),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(top = 8.dp)
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(jsFiles) { file ->
                            FileItem(
                                file = file,
                                onClick = {
                                    val content = readJsFile(
                                        context = context,
                                        resourceId = file.resourceId,
                                        onError = onError
                                    )
                                    onFileSelected(content)
                                    onDismissRequest()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Individual file item in the list
 */
@Composable
private fun FileItem(
    file: JsFile,
    onClick: () -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.Code,
                contentDescription = stringResource(R.string.javascript_file_icon),
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(40.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = file.displayName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "${file.fileName}.js",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
    }
}