package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.tippingpoint.pedastudio.data.IndiaStates
import com.tippingpoint.pedastudio.data.MaharashtraRepository
import com.tippingpoint.pedastudio.data.UserPreferences
import com.tippingpoint.pedastudio.i18n.LocalAppStrings
import com.tippingpoint.pedastudio.ui.components.ChipMultiSelect
import com.tippingpoint.pedastudio.ui.components.DropdownPicker
import com.tippingpoint.pedastudio.ui.components.FieldLabel
import com.tippingpoint.pedastudio.ui.components.FormSectionCard
import com.tippingpoint.pedastudio.ui.components.OutlinedFormField
import com.tippingpoint.pedastudio.ui.components.RadioOptionList
import com.tippingpoint.pedastudio.ui.components.RegisterScaffold

private val GRADES = listOf(0 to "KG", 1 to "1", 2 to "2", 3 to "3", 4 to "4", 5 to "5", 6 to "6", 7 to "7", 8 to "8")
private val SUBJECTS = listOf("english" to "English", "marathi" to "Marathi", "hindi" to "Hindi", "maths" to "Maths", "evs" to "EVS", "social" to "Social")

@Composable
fun EditProfileScreen(
    prefs: UserPreferences,
    maharashtra: MaharashtraRepository,
    onBack: () -> Unit,
    onSaved: () -> Unit,
) {
    val s = LocalAppStrings.current
    var name by remember { mutableStateOf(prefs.teacherName) }
    var state by remember { mutableStateOf(prefs.state.ifBlank { IndiaStates.MAHARASHTRA }) }
    var district by remember { mutableStateOf(prefs.district) }
    var districtManual by remember { mutableStateOf(if (maharashtra.hasDistrictList(prefs.state)) "" else prefs.district) }
    var adminType by remember { mutableStateOf(prefs.adminType) }
    var adminName by remember { mutableStateOf(prefs.zpName.ifBlank { prefs.corpName }) }
    var medium by remember { mutableStateOf(prefs.medium) }
    var comfort by remember { mutableStateOf(prefs.englishComfort) }
    var selectedGrades by remember { mutableStateOf(prefs.getTeacherGrades().toSet()) }
    var selectedSubjects by remember { mutableStateOf(prefs.getTeacherSubjects().toSet()) }
    var schoolName by remember { mutableStateOf(prefs.schoolName) }
    var location by remember { mutableStateOf(prefs.location) }
    var pinCode by remember { mutableStateOf(prefs.pinCode) }

    val comfortOptions = listOf("difficult" to s.comfortLow, "stumbling" to s.comfortMed, "comfortable" to s.comfortHigh)
    val locationOptions = listOf("urban" to s.urban, "semi_urban" to s.semiUrban, "rural" to s.rural)
    val stateOptions = remember { maharashtra.states.map { it.value to it.label } }
    val hasDistrictList = maharashtra.hasDistrictList(state)
    val districtOptions = remember(state) { maharashtra.districtsForState(state).sorted().map { it to it } }
    val resolvedDistrict = if (hasDistrictList) district else districtManual.trim()
    val isMaharashtra = state == IndiaStates.MAHARASHTRA

    RegisterScaffold(
        title = s.editProfile,
        stepLabel = s.profileTitle,
        buttonText = s.saveProfile,
        canContinue = name.isNotBlank() && state.isNotBlank() && resolvedDistrict.isNotBlank(),
        onBack = onBack,
        onContinue = {
            prefs.teacherName = name.trim()
            prefs.state = state
            prefs.district = resolvedDistrict
            prefs.adminType = adminType
            if (adminType == "zp") { prefs.zpName = adminName; prefs.corpName = "" }
            else if (adminType == "corp") { prefs.corpName = adminName; prefs.zpName = "" }
            prefs.medium = medium
            prefs.englishComfort = comfort
            prefs.setTeacherGrades(selectedGrades.sorted())
            prefs.setTeacherSubjects(selectedSubjects.toList())
            prefs.schoolName = schoolName.trim()
            prefs.location = location
            prefs.pinCode = pinCode
            onSaved()
        },
    ) {
        FormSectionCard(title = s.yourName, subtitle = s.yourNameSub) {
            OutlinedFormField(value = name, onValueChange = { name = it }, label = s.fullName)
        }
        FormSectionCard(title = s.whatYouTeach, subtitle = s.whatYouTeachSub) {
            ChipMultiSelect(
                label = s.grades,
                options = GRADES.map { it.first.toString() to it.second },
                selected = selectedGrades.map { it.toString() }.toSet(),
                onToggle = { id ->
                    val g = id.toIntOrNull() ?: return@ChipMultiSelect
                    selectedGrades = if (g in selectedGrades) selectedGrades - g else selectedGrades + g
                },
            )
            if (!selectedGrades.all { it == 0 }) {
                ChipMultiSelect(label = s.subjects, options = SUBJECTS, selected = selectedSubjects, onToggle = { id ->
                    selectedSubjects = if (id in selectedSubjects) selectedSubjects - id else selectedSubjects + id
                })
            }
        }
        FormSectionCard(title = s.whereYouWork, subtitle = s.whereYouWorkSub) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                DropdownPicker(label = s.state, options = stateOptions, selectedValue = state, onSelect = { state = it; district = ""; districtManual = "" }, placeholder = s.selectState)
                if (hasDistrictList) {
                    DropdownPicker(label = s.district, options = districtOptions, selectedValue = district, onSelect = { district = it }, placeholder = s.selectDistrict)
                } else {
                    OutlinedFormField(value = districtManual, onValueChange = { districtManual = it }, label = s.districtName)
                }
                FieldLabel(s.adminType)
                RadioOptionList(options = maharashtra.administrationTypes.map { it.value to it.label }, selected = adminType, onSelect = { adminType = it; adminName = "" })
                if (isMaharashtra && adminType == "zp") {
                    DropdownPicker(label = s.zp, options = maharashtra.zillaParishads.map { it to it }, selectedValue = adminName, onSelect = { adminName = it }, placeholder = s.selectZp)
                }
                if (isMaharashtra && adminType == "corp") {
                    DropdownPicker(label = s.corp, options = maharashtra.municipalCorporations.map { it to it }, selectedValue = adminName, onSelect = { adminName = it }, placeholder = s.selectCorp)
                }
                DropdownPicker(label = s.schoolMedium, options = maharashtra.mediums.map { it.value to it.label }, selectedValue = medium, onSelect = { medium = it }, placeholder = s.selectMedium)
                FieldLabel(s.englishComfort)
                RadioOptionList(options = comfortOptions, selected = comfort, onSelect = { comfort = it })
            }
        }
        FormSectionCard(title = s.schoolDetails, subtitle = s.schoolDetailsSub) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedFormField(value = schoolName, onValueChange = { schoolName = it }, label = s.schoolName)
                FieldLabel(s.locationType)
                RadioOptionList(options = locationOptions, selected = location, onSelect = { location = it })
                OutlinedFormField(value = pinCode, onValueChange = { pinCode = it.filter { c -> c.isDigit() }.take(6) }, label = s.pinCode)
            }
        }
    }
}
