package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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
import com.tippingpoint.pedastudio.ui.theme.AccentTeal
import com.tippingpoint.pedastudio.ui.theme.PrimaryDark
import com.tippingpoint.pedastudio.ui.theme.PrimarySteel

@Composable
fun RegisterStep3Screen(
    prefs: UserPreferences,
    maharashtra: MaharashtraRepository,
    onBack: () -> Unit = {},
    onContinue: () -> Unit,
) {
    val s = LocalAppStrings.current
    var schoolName by remember { mutableStateOf(prefs.schoolName) }
    var location by remember { mutableStateOf(prefs.location) }
    var pinCode by remember { mutableStateOf(prefs.pinCode) }
    var studentCount by remember { mutableStateOf(prefs.studentCount.toFloat().coerceIn(10f, 80f)) }
    var selectedResources by remember { mutableStateOf(prefs.getTeacherResources().toSet()) }
    var internet by remember { mutableStateOf(prefs.internetAccess) }
    var printing by remember { mutableStateOf(prefs.printingAccess) }

    val locationOptions = listOf(
        "urban" to s.urban,
        "semi_urban" to s.semiUrban,
        "rural" to s.rural,
    )
    val tlmOptions = remember(maharashtra.tlmResources) {
        maharashtra.tlmResources.map { it.value to it.label }
    }
    val internetOptions = remember(maharashtra.internetAccess) {
        maharashtra.internetAccess.map { it.value to it.label }
    }
    val printingOptions = remember(maharashtra.printingAccess) {
        maharashtra.printingAccess.map { it.value to it.label }
    }

    val canContinue = schoolName.isNotBlank() &&
        location.isNotBlank() &&
        pinCode.length == 6 &&
        internet.isNotBlank() &&
        printing.isNotBlank()

    RegisterScaffold(
        title = s.registration,
        stepLabel = s.step3,
        buttonText = s.goToHome,
        canContinue = canContinue,
        onBack = onBack,
        onContinue = {
            prefs.schoolName = schoolName.trim()
            prefs.location = location
            prefs.pinCode = pinCode
            prefs.studentCount = studentCount.toInt()
            prefs.setTeacherResources(selectedResources.toList())
            prefs.internetAccess = internet
            prefs.printingAccess = printing
            prefs.profileComplete = true
            onContinue()
        },
    ) {
        FormSectionCard(title = s.schoolDetails, subtitle = s.schoolDetailsSub) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedFormField(
                    value = schoolName,
                    onValueChange = { schoolName = it },
                    label = s.schoolName,
                )

                FieldLabel(s.locationType)
                RadioOptionList(
                    options = locationOptions,
                    selected = location,
                    onSelect = { location = it },
                )

                OutlinedFormField(
                    value = pinCode,
                    onValueChange = { pinCode = it.filter { c -> c.isDigit() }.take(6) },
                    label = s.pinCode,
                )
            }
        }

        FormSectionCard(title = s.classSize, subtitle = s.classSizeSub) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = "${studentCount.toInt()} ${s.students}",
                    fontWeight = FontWeight.Bold,
                    color = AccentTeal,
                    fontSize = 18.sp,
                )
                Slider(
                    value = studentCount,
                    onValueChange = { studentCount = it },
                    valueRange = 10f..80f,
                    steps = 69,
                    modifier = Modifier.fillMaxWidth(),
                    colors = SliderDefaults.colors(
                        thumbColor = AccentTeal,
                        activeTrackColor = AccentTeal,
                        inactiveTrackColor = PrimarySteel.copy(alpha = 0.2f),
                    ),
                )
                Text(
                    text = "10 — 80",
                    fontSize = 12.sp,
                    color = PrimaryDark.copy(alpha = 0.5f),
                    modifier = Modifier.padding(top = 2.dp),
                )
            }
        }

        FormSectionCard(title = s.classroomResources, subtitle = s.classroomResourcesSub) {
            ChipMultiSelect(
                label = s.teachingMaterials,
                options = tlmOptions,
                selected = selectedResources,
                onToggle = { id ->
                    selectedResources = if (id in selectedResources) selectedResources - id else selectedResources + id
                },
            )
        }

        FormSectionCard(title = s.technology, subtitle = s.technologySub) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                DropdownPicker(
                    label = s.internetAccess,
                    options = internetOptions,
                    selectedValue = internet,
                    onSelect = { internet = it },
                    placeholder = s.selectInternet,
                    searchable = false,
                )

                DropdownPicker(
                    label = s.printingAccess,
                    options = printingOptions,
                    selectedValue = printing,
                    onSelect = { printing = it },
                    placeholder = s.selectPrinting,
                    searchable = false,
                )
            }
        }
    }
}
