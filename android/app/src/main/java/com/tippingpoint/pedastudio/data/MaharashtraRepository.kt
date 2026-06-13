package com.tippingpoint.pedastudio.data

import android.content.Context
import org.json.JSONObject

data class LabelValue(val value: String, val label: String)

class MaharashtraRepository(context: Context) {
    private val root: JSONObject

    init {
        val json = context.assets.open("maharashtra.json").bufferedReader().use { it.readText() }
        root = JSONObject(json)
    }

    val districts: List<String> get() = root.getJSONArray("districts").toStringList()
    val states: List<LabelValue> get() = IndiaStates.all

    fun districtsForState(state: String): List<String> =
        if (state == IndiaStates.MAHARASHTRA) districts else emptyList()

    fun hasDistrictList(state: String): Boolean = districtsForState(state).isNotEmpty()

    val zillaParishads: List<String> get() = root.getJSONArray("zillaParishads").toStringList()
    val municipalCorporations: List<String> get() = root.getJSONArray("municipalCorporations").toStringList()
    val administrationTypes: List<LabelValue> get() = root.getJSONArray("administrationTypes").toLabelValues()
    val mediums: List<LabelValue> get() = root.getJSONArray("mediums").toLabelValues()
    val internetAccess: List<LabelValue> get() = root.getJSONArray("internetAccess").toLabelValues()
    val printingAccess: List<LabelValue> get() = root.getJSONArray("printingAccess").toLabelValues()
    val tlmResources: List<LabelValue> get() = root.getJSONArray("tlmResources").toTlmLabelValues()

    private fun org.json.JSONArray.toTlmLabelValues(): List<LabelValue> {
        val out = mutableListOf<LabelValue>()
        for (i in 0 until length()) {
            val o = getJSONObject(i)
            val value = if (o.has("value")) o.getString("value") else o.getString("id")
            out.add(LabelValue(value, o.getString("label")))
        }
        return out
    }

    private fun org.json.JSONArray.toStringList(): List<String> {
        val out = mutableListOf<String>()
        for (i in 0 until length()) out.add(getString(i))
        return out
    }

    private fun org.json.JSONArray.toLabelValues(): List<LabelValue> {
        val out = mutableListOf<LabelValue>()
        for (i in 0 until length()) {
            val o = getJSONObject(i)
            out.add(LabelValue(o.getString("value"), o.getString("label")))
        }
        return out
    }
}
