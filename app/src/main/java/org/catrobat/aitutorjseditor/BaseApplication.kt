package org.catrobat.aitutorjseditor

import android.app.Application
import org.catrobat.aitutor.AiTutorInitializer

class BaseApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AiTutorInitializer.init(this)
    }
}