package com.tippingpoint.pedastudio.api

import com.tippingpoint.pedastudio.BuildConfig
import com.tippingpoint.pedastudio.data.DayInfo
import com.tippingpoint.pedastudio.data.LessonItem
import com.tippingpoint.pedastudio.data.UserPreferences
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object PlanApiClient {
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(120, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    val isConfigured: Boolean get() = BuildConfig.API_BASE_URL.isNotBlank()

    fun generatePlan(
        lesson: LessonItem,
        day: Int,
        dayInfo: DayInfo?,
        selections: Map<String, String>,
        prefs: UserPreferences,
        idToken: String?,
    ): Result<JSONObject> {
        val base = BuildConfig.API_BASE_URL.trimEnd('/')
        if (base.isBlank()) {
            return Result.failure(IllegalStateException("API URL not set. Add pedastudio.api.url=http://10.0.2.2:3000 to android/local.properties"))
        }
        if (!base.startsWith("http://") && !base.startsWith("https://")) {
            return Result.failure(
                IllegalStateException("Invalid API URL \"$base\". Fix android/local.properties — use pedastudio.api.url=http://10.0.2.2:3000"),
            )
        }

        val teacherProfile = JSONObject().apply {
            put("name", prefs.teacherName)
            put("medium", prefs.medium)
            put("studentCount", prefs.studentCount.toString())
            put("seating", "Rows")
            put("resources", selections["tlms"] ?: prefs.getTeacherResources().joinToString())
            put("language", prefs.language)
            put("comfort", prefs.englishComfort)
        }

        val body = JSONObject().apply {
            put("lessonId", lesson.id)
            put("day", day)
            put("selections", JSONObject(selections))
            put("teacherProfile", teacherProfile)
        }

        val requestBuilder = Request.Builder()
            .url("$base/api/generate-plan")
            .post(body.toString().toRequestBody("application/json".toMediaType()))

        if (!idToken.isNullOrBlank()) {
            requestBuilder.addHeader("Authorization", "Bearer $idToken")
        }

        return try {
            client.newCall(requestBuilder.build()).execute().use { response ->
                val text = response.body?.string().orEmpty()
                if (!response.isSuccessful) {
                    val serverError = runCatching {
                        JSONObject(text).optString("error", text).takeIf { it.isNotBlank() }
                    }.getOrNull() ?: text
                    val friendly = when (response.code) {
                        401 -> "Please sign in again, then try generating the plan."
                        503 -> when {
                            serverError.contains("API key", ignoreCase = true) ->
                                "Server missing Claude API key. Redeploy App Hosting after setting ANTHROPIC_API_KEY secret."
                            serverError.isNotBlank() && serverError.length < 120 -> serverError
                            else -> "Plan service is starting up. Wait a minute and try again."
                        }
                        else -> "Server error ${response.code}: $serverError"
                    }
                    return Result.failure(Exception(friendly))
                }
                val json = JSONObject(text)
                val plan = json.optJSONObject("plan")
                    ?: return Result.failure(Exception("No plan in response"))
                Result.success(plan)
            }
        } catch (e: Exception) {
            val msg = e.message.orEmpty()
            val friendly = when {
                msg.contains("upstream connect", ignoreCase = true) ||
                    msg.contains("connection termination", ignoreCase = true) ||
                    msg.contains("connection reset", ignoreCase = true) ||
                    msg.contains("Failed to connect", ignoreCase = true) ||
                    msg.contains("Unable to resolve host", ignoreCase = true) ||
                    msg.contains("ECONNREFUSED", ignoreCase = true) ->
                    buildConnectionHelp(base)
                else -> msg.ifBlank { "Could not generate plan" }
            }
            Result.failure(Exception(friendly))
        }
    }

    private fun buildConnectionHelp(base: String): String {
        val usingEmulatorHost = base.contains("10.0.2.2")
        return buildString {
            append("Cannot reach plan server at $base. ")
            append("On your PC run: npm run dev (must stay open). ")
            if (usingEmulatorHost) {
                append("Emulator: use http://10.0.2.2:3000 (not https). ")
                append("Physical phone: use http://YOUR_PC_LAN_IP:3000 instead of 10.0.2.2. ")
            } else {
                append("Use http:// not https:// for local dev. ")
            }
            append("Then rebuild the Android app.")
        }
    }
}
